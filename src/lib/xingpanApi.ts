/**
 * 星盘 VIP API 集成模块
 * 官网: http://www.xingpan.vip
 * 测试Token: 989f888c4283e2cc2d8a5aa4af60932c
 */

const API_BASE = "http://www.xingpan.vip/astrology/api";
const TEST_TOKEN = "989f888c4283e2cc2d8a5aa4af60932c";

// 请求超时
const TIMEOUT = 10000;

// 请求封装
async function fetchAPI(endpoint: string, params: Record<string, any>): Promise<any> {
  const url = `${API_BASE}/${endpoint}`;
  
  const queryString = new URLSearchParams({
    access_token: TEST_TOKEN,
    ...params
  }).toString();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(`${url}?${queryString}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// API 接口定义
export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: number;
}

// 本命盘
export async function getNatalChart(data: BirthData) {
  return fetchAPI("natal", {
    year: data.year,
    month: data.month,
    day: data.day,
    hour: data.hour,
    minute: data.minute,
    lat: data.latitude,
    lng: data.longitude,
    sys: "P",  // 宫位系统: P=Placidus
    planet: 1  // 是否计算行星: 1=是
  });
}

// 合盘 - 比较盘
export async function getSynastry(chart1: BirthData, chart2: BirthData) {
  return fetchAPI("synastry", {
    y1: chart1.year, m1: chart1.month, d1: chart1.day,
    h1: chart1.hour, i1: chart1.minute,
    y2: chart2.year, m2: chart2.month, d2: chart2.day,
    h2: chart2.hour, i2: chart2.minute,
    lat: chart1.latitude, lng: chart1.longitude,
    lat2: chart2.latitude, lng2: chart2.longitude,
    sys: "P"
  });
}

// 推运盘 - 行运盘
export async function getTransit(chart: BirthData, transitYear: number, transitMonth: number, transitDay: number) {
  return fetchAPI("transit", {
    year: chart.year,
    month: chart.month,
    day: chart.day,
    hour: chart.hour,
    minute: chart.minute,
    lat: chart.latitude,
    lng: chart.longitude,
    sys: "P",
    tyear: transitYear,
    tmonth: transitMonth,
    tday: transitDay
  });
}

// 每日运势
export async function getDailyHoroscope(sign: string) {
  return fetchAPI("dayiyun", {
    sign
  });
}

// 年度运势
export async function getYearlyHoroscope(sign: string, year: number) {
  return fetchAPI("yearly", {
    sign,
    year
  });
}

// 星盘解读
export async function getChartInterpretation(data: BirthData) {
  // 获取本命盘数据后再请求解读
  const chartData = await getNatalChart(data);
  return fetchAPI("interpretation", {
    data: JSON.stringify(chartData)
  });
}

// 备用 API: 探数数据 (免费测试)
export async function getTanshuHoroscope(name: string, year: number, month: number, day: number, hour: number) {
  const API_KEY = "demo"; // 需要替换为真实API Key
  const url = `https://api.tanshuapi.com/api/constellation/v1/index?key=${API_KEY}&name=${name}&year=${year}&month=${month}&day=${day}&hour=${hour}`;
  
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Tanshu API Error:", error);
    throw error;
  }
}

// 导出
const xingpanApi = {
  getNatalChart,
  getSynastry,
  getTransit,
  getDailyHoroscope,
  getYearlyHoroscope,
  getChartInterpretation,
  getTanshuHoroscope
};

export default xingpanApi;