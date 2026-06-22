import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const sendSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "HTML content is required"),
});

// POST /api/newsletter/send - Send email via Resend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = sendSchema.parse(body);

    const { email, subject, html } = validated;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "RESEND_API_KEY not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "星缘周运势 <newsletter@lunaxstar.com>",
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { success: false, message: `Failed to send email: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data: { id: data?.id },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Newsletter send error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
