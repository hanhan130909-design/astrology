import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { email1 } from "@/lib/emailSequence";

// Resend Audience
const AUDIENCE_ID =
  process.env.RESEND_AUDIENCE_ID || "62187bb3-e105-4861-b26d-2e5b2eb61c5c";

// POST /api/subscribe — add subscriber + save chart data + send Day 0 email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : undefined;
    const source = typeof body?.source === "string" ? body.source : "unknown";

    // Chart data (optional but highly recommended for personalization)
    const chartData = {
      moonSign: body?.moonSign || undefined,
      risingSign: body?.risingSign || undefined,
      sunSign: body?.sunSign || undefined,
      venusSign: body?.venusSign || undefined,
      marsSign: body?.marsSign || undefined,
      jupiterSign: body?.jupiterSign || undefined,
      saturnSign: body?.saturnSign || undefined,
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "invalid_email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "not_configured" }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const nowMs = Date.now();

    // 1. Save to Firestore (for email sequence tracking)
    let isNewSubscriber = true;
    if (isFirebaseConfigured && db) {
      try {
        const now = Timestamp.now();
        const subDoc = doc(db, "email_subscribers", email);
        const existing = await getDoc(subDoc);
        if (existing.exists()) {
          isNewSubscriber = false;
          // Update chart data if provided
          if (Object.values(chartData).some(v => v)) {
            await setDoc(subDoc, { ...chartData, updatedAt: now }, { merge: true });
          }
        } else {
          await setDoc(subDoc, {
            email,
            name: name || null,
            source,
            ...chartData,
            subscribedAt: now,
            sequenceStep: 0,
            lastEmailAt: now,
            unsubscribed: false,
          });
        }
      } catch (fbErr) {
        console.error("Firebase save error (non-fatal):", fbErr);
      }
    }

    // 2. Add to Resend audience (for broadcast emails)
    let alreadyInResend = false;
    const { error: contactErr } = await resend.contacts.create({
      email,
      firstName: name,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    });

    if (contactErr) {
      const msg = (contactErr.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("exist")) {
        alreadyInResend = true;
      } else {
        console.error("Resend contact error:", contactErr);
      }
    }

    // 3. Send Day 0 personalized email (only for new subscribers)
    if (isNewSubscriber && !alreadyInResend) {
      const subscriberData = {
        email,
        name: name || undefined,
        ...chartData,
        subscribedAt: nowMs,
        sequenceStep: 0,
        source,
      };
      const { subject, html } = email1(subscriberData);

      const { error: mailErr } = await resend.emails.send({
        from: "LunaXStar <newsletter@lunaxstar.com>",
        to: [email],
        subject,
        html,
      });
      if (mailErr) {
        console.error("Day 0 email error:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: isNewSubscriber ? "subscribed" : "already",
      isNew: isNewSubscriber,
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({
      success: false,
      message: "error",
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
