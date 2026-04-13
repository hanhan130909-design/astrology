/**
 * 专业星盘 API 服务
 * 支持: xingpan.vip API
 * 
 * API 文档: http://www.xingpan.vip/astrology/Apiinterface
 * 测试 Token: 989f888c4283e2cc2d8a5aa4af60932c
 */

interface BirthData {
  name?: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  latitude: number;
  longitude: number;
  timezone?: number;
  gender?: string;
}

// xingpan.vip API 配置
const XINGPAN_API = 'http://www.xingpan.vip/astrology/api';
const TEST_TOKEN = '989f888c4283e2cc2d8a5aa4af60932c';

// API 错误处理
class AstrologyAPIError extends Error {
  constructor(
    message: string,
    public code?: string | number,
    public status?: number
  ) {
    super(message);
    this.name = 'AstrologyAPIError';
  }
}

// 通用 API 调用
async function callXingpanAPI<T>(endpoint: string, params: Record<string, any>): Promise<T> {
  const url = new URL(`${XINGPAN_API}/${endpoint}`);
  url.searchParams.set('access_token', TEST_TOKEN);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new AstrologyAPIError(
        `API request failed: ${response.status}`,
        response.status,
        response.status
      );
    }

    const data = await response.json();
    
    if (data.code && data.code !== 0) {
      throw new AstrologyAPIError(
        data.msg || 'API returned error',
        data.code
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AstrologyAPIError) {
      throw error;
    }
    throw new AstrologyAPIError(
      error instanceof Error ? error.message : 'Network error',
      undefined,
      undefined
    );
  }
}

// ==================== API 函数 ====================

/**
 * 获取本命盘数据
 * 
 * @param birthData - 出生数据
 * @returns 星盘数据
 */
export async function getNatalChart(birthData: BirthData) {
  return callXingpanAPI('natal', {
    year: birthData.year,
    month: birthData.month,
    day: birthData.day,
    hour: birthData.hour,
    minute: birthData.minute || 0,
    lat: birthData.latitude,
    lng: birthData.longitude,
    sys: 'P',  // 宫位系统: P=Placidus, E=Equal, K=Koch
    planet: 1  // 是否计算行星
  });
}

/**
 * 获取合盘数据 (比较盘)
 * 
 * @param chart1 - 第一张星盘
 * @param chart2 - 第二张星盘
 */
export async function getSynastryChart(chart1: BirthData, chart2: BirthData) {
  return callXingpanAPI('synastry', {
    y1: chart1.year, m1: chart1.month, d1: chart1.day,
    h1: chart1.hour, i1: chart1.minute || 0,
    y2: chart2.year, m2: chart2.month, d2: chart2.day,
    h2: chart2.hour, i2: chart2.minute || 0,
    lat: chart1.latitude, lng: chart1.longitude,
    lat2: chart2.latitude, lng2: chart2.longitude,
    sys: 'P'
  });
}

/**
 * 获取推运盘数据
 * 
 * @param birthData - 出生数据
 * @param transitDate - 推运日期
 */
export async function getTransitChart(
  birthData: BirthData,
  transitDate: { year: number; month: number; day: number }
) {
  return callXingpanAPI('transit', {
    year: birthData.year,
    month: birthData.month,
    day: birthData.day,
    hour: birthData.hour,
    minute: birthData.minute || 0,
    lat: birthData.latitude,
    lng: birthData.longitude,
    sys: 'P',
    tyear: transitDate.year,
    tmonth: transitDate.month,
    tday: transitDate.day
  });
}

/**
 * 获取每日运势
 */
export async function getDailyHoroscope(sign: string) {
  return callXingpanAPI('dayiyun', {
    sign: sign.toLowerCase()
  });
}

/**
 * 获取年度运势
 */
export async function getYearlyHoroscope(sign: string, year: number) {
  return callXingpanAPI('yearly', {
    sign: sign.toLowerCase(),
    year
  });
}

/**
 * 获取星盘解读
 */
export async function getChartInterpretation(data: BirthData) {
  // 先获取本命盘
  const chartData = await getNatalChart(data);
  
  // 获取解读
  return callXingpanAPI('interpretation', {
    data: JSON.stringify(chartData)
  });
}

/**
 * 获取配对盘 (Davanala)
 */
export async function getDavanalChart(chart1: BirthData, chart2: BirthData) {
  return callXingpanAPI('davanal', {
    y1: chart1.year, m1: chart1.month, d1: chart1.day,
    h1: chart1.hour, i1: chart1.minute || 0,
    y2: chart2.year, m2: chart2.month, d2: chart2.day,
    h2: chart2.hour, i2: chart2.minute || 0,
    lat: chart1.latitude, lng: chart1.longitude,
    lat2: chart2.latitude, lng2: chart2.longitude
  });
}

/**
 * 测试 API 连接
 */
export async function testAPIConnection(): Promise<boolean> {
  try {
    const response = await fetch(
      `${XINGPAN_API}/natal?access_token=${TEST_TOKEN}&year=1990&month=6&day=15&hour=12&minute=0&lat=39.9&lng=116.4&sys=P&planet=1`,
      { method: 'GET' }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.code === 0;
    }
    return false;
  } catch {
    return false;
  }
}

export { AstrologyAPIError };
