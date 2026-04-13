import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// In-memory store (replace with database in production)
const subscribers = new Map<string, { email: string; zodiac: string; language: string; createdAt: Date }>();

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  zodiac: z.string().min(1, "Zodiac sign is required"),
  language: z.enum(["zh", "en", "id"]).default("zh"),
});

// POST /api/subscribe - Subscribe to daily horoscope
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = subscribeSchema.parse(body);
    
    const { email, zodiac, language } = validated;
    
    // Check if already subscribed
    if (subscribers.has(email)) {
      return NextResponse.json(
        { success: false, error: "Email already subscribed" },
        { status: 409 }
      );
    }
    
    // Store subscription
    subscribers.set(email, {
      email,
      zodiac,
      language,
      createdAt: new Date(),
    });
    
    // Send welcome email (mock)
    console.log(`[Subscribe] ${email} subscribed for ${zodiac} horoscope in ${language}`);
    
    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to daily horoscope",
      data: { email, zodiac, language },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

// DELETE /api/subscribe - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }
    
    if (!subscribers.has(email)) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      );
    }
    
    subscribers.delete(email);
    
    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}

// GET /api/subscribe - Get subscriber info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (!email) {
      // Return all subscribers count (admin only in production)
      return NextResponse.json({
        success: true,
        count: subscribers.size,
      });
    }
    
    const subscriber = subscribers.get(email);
    
    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Subscriber not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    console.error("Get subscriber error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get subscriber" },
      { status: 500 }
    );
  }
}
