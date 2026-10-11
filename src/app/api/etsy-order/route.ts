import { NextRequest, NextResponse } from "next/server";
import { generateCareerTimingPDF } from "@/lib/careerReportGenerator";
import { Resend } from "resend";

// Etsy Webhook Receiver + Auto Fulfillment
// Triggered by Make.com when a new Etsy order is created
// Expects JSON: { orderId, buyerEmail, buyerName, personalization: { year, month, day, hour, minute, gender } }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    console.log("Etsy order received:", JSON.stringify(body).slice(0, 500));

    const {
      orderId,
      buyerEmail,
      buyerName,
      personalization,
    } = body;

    // Validate required fields
    if (!buyerEmail || !personalization) {
      return NextResponse.json(
        { success: false, error: "Missing buyerEmail or personalization" },
        { status: 400 }
      );
    }

    const { year, month, day, hour, minute, gender } = personalization;

    if (!year || !month || !day) {
      return NextResponse.json(
        { success: false, error: "Missing birth date in personalization" },
        { status: 400 }
      );
    }

    // Generate PDF report
    const pdfBuffer = generateCareerTimingPDF({
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: hour ? parseInt(hour) : 12,
      minute: minute ? parseInt(minute) : 0,
      gender: gender ? parseInt(gender) : 1,
      name: buyerName || "Seeker",
    });

    // Send PDF via email
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "LunaXStar Bazi <orders@lunaxstar.com>",
        to: [buyerEmail],
        subject: `Your Career Timing Report is Ready, ${buyerName || "Friend"} ✨`,
        html: `
          <div style="font-family:-apple-system,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#171717;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="font-size:36px;">🔮</div>
              <h1 style="font-size:22px;font-weight:700;margin:8px 0;">Your Report Is Ready</h1>
            </div>
            <p style="font-size:15px;line-height:1.7;">Hi ${buyerName || "there"},</p>
            <p style="font-size:15px;line-height:1.7;">Your personalized Career Timing Report is attached. It includes:</p>
            <ul style="font-size:14px;line-height:1.8;color:#555;">
              <li>Your Day Master & Natural Earning Style</li>
              <li>Five Element Balance & Best Industries</li>
              <li>Wealth Style & Money Block</li>
              <li>Current Luck Pillar 2026-2027</li>
              <li>90-Day Action Plan</li>
            </ul>
            <p style="font-size:15px;line-height:1.7;">If you have any questions, just reply to this email.</p>
            <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #eee;">
              <p style="font-size:12px;color:#999;">LunaXStar Bazi · lunaxstar.com</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `Career-Timing-Report-${(buyerName || "report").replace(/\s+/g, "-")}.pdf`,
            content: pdfBuffer.toString("base64"),
          },
        ],
      });
      console.log(`Report sent to ${buyerEmail} for order ${orderId}`);
    } else {
      console.warn("RESEND_API_KEY not set, skipping email send");
    }

    // Store order in Firestore if available
    try {
      const { db } = await import("@/lib/firebase");
      if (db) {
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        await addDoc(collection(db, "etsy_orders"), {
          orderId,
          buyerEmail,
          buyerName,
          personalization,
          status: "fulfilled",
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.warn("Firestore write failed:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Order fulfilled, report generated and sent",
      orderId,
    });
  } catch (error) {
    console.error("Etsy order processing error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "etsy-auto-fulfillment",
    endpoint: "/api/etsy-order",
    expectedPayload: {
      orderId: "string",
      buyerEmail: "string",
      buyerName: "string",
      personalization: {
        year: "number",
        month: "number",
        day: "number",
        hour: "number (optional)",
        minute: "number (optional)",
        gender: "number (optional, 1=male 0=female)",
      },
    },
  });
}
