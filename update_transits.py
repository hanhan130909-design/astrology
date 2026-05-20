import re

# Read the file
with open('src/app/transits/page.tsx', 'r', encoding='utf-8', newline='') as f:
    content = f.read()

# Step 1: Add faq state after openFaq state
old_state = 'const [openFaq, setOpenFaq] = useState<number>(-1);'
new_state = '''const [openFaq, setOpenFaq] = useState<number>(-1);
  const [faq, setFaq] = useState(0);'''
content = content.replace(old_state, new_state)

# Step 2: Find and replace the existing FAQ section
# The existing FAQ section starts with comment {/* FAQ Section */} or the section tag
faq_start = content.find('{/* FAQ Section */}')
if faq_start == -1:
    faq_start = content.find('<section className="max-w-4xl mx-auto mb-12 px-4">')

if faq_start != -1:
    # Find the end of this section (the closing </section>)
    faq_end = content.find('</section>', faq_start)
    if faq_end != -1:
        faq_end = faq_end + len('</section>')
        
        # New FAQ section from task
        new_faq = '''            {/* FAQ */}
            <section className="max-w-4xl mx-auto mt-16 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">常见问题</h2>
              <div className="space-y-3">
                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button onClick={() => setFaq(1)} className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors">
                    <span className="text-white font-medium">什么是推运盘？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${faq===1?'rotate-180':''}`} />
                  </button>
                  {faq===1 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">推运盘将当前行星位置覆盖在本命盘上，分析当下及未来的运势变化。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: A transit chart overlays current planetary positions onto your natal chart.</p>
                      <p className="text-purple-300/70 text-xs">ID: Transit chart menimpakan posisi planet saat ini ke chart natal Anda.</p>
                    </div>
                  )}
                </div>
                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button onClick={() => setFaq(2)} className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors">
                    <span className="text-white font-medium">推运盘准确吗？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${faq===2?'rotate-180':''}`} />
                  </button>
                  {faq===2 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">准确度取决于出生时间精确度，15分钟内误差依然高度可靠。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Accuracy depends on birth time precision. Within 15 min it remains highly reliable.</p>
                      <p className="text-purple-300/70 text-xs">ID: Akurasi tergantung ketepatan waktu kelahiran. Dalam 15 menit masih sangat andal.</p>
                    </div>
                  )}
                </div>
                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button onClick={() => setFaq(3)} className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors">
                    <span className="text-white font-medium">如何解读推运盘？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${faq===3?'rotate-180':''}`} />
                  </button>
                  {faq===3 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">重点关注与个人行星形成合相、对分相、四分相的过境行星。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Focus on transiting planets forming hard aspects to your personal planets.</p>
                      <p className="text-purple-300/70 text-xs">ID: Fokus pada planet transiting yang membentuk aspek keras ke planet pribadi Anda.</p>
                    </div>
                  )}
                </div>
                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button onClick={() => setFaq(4)} className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors">
                    <span className="text-white font-medium">推运盘和本命盘有什么区别？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${faq===4?'rotate-180':''}`} />
                  </button>
                  {faq===4 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">本命盘固定不变，推运盘持续变化，用来预测运势。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Natal chart never changes. Transit chart changes constantly for prediction.</p>
                      <p className="text-purple-300/70 text-xs">ID: Chart natal tidak berubah. Transit chart terus berubah untuk prediksi.</p>
                    </div>
                  )}
                </div>
                <div className="border border-purple-500/20 rounded-lg overflow-hidden">
                  <button onClick={() => setFaq(5)} className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-500/5 transition-colors">
                    <span className="text-white font-medium">为什么要看推运盘？</span>
                    <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${faq===5?'rotate-180':''}`} />
                  </button>
                  {faq===5 && (
                    <div className="px-4 pb-4">
                      <p className="text-purple-200 text-sm mb-2">帮你把握重要时机，如换工作、搬家、恋爱等关键节点。</p>
                      <p className="text-purple-300/70 text-xs mb-1">EN: Helps you seize key timing for career changes, moving, relationships.</p>
                      <p className="text-purple-300/70 text-xs">ID: Membantu Anda memanfaatkan waktu penting untuk karier, pindah, hubungan.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>'''

        # Replace old FAQ with new FAQ
        content = content[:faq_start] + new_faq + content[faq_end:]

# Write back
with open('src/app/transits/page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
    
print('File updated successfully!')
