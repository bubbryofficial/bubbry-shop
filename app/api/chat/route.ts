import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1000,
        messages: [
          { role: "system", content: body.system },
          ...body.messages,
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      const errMsg = data.error?.message || JSON.stringify(data.error) || "Groq API error";
      return NextResponse.json({ error: errMsg }, { status: res.status || 400 });
    }

    // Convert Groq's OpenAI-style response to Anthropic-style { content: [{ type, text }] }
    // so the help pages work without any changes
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
    return NextResponse.json({ content: [{ type: "text", text: reply }] });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
