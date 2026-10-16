import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || "team@theqall.com";
    const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@theqall.com";
    const body = await request.json();

    // Server-side validation
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.issues },
        { status: 400 }
      );
    }

    const { fullName, email, barrier, message } = result.data;

    // Send notification email to business
    await resend.emails.send({
      from: `Qall Website <${FROM_EMAIL}>`,
      to: BUSINESS_EMAIL,
      subject: `New Contact: ${fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #042D70;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Primary Barrier</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${barrier}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 8px;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
        </div>
      `,
    });

    // Send confirmation email to user
    await resend.emails.send({
      from: `Qall <${FROM_EMAIL}>`,
      to: email,
      subject: "We received your message — Qall",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #042D70, #021A42); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #F88C00; margin: 0; font-size: 28px;">Qall</h1>
          </div>
          <div style="padding: 40px; background: #ffffff;">
            <h2 style="color: #042D70; margin-top: 0;">Thanks, ${fullName.split(" ")[0]}!</h2>
            <p style="color: #374151; line-height: 1.6;">
              We've received your message and our team is already reviewing your details.
              You can expect to hear from us within 24 hours.
            </p>
            <p style="color: #374151; line-height: 1.6;">
              In the meantime, feel free to explore our
              <a href="https://theqall.com/features" style="color: #F88C00;">platform features</a>
              to see how Qall can transform your brokerage.
            </p>
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              — The Qall Team
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
