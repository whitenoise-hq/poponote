import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SYSTEM_PROMPT = `당신은 반려동물 일기 작성 도우미입니다.
사용자가 올린 반려동물 사진을 분석하고, 반려동물 보호자의 시점에서 따뜻하고 귀여운 한국어 일기를 작성해주세요.

규칙:
- 제목: 20자 이내, 그날의 핵심을 담은 짧은 문장
- 내용: 2~4문장, 사진 속 상황을 묘사하며 보호자의 애정이 담긴 톤
- 반말(~했다, ~였다) 또는 다정한 일기체 사용
- 사진에 반려동물이 없으면 풍경이나 상황 중심으로 작성

반드시 아래 JSON 형식으로만 응답하세요:
{"title": "제목", "body": "내용"}`;

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "인증 필요" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { photoUrl } = await req.json();
    if (!photoUrl) {
      return new Response(JSON.stringify({ error: "photoUrl 필요" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. 이미지 다운로드
    console.log("[generate-diary] downloading photo...");
    const imageResponse = await fetch(photoUrl);
    if (!imageResponse.ok) {
      console.error("[generate-diary] download failed:", imageResponse.status);
      return new Response(JSON.stringify({ error: "이미지 다운로드 실패" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const bytes = new Uint8Array(imageBuffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64Image = btoa(binary);
    const mimeType = imageResponse.headers.get("content-type") ?? "image/jpeg";
    console.log("[generate-diary] downloaded, size:", imageBuffer.byteLength);

    // 2. OpenAI GPT-4.1 Mini 호출
    console.log("[generate-diary] calling OpenAI API...");
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                    detail: "low",
                  },
                },
                {
                  type: "text",
                  text: "이 사진을 보고 반려동물 일기를 작성해주세요.",
                },
              ],
            },
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error(
        "[generate-diary] OpenAI API error:",
        openaiResponse.status,
        errorText
      );
      return new Response(
        JSON.stringify({ error: "AI 일기 생성 실패", detail: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content;
    console.log("[generate-diary] OpenAI response:", content);

    if (!content) {
      return new Response(
        JSON.stringify({ error: "AI 응답이 비어있습니다" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. JSON 파싱
    let parsed: { title: string; body: string };
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("[generate-diary] JSON parse failed:", content);
      return new Response(
        JSON.stringify({ error: "AI 응답 파싱 실패" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!parsed.title || !parsed.body) {
      return new Response(
        JSON.stringify({ error: "AI 응답에 제목 또는 내용이 없습니다" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[generate-diary] done, title:", parsed.title);

    return new Response(
      JSON.stringify({
        success: true,
        title: parsed.title,
        body: parsed.body,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[generate-diary] unexpected error:", err);
    return new Response(JSON.stringify({ error: "서버 오류" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});