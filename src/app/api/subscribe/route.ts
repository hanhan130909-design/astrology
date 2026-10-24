import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { email1 } from "@/lib/emailSequence";

// Firebase Admin SDK for server-side writes
let adminDb: any = null;
let adminInitError: string | null = null;
function getAdminDb() {
  if (adminDb) return adminDb;
  if (adminInitError) return null;
  try {
    const { initializeApp, cert, getApps } = require("firebase-admin/app");
    const { getFirestore } = require("firebase-admin/firestore");
    const saJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
    if (!saJson) {
      adminInitError = "env var not set";
      return null;
    }
    const sa = JSON.parse(saJson);
    if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, '\n');
    
    // Use existing app if already initialized
    const apps = getApps();
    const app = apps.length > 0 ? apps[0] : initializeApp({ credential: cert(sa) });
    adminDb = getFirestore(app);
    return adminDb;
  } catch (e) {
    adminInitError = (e as Error).message;
    console.error("Admin init error:", e);
    return null;
  }
}

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
    const ref = typeof body?.ref === "string" ? body.ref.trim() : null; // referral code

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

    // Generate unique referral code for this user
    const referralCode = email.replace(/[^a-z0-9]/g, '').slice(0, 10) + Math.random().toString(36).slice(2, 6);

    // 1. Save to Firestore using Admin SDK
    let isNewSubscriber = true;
    let firestoreWriteError: string | null = null;
    let firestoreWriteSuccess = false;
    const firestore = getAdminDb();
    if (firestore) {
      try {
        const now = new Date();
        // Filter out undefined values (Firestore doesn't accept undefined)
        const cleanChartData: any = {};
        Object.entries(chartData).forEach(([k, v]) => {
          if (v !== undefined) cleanChartData[k] = v;
        });
        
        const subRef = firestore.collection("email_subscribers").doc(email);
        const existing = await subRef.get();
        if (existing.exists) {
          isNewSubscriber = false;
          const existingData = existing.data();
          if (Object.keys(cleanChartData).length > 0) {
            await subRef.set({ ...cleanChartData, updatedAt: now }, { merge: true });
          }
          // Update referrer's referral count if this user was referred
          if (ref && existingData?.referredBy !== ref) {
            await subRef.set({ referredBy: ref }, { merge: true });
          }
        } else {
          await subRef.set({
            email,
            name: name || null,
            source,
            ...cleanChartData,
            referralCode,
            referredBy: ref,
            referrals: 0,
            subscribedAt: now,
            sequenceStep: 0,
            lastEmailAt: now,
            unsubscribed: false,
          });
          
          // Update referrer's referral count
          if (ref) {
            const referrerQuery = await firestore.collection("email_subscribers")
              .where("referralCode", "==", ref)
              .limit(1)
              .get();
            if (!referrerQuery.empty) {
              const referrerDoc = referrerQuery.docs[0];
              const currentReferrals = referrerDoc.data().referrals || 0;
              await referrerDoc.ref.set({ referrals: currentReferrals + 1 }, { merge: true });
            }
          }
        }
        firestoreWriteSuccess = true;
      } catch (fbErr) {
        firestoreWriteError = (fbErr as Error).message;
        console.error("Firebase save error:", fbErr);
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
        referralCode,
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
      referralCode: isNewSubscriber ? referralCode : undefined,
      referralLink: isNewSubscriber ? `https://lunaxstar.com/?ref=${referralCode}` : undefined,
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
