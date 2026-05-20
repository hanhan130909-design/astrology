#!/usr/bin/env python3
"""为 transits/page.tsx 添加 FAQ 区块"""
import re

FILE = r"C:\Users\user\.qclaw\astrology-clean\src\app\transits\page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. 检查是否已有 FAQ
if "常见问题" in content:
    print("FAQ already exists, skipping")
    exit(0)

# 2. 添加 useState import（如果还没有）
if "useState" not in content:
    content = content.replace('"use client";', '"use client";\n\nimport { useState } from "react";', 1)
    print("Added useState import")

# 3. 添加 openFaq state（在组件函数开头）
# 找 "export default function" 后的第一行有实际代码的
if "const [openFaq" not in content:
    # 找 "use client" 后的第一个 useEffect 或 const 前插入
    # 简单策略：在第一个 useEffect 或 handleSubmit 前插入
    insert_marker = "  // 状态"
    if insert_marker in content:
        content = content.replace(
            insert_marker,
            '  const [openFaq, setOpenFaq] = useState(-1);\n\n  // 状态',
            1
        )
        print("Added openFaq state")
    else:
        print("WARNING: could not find insertion point for openFaq state")

# 4. 添加 ChevronDown import
if "ChevronDown" not in content:
    # 在 lucide-react import 里加
    content = content.replace(
        "} from \"lucide-react\";",
        "  ChevronDown,\n} from \"lucide-react\";",
        1
    )
    print("Added ChevronDown import")

# 5. FAQ JSX 区块
faq_jsx = """
            {/* FAQ 区块 */}
            <section className="max-w-4xl mx-auto mt-16 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                常见问题
              </h2>
              <div className="space-y-3">
                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 1 ? -1 : 1)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="text-white font-medium">什么是推运盘？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${openFaq === 1 ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === 1 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">推运盘将当前行星位置覆盖在本命盘上，分析当下及未来的运势变化。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: A transit chart overlays current planetary positions onto your natal chart.</p>
                      <p className="text-purple-300/70 text-xs">ID: Transit chart menimpakan posisi planet saat ini ke chart natal Anda.</p>
                    </div>
                  )}
                </div>

                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 2 ? -1 : 2)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="text-white font-medium">推运盘准确吗？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${openFaq === 2 ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === 2 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">准确度取决于出生时间精确度，15分钟内误差依然高度可靠。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Accuracy depends on birth time precision. Within 15 min it remains highly reliable.</p>
                      <p className="text-purple-300/70 text-xs">ID: Akurasi tergantung ketepatan waktu kelahiran. Dalam 15 menit masih sangat andal.</p>
                    </div>
                  )}
                </div>

                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 3 ? -1 : 3)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="text-white font-medium">如何解读推运盘？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${openFaq === 3 ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === 3 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">重点关注与个人行星形成合相、对分相、四分相的过境行星。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Focus on transiting planets forming hard aspects to your personal planets.</p>
                      <p className="text-purple-300/70 text-xs">ID: Fokus pada planet transiting yang membentuk aspek keras ke planet pribadi Anda.</p>
                    </div>
                  )}
                </div>

                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 4 ? -1 : 4)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="text-white font-medium">推运盘和本命盘有什么区别？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${openFaq === 4 ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === 4 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">本命盘固定不变，推运盘持续变化，用来预测运势。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Natal chart never changes. Transit chart changes constantly for prediction.</p>
                      <p className="text-purple-300/70 text-xs">ID: Chart natal tidak berubah. Transit chart terus berubah untuk prediksi.</p>
                    </div>
                  )}
                </div>

                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === 5 ? -1 : 5)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="text-white font-medium">为什么要看推运盘？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${openFaq === 5 ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === 5 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">帮你把握重要时机，如换工作、搬家、恋爱等关键节点。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Helps you seize key timing for career changes, moving, relationships.</p>
                      <p className="text-purple-300/70 text-xs">ID: Membantu Anda memanfaatkan waktu penting untuk karier, pindah, hubungan.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
"""

# 6. 在 </main> 前插入 FAQ
if "</main>" in content:
    content = content.replace("      </main>", faq_jsx + "      </main>", 1)
    print("Inserted FAQ block")
else:
    print("ERROR: </main> not found!")

# 7. 写回文件
with open(FILE, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print("Done! transits/page.tsx updated.")
