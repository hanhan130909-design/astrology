import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// pyswisseph Python 脚本路径
const PYTHON_SCRIPT = process.cwd() + "/scripts/swiss_ephemeris_server.py";

// Python 解释器路径
const PYTHON_PATH = process.env.PYTHON_PATH || "python";

interface NatalChartInput {
  action: "natal_chart" | "planet_position" | "houses";
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  latitude?: number;
  longitude?: number;
  timezone?: number;
  planet?: string;
  system?: string;
}

async function runSwissEphemeris(input: NatalChartInput): Promise<any> {
  const inputJson = JSON.stringify(input);
  
  try {
    const { stdout, stderr } = await execAsync(
      `${PYTHON_PATH} "${PYTHON_SCRIPT}" '${inputJson}'`,
      {
        timeout: 10000, // 10秒超时
        maxBuffer: 1024 * 1024 // 1MB 缓冲
      }
    );
    
    if (stderr && !stdout) {
      return { success: false, error: stderr };
    }
    
    return JSON.parse(stdout);
  } catch (error: any) {
    // 如果 pyswisseph 不可用，回退到简化计算
    if (error.message?.includes("pyswisseph not installed") || 
        error.message?.includes("command not found") ||
        error.message?.includes("not recognized")) {
      return { 
        success: false, 
        error: "pyswisseph not available, using fallback",
        fallback: true
      };
    }
    
    return { success: false, error: error.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const input: NatalChartInput = await request.json();
    
    // 验证必要参数
    if (!input.year || !input.month || !input.day) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: year, month, day" },
        { status: 400 }
      );
    }
    
    // 调用 Python 脚本
    const result = await runSwissEphemeris(input);
    
    // 如果 pyswisseph 不可用，使用 TypeScript 简化版本
    if (result.fallback) {
      const { generateNatalChart } = await import("@/lib/swissEphemeris");
      
      const chart = generateNatalChart(
        input.year,
        input.month,
        input.day,
        input.hour || 12,
        input.minute || 0,
        input.latitude || 0,
        input.longitude || 0,
        input.timezone || 0
      );
      
      return NextResponse.json({
        success: true,
        source: "fallback",
        ...chart
      });
    }
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error("Swiss Ephemeris API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const input: NatalChartInput = {
    action: (searchParams.get("action") as any) || "natal_chart",
    year: parseInt(searchParams.get("year") || "1990"),
    month: parseInt(searchParams.get("month") || "1"),
    day: parseInt(searchParams.get("day") || "1"),
    hour: parseInt(searchParams.get("hour") || "12"),
    minute: parseInt(searchParams.get("minute") || "0"),
    latitude: parseFloat(searchParams.get("latitude") || "0"),
    longitude: parseFloat(searchParams.get("longitude") || "0"),
    timezone: parseFloat(searchParams.get("timezone") || "0")
  };
  
  const result = await runSwissEphemeris(input);
  
  return NextResponse.json(result);
}