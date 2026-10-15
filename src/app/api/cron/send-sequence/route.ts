/**
 * Email Sequence Cron — sends Day 1-7 emails automatically
 *
 * Called by Vercel Cron daily at UTC 00:00.
 * Checks all subscribers, sends the next email if enough time has passed.
 *
 * Schedule: daily (every 24h)
 * Email timing:
 *   Step 0 (Day 0) - sent immediately at signup
 *   Step 1 (Day 1) - 24h after signup
 *   Step 2 (Day 2) - 48h after signup
 *   Step 3 (Day 3) - 72h after signup
 *   Step 4 (Day 5) - 120h (skip Day 4)
 *   Step 5 (Day 6) - 144h
 *   Step 6 (Day 7) - 168h (final conversion push)
 */
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { getEmail, TOTAL_EMAILS, type SubscriberData } from "@/lib/emailSequence";

// Cron secret for auth
const CRON_SECRET = process.env.CRON_SECRET || "";

// Hours between each email step (index = step number)
// step 0 = immediate, step 1 = 24h later, etc.
const STEP_HOURS = [0, 24, 48, 72, 120, 144, 168];

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Auth check (Vercel Cron sends authorization header)
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}` && !isVercelCron) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isFirebaseConfigured || !db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;

  let sent = 0;
  let skipped = 0;
  let errors = 0;
  const results: string[] = [];

  try {
    // Get all active subscribers who haven't completed the sequence
    const q = query(
      collection(db, "email_subscribers"),
      where("unsubscribed", "==", false)
    );
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const email = data.email;
      const currentStep = data.sequenceStep ?? 0;
      const subscribedAt = data.subscribedAt?.toMillis?.() || data.subscribedAt || now;

      // Already completed all 7 emails
      if (currentStep >= TOTAL_EMAILS) {
        skipped++;
        continue;
      }

      // Calculate hours since subscription
      const hoursSinceSub = (now - subscribedAt) / HOUR;
      const nextStep = currentStep + 1; // next email to send (1-7)
      const requiredHours = STEP_HOURS[nextStep] || 168;

      // Not time yet for next email
      if (hoursSinceSub < requiredHours) {
        skipped++;
        continue;
      }

      // Build subscriber data for template
      const subscriber: SubscriberData = {
        email,
        name: data.name || undefined,
        moonSign: data.moonSign || undefined,
        risingSign: data.risingSign || undefined,
        sunSign: data.sunSign || undefined,
        venusSign: data.venusSign || undefined,
        marsSign: data.marsSign || undefined,
        jupiterSign: data.jupiterSign || undefined,
        saturnSign: data.saturnSign || undefined,
        subscribedAt,
        sequenceStep: nextStep,
        source: data.source || "unknown",
      };

      // Get email template (nextStep-1 because array is 0-indexed)
      const { subject, html } = getEmail(nextStep - 1, subscriber);

      try {
        const { error } = await resend.emails.send({
          from: "LunaXStar <newsletter@lunaxstar.com>",
          to: [email],
          subject,
          html,
        });

        if (error) {
          console.error(`Email send error for ${email}:`, error);
          errors++;
          results.push(`ERROR ${email}: ${error.message}`);
        } else {
          // Update sequence step
          await updateDoc(doc(db, "email_subscribers", email), {
            sequenceStep: nextStep,
            lastEmailAt: Timestamp.now(),
          });
          sent++;
          results.push(`SENT step${nextStep} ${email}: ${subject}`);
        }
      } catch (emailErr) {
        console.error(`Email exception for ${email}:`, emailErr);
        errors++;
        results.push(`EXCEPTION ${email}`);
      }

      // Rate limiting: Resend free tier is 100/day, add small delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      success: true,
      totalSubscribers: snapshot.size,
      sent,
      skipped,
      errors,
      results: results.slice(0, 20), // first 20 for log
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "cron_failed", details: String(error) }, { status: 500 });
  }
}
