const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const TO_EMAIL = "ehddl453@naver.com";

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "인증 필요" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { message, userName, nickname, userEmail } = await req.json();
    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "문의 내용이 비어있습니다" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const html = `
      <h3>[포포노트 문의]</h3>
      <p>${message.trim().replace(/\n/g, "<br>")}</p>
      <hr>
      <p><strong>보낸 사람:</strong> ${userName ?? "알 수 없음"} (${nickname ?? "알 수 없음"})</p>
      <p><strong>이메일:</strong> ${userEmail ?? "알 수 없음"}</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "포포노트 <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: `[포포노트 문의] ${userName ?? "사용자"}`,
        html,
        reply_to: userEmail || undefined,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("[send-inquiry] Resend error:", resendResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "메일 전송 실패" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[send-inquiry] unexpected error:", err);
    return new Response(JSON.stringify({ error: "서버 오류" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});