import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {

  const body = await req.json();

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  await client.messages.create({
    body: `New Order on Bubbry 🫧

Product: ${body.product}
Quantity: ${body.quantity}
Type: ${body.type}`,
    from: "whatsapp:+14155238886",
    to: `whatsapp:${body.shopPhone}`
  });

  return NextResponse.json({ success: true });
}