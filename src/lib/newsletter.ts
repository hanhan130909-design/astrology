/**
 * Newsletter email utility
 * Sends emails via the /api/newsletter/send endpoint
 */

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lunaxstar.com";

/** Welcome email HTML template (Chinese) */
function welcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>欢迎订阅星缘周运势</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:'PingFang SC','Microsoft YaHei','Helvetica Neue',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;margin-top:40px;margin-bottom:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);padding:40px 30px;text-align:center;">
        <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px 0;">🌟 欢迎订阅星缘周运势</h1>
        <p style="color:#cbd5e1;font-size:14px;margin:0;">每周一，星辰为你传讯</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:30px;">
        <p style="font-size:16px;color:#1f2937;line-height:1.8;margin:0 0 16px 0;">
          亲爱的星友，
        </p>
        <p style="font-size:16px;color:#1f2937;line-height:1.8;margin:0 0 16px 0;">
          感谢你订阅<strong>星缘周运势</strong>！🎉 从现在开始，每周一你都会收到我们精心准备的星座运势邮件，内容包括：
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
          <tr>
            <td style="padding:10px 15px;background-color:#f0f9ff;border-radius:8px;margin-bottom:8px;">
              <span style="font-size:15px;color:#0369a1;">🔮 <strong>12星座本周运势</strong> — 太阳、上升、月亮星座全解析</span>
            </td>
          </tr>
          <tr><td style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 15px;background-color:#fdf4ff;border-radius:8px;">
              <span style="font-size:15px;color:#7e22ce;">🌙 <strong>月相与行星行运解读</strong> — 了解天体对你的影响</span>
            </td>
          </tr>
          <tr><td style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 15px;background-color:#fff7ed;border-radius:8px;">
              <span style="font-size:15px;color:#c2410c;">📚 <strong>占星知识小课堂</strong> — 每周一个实用占星技巧</span>
            </td>
          </tr>
          <tr><td style="height:8px;"></td></tr>
          <tr>
            <td style="padding:10px 15px;background-color:#f0fdf4;border-radius:8px;">
              <span style="font-size:15px;color:#15803d;">💫 <strong>幸运日与注意事项</strong> — 助你把握时机</span>
            </td>
          </tr>
        </table>
        <p style="font-size:16px;color:#1f2937;line-height:1.8;margin:0 0 16px 0;">
          如果你想获取更精准的个人运势，欢迎随时访问 <a href="https://lunaxstar.com/natal" style="color:#2563eb;text-decoration:none;font-weight:600;">lunaxstar.com/natal</a>，输入出生信息生成专属本命盘和AI解读。
        </p>
        <div style="text-align:center;margin:30px 0;">
          <a href="https://lunaxstar.com/natal" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">🎯 免费生成我的本命盘</a>
        </div>
        <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0;">
          愿星辰指引你的每一天 ✨<br>
          — 星缘团队
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding:20px 30px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="font-size:12px;color:#9ca3af;margin:0 0 8px 0;">
          此邮件发送至 ${email}。如果不想再收到周运势邮件，你可以随时在邮件底部取消订阅。
        </p>
        <p style="font-size:12px;color:#9ca3af;margin:0;">
          © 2026 星缘 Starry Fate. lunaxstar.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send a welcome email to a new subscriber
 * Call this after successfully saving the subscriber to Firestore.
 */
export async function sendWelcomeEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const html = welcomeEmailHtml(email);
    const subject = "🌟 欢迎订阅星缘周运势 — 每周一星辰为你传讯";

    const response = await fetch(`${API_BASE}/api/newsletter/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, html }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("sendWelcomeEmail error:", error);
    return { success: false, message: "Failed to send welcome email" };
  }
}

/** Weekly horoscope email HTML template */
function weeklyHoroscopeHtml(
  horoscopeContent: string
): string {
  return `
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>星缘本周运势</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:'PingFang SC','Microsoft YaHei','Helvetica Neue',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;margin-top:40px;margin-bottom:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);padding:40px 30px;text-align:center;">
        <h1 style="color:#ffffff;font-size:26px;margin:0 0 8px 0;">🔮 星缘本周运势</h1>
        <p style="color:#cbd5e1;font-size:14px;margin:0;">星辰密语，每周必读</p>
      </td>
    </tr>
    <tr>
      <td style="padding:30px;">
        ${horoscopeContent}
        <div style="text-align:center;margin:30px 0;">
          <a href="https://lunaxstar.com/natal" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#1a1a2e,#0f3460);color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:600;">🎯 查看完整专属运势</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 30px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="font-size:12px;color:#9ca3af;margin:0;">
          © 2026 星缘 Starry Fate. lunaxstar.com — 如需退订，请回复此邮件。
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send weekly horoscope to a batch of subscribers.
 * Sends one email at a time via the API endpoint.
 *
 * @param emails - Array of subscriber email addresses
 * @param horoscopeContent - HTML content of the horoscope
 * @returns Summary of results
 */
export async function sendWeeklyHoroscope(
  emails: string[],
  horoscopeContent: string
): Promise<{ success: boolean; message: string; sent: number; failed: number; errors: string[] }> {
  const html = weeklyHoroscopeHtml(horoscopeContent);
  const subject = "🔮 星缘本周运势 — 十二星座运势解读";
  const errors: string[] = [];
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    try {
      const response = await fetch(`${API_BASE}/api/newsletter/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, html }),
      });

      const result = await response.json();
      if (result.success) {
        sent++;
      } else {
        failed++;
        errors.push(`${email}: ${result.message}`);
      }
    } catch (error) {
      failed++;
      errors.push(`${email}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    // Small delay between sends to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return {
    success: failed === 0,
    message: `Sent ${sent} emails, ${failed} failed`,
    sent,
    failed,
    errors,
  };
}
