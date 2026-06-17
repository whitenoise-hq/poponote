import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const STYLE_PROMPT =
  "anime style illustration of this exact same scene, same subject, same pose, same composition, studio ghibli inspired, soft lighting, vibrant colors, detailed, high quality digital art";

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "인증 필요" }), { status: 401 });
    }

    const { photoUrl, familyId, entryId } = await req.json();
    if (!photoUrl || !familyId) {
      return new Response(JSON.stringify({ error: "photoUrl, familyId 필요" }), { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. 원본 이미지 다운로드
    console.log("[transform] downloading photo...");
    const imageResponse = await fetch(photoUrl);
    if (!imageResponse.ok) {
      console.error("[transform] download failed:", imageResponse.status);
      return new Response(JSON.stringify({ error: "이미지 다운로드 실패" }), { status: 500 });
    }
    const imageBlob = await imageResponse.blob();
    console.log("[transform] downloaded, size:", imageBlob.size);

    // 2. Stability AI img2img 호출
    const formData = new FormData();
    formData.append("image", imageBlob, "photo.jpg");
    formData.append("prompt", STYLE_PROMPT);
    formData.append("negative_prompt", "realistic photo, different animal, different subject, deformed, ugly, blurry, low quality");
    formData.append("output_format", "jpeg");
    formData.append("strength", "0.25");
    formData.append("mode", "image-to-image");

    console.log("[transform] calling Stability API...");
    const stabilityResponse = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      }
    );

    if (!stabilityResponse.ok) {
      const errorText = await stabilityResponse.text();
      console.error("[transform] Stability API error:", stabilityResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "일러스트 변환 실패", detail: errorText }),
        { status: 500 }
      );
    }
    console.log("[transform] Stability API success");

    // 3. 변환 결과를 Storage에 업로드
    const illustrationBlob = await stabilityResponse.blob();
    const illustrationPath = `${familyId}/${Date.now()}_illustration.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("illustrations")
      .upload(illustrationPath, illustrationBlob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("[transform] upload error:", uploadError);
      return new Response(JSON.stringify({ error: "일러스트 저장 실패" }), { status: 500 });
    }

    // 4. signed URL 생성
    const { data: urlData } = await supabase.storage
      .from("illustrations")
      .createSignedUrl(illustrationPath, 60 * 60 * 24 * 365);

    const illustrationUrl = urlData?.signedUrl ?? "";
    console.log("[transform] done, illustration uploaded");

    // 5. entryId가 있으면 DB 업데이트 (없으면 URL만 반환)
    if (entryId) {
      await supabase
        .from("diary_entries")
        .update({ illustration_url: illustrationUrl })
        .eq("id", entryId);
    }

    return new Response(
      JSON.stringify({ success: true, illustrationUrl, illustrationPath }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[transform] unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "서버 오류" }),
      { status: 500 }
    );
  }
});