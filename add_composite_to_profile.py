#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add saved composite charts section to profile/page.tsx
"""

# Read file
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\profile\page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Add import for getSavedCompositeCharts and CompositeChart
old_import = 'import { loadChartsFromCloud, deleteChartFromCloud, SavedChart } from "@/lib/chartSync";'
new_import = '''import { loadChartsFromCloud, deleteChartFromCloud, SavedChart } from "@/lib/chartSync";
import { getSavedCompositeCharts, deleteCompositeChartFromCloud, CompositeChart } from "@/lib/firebase";'''
content = content.replace(old_import, new_import)

# Fix 2: Add translations for composite charts (add to all language objects)
# Add to zh
zh_add = '''    error: "加载失败", retry: "重试",
    compositeCharts: "我的合盘", noCompositeCharts: "暂无保存的合盘",
    loadComposite: "加载合盘", deleteComposite: "删除合盘",
    person1: "第一人", person2: "第二人", composite: "合盘",
    person1Short: "人1", person2Short: "人2",'''
content = content.replace(
    '    error: "加载失败", retry: "重试",',
    zh_add
)

# Add to en
en_add = '''    error: "Failed to load", retry: "Retry",
    compositeCharts: "My Composite Charts", noCompositeCharts: "No saved composite charts",
    loadComposite: "Load Chart", deleteComposite: "Delete Chart",
    person1: "Person 1", person2: "Person 2", composite: "Composite",
    person1Short: "P1", person2Short: "P2",'''
content = content.replace(
    '    error: "Failed to load", retry: "Retry",',
    en_add
)

# Add to id
id_add = '''    error: "Gagal memuat", retry: "Coba Lagi",
    compositeCharts: "Bagan Komposit Saya", noCompositeCharts: "Belum ada bagan komposit",
    loadComposite: "Muat Bagan", deleteComposite: "Hapus Bagan",
    person1: "Orang 1", person2: "Orang 2", composite: "Komposit",
    person1Short: "O1", person2Short: "O2",'''
content = content.replace(
    '    error: "Gagal memuat", retry: "Coba Lagi",',
    id_add
)

# Add to th
th_add = '''    error: "โหลดไม่สำเร็จ", retry: "ลองอีกครั้ง",
    compositeCharts: "แผนภูมิคอมโพสิตของฉัน", noCompositeCharts: "ยังไม่มีแผนภูมิคอมโพสิต",
    loadComposite: "โหลดแผนภูมิ", deleteComposite: "ลบแผนภูมิ",
    person1: "คนที่ 1", person2: "คนที่ 2", composite: "คอมโพสิต",
    person1Short: "ค1", person2Short: "ค2",'''
content = content.replace(
    '    error: "โหลดไม่สำเร็จ", retry: "ลองอีกครั้ง",',
    th_add
)

# Add to vi
vi_add = '''    error: "Tải thất bại", retry: "Thử lại",
    compositeCharts: "Biểu Đồ Kết Hợp Của Tôi", noCompositeCharts: "Chưa có biểu đồ kết hợp",
    loadComposite: "Tải Biểu Đồ", deleteComposite: "Xóa Biểu Đồ",
    person1: "Người 1", person2: "Người 2", composite: "Kết Hợp",
    person1Short: "N1", person2Short: "N2",'''
content = content.replace(
    '    error: "Tải thất bại", retry: "Thử lại",',
    vi_add
)

# Add to ms
ms_add = '''    error: "Gagal memuat", retry: "Cuba lagi",
    compositeCharts: "Bagan Komposit Saya", noCompositeCharts: "Belum ada bagan komposit",
    loadComposite: "Muat Bagan", deleteComposite: "Padam Bagan",
    person1: "Orang 1", person2: "Orang 2", composite: "Komposit",
    person1Short: "O1", person2Short: "O2",'''
content = content.replace(
    '    error: "Gagal memuat", retry: "Cuba lagi",',
    ms_add
)

# Add to ja
ja_add = '''    error: "読み込み失敗", retry: "再試行",
    compositeCharts: "マイ複合チャート", noCompositeCharts: "保存された複合チャートはありません",
    loadComposite: "チャートを読む", deleteComposite: "チャートを削除",
    person1: "一人目", person2: "二人目", composite: "複合",
    person1Short: "人1", person2Short: "人2",'''
content = content.replace(
    '    error: "読み込み失敗", retry: "再試行",',
    ja_add
)

# Add to ko
ko_add = '''    error: "로딩 실패", retry: "다시 시도",
    compositeCharts: "내 합성 차트", noCompositeCharts: "저장된 합성 차트가 없습니다",
    loadComposite: "차트 불러오기", deleteComposite: "차트 삭제",
    person1: "첫 번째 사람", person2: "두 번째 사람", composite: "합성",
    person1Short: "1P", person2Short: "2P",'''
content = content.replace(
    '    error: "로딩 실패", retry: "다시 시도",',
    ko_add
)

# Fix 3: Add state variables for composite charts (after natal charts state)
old_state = '''  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);'''
new_state = '''  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  // Composite chart state
  const [compositeCharts, setCompositeCharts] = useState<CompositeChart[]>([]);
  const [loadingComposite, setLoadingComposite] = useState(false);
  const [compositeError, setCompositeError] = useState<string | null>(null);
  const [deletingCompositeId, setDeletingCompositeId] = useState<string | null>(null);
  const [showCompositeConfirm, setShowCompositeConfirm] = useState<string | null>(null);'''
content = content.replace(old_state, new_state)

# Fix 4: Add useEffect to load composite charts (after natal charts useEffect)
# Find the closing of natal useEffect and add composite useEffect after it
old_useeffect_end = '''      });
  }, [user, isFirebaseReady, lang]);

  const handleLoadChart'''
new_useeffect_end = '''      });
  }, [user, isFirebaseReady, lang]);

  // Load composite charts when user is available
  useEffect(() => {
    if (!user || !isFirebaseReady) {
      setCompositeCharts([]);
      return;
    }
    setLoadingComposite(true);
    setCompositeError(null);
    getSavedCompositeCharts(20)
      .then((data) => {
        setCompositeCharts(data);
        setLoadingComposite(false);
      })
      .catch((err) => {
        console.error("Failed to load composite charts:", err);
        setCompositeError((T[lang]?.error) || "Failed to load");
        setLoadingComposite(false);
      });
  }, [user, isFirebaseReady, lang]);

  const handleLoadChart'''
content = content.replace(old_useeffect_end, new_useeffect_end)

# Fix 5: Add handleLoadCompositeChart function (after handleLoadChart)
old_loadchart_end = '''  const handleLoadChart = (chart: SavedChart) => {
    // Use sessionStorage to pass chart data to natal page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending_chart", JSON.stringify(chart));
      router.push("/natal");
    }
  };

  const handleDeleteChart'''
new_loadchart_end = '''  const handleLoadChart = (chart: SavedChart) => {
    // Use sessionStorage to pass chart data to natal page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending_chart", JSON.stringify(chart));
      router.push("/natal");
    }
  };

  const handleLoadCompositeChart = (composite: CompositeChart) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending_composite", JSON.stringify(composite));
      router.push("/composite");
    }
  };

  const handleDeleteCompositeChart = async (chartId: string) => {
    if (!user) return;
    setDeletingCompositeId(chartId);
    setShowCompositeConfirm(null);
    try {
      await deleteCompositeChartFromCloud(chartId, user.uid);
      setCompositeCharts((prev) => prev.filter((c) => c.id !== chartId));
      setDeleteMsg(tx("deleted", lang));
      setTimeout(() => setDeleteMsg(null), 2000);
    } catch (err) {
      console.error("Failed to delete composite chart:", err);
      setCompositeError(tx("error", lang));
    } finally {
      setDeletingCompositeId(null);
    }
  };

  const handleDeleteChart'''
content = content.replace(old_loadchart_end, new_loadchart_end)

# Fix 6: Add composite charts section (after the natal charts section closes)
# Find the closing of natal charts section </div> and add composite section after
old_charts_section_end = '''          {!loadingCharts && !chartsError && charts.length > 0 && (
            <div className="space-y-3">
              {charts.map((chart) => (
                <div
                  key={chart.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Chart icon */}
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star size={18} className="text-purple-400" />
                    </div>

                    {/* Chart info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{chart.name || chart.birthData?.name || tx("chartName", lang)}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatBirthDate(chart, lang)}
                        </span>
                        {chart.birthData?.houseSystem && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[10px]">
                            {chart.birthData.houseSystem === "P" ? "Porphyry" : chart.birthData.houseSystem === "E" ? "Equal" : chart.birthData.houseSystem}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {tx("saved", lang)}: {formatDate(chart.ts, lang)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadChart(chart)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium transition-all flex items-center gap-1"
                        title={tx("loadChart", lang)}
                      >
                        <Upload size={12} />
                        {tx("loadChart", lang)}
                      </button>
                      {showConfirm === chart.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteChart(chart.id!)}
                            disabled={deletingId === chart.id}
                            className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all"
                          >
                            {deletingId === chart.id ? <Loader2 size={10} className="animate-spin" /> : tx("deleteChart", lang)}
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white transition-all"
                          >
                            {tx("cancel", lang)}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConfirm(chart.id!)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all"
                          title={tx("deleteChart", lang)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </main>
    </div>
  );
}'''

# Find a unique marker near the end
old_charts_section_end = '''          {!loadingCharts && !chartsError && charts.length > 0 && (
            <div className="space-y-3">
              {charts.map((chart) => (
                <div
                  key={chart.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Chart icon */}
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star size={18} className="text-purple-400" />
                    </div>

                    {/* Chart info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{chart.name || chart.birthData?.name || tx("chartName", lang)}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatBirthDate(chart, lang)}
                        </span>
                        {chart.birthData?.houseSystem && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[10px]">
                            {chart.birthData.houseSystem === "P" ? "Porphyry" : chart.birthData.houseSystem === "E" ? "Equal" : chart.birthData.houseSystem}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {tx("saved", lang)}: {formatDate(chart.ts, lang)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadChart(chart)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium transition-all flex items-center gap-1"
                        title={tx("loadChart", lang)}
                      >
                        <Upload size={12} />
                        {tx("loadChart", lang)}
                      </button>
                      {showConfirm === chart.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteChart(chart.id!)}
                            disabled={deletingId === chart.id}
                            className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all"
                          >
                            {deletingId === chart.id ? <Loader2 size={10} className="animate-spin" /> : tx("deleteChart", lang)}
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white transition-all"
                          >
                            {tx("cancel", lang)}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConfirm(chart.id!)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all"
                          title={tx("deleteChart", lang)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </main>
    </div>
  );
}'''

new_charts_section_end = '''          {!loadingCharts && !chartsError && charts.length > 0 && (
            <div className="space-y-3">
              {charts.map((chart) => (
                <div
                  key={chart.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Chart icon */}
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star size={18} className="text-purple-400" />
                    </div>

                    {/* Chart info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{chart.name || chart.birthData?.name || tx("chartName", lang)}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatBirthDate(chart, lang)}
                        </span>
                        {chart.birthData?.houseSystem && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[10px]">
                            {chart.birthData.houseSystem === "P" ? "Porphyry" : chart.birthData.houseSystem === "E" ? "Equal" : chart.birthData.houseSystem}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {tx("saved", lang)}: {formatDate(chart.ts, lang)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadChart(chart)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium transition-all flex items-center gap-1"
                        title={tx("loadChart", lang)}
                      >
                        <Upload size={12} />
                        {tx("loadChart", lang)}
                      </button>
                      {showConfirm === chart.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteChart(chart.id!)}
                            disabled={deletingId === chart.id}
                            className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all"
                          >
                            {deletingId === chart.id ? <Loader2 size={10} className="animate-spin" /> : tx("deleteChart", lang)}
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white transition-all"
                          >
                            {tx("cancel", lang)}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConfirm(chart.id!)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all"
                          title={tx("deleteChart", lang)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Composite Charts Section */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-5">
            <Star size={18} className="text-pink-400" />
            <h3 className="font-bold text-white">{tx("compositeCharts", lang)}</h3>
            {compositeCharts.length > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-medium">
                {compositeCharts.length}
              </span>
            )}
          </div>

          {loadingComposite && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={28} className="animate-spin text-pink-400" />
            </div>
          )}

          {compositeError && !loadingComposite && (
            <div className="flex items-center justify-center py-8 gap-3">
              <AlertCircle size={18} className="text-red-400" />
              <p className="text-red-400 text-sm">{compositeError}</p>
              <button
                onClick={() => getSavedCompositeCharts(20).then(setCompositeCharts).catch(() => setCompositeError(tx("error", lang)))}
                className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
              >
                {tx("retry", lang)}
              </button>
            </div>
          )}

          {!loadingComposite && !compositeError && compositeCharts.length === 0 && (
            <div className="text-center py-10">
              <Star size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">{tx("noCompositeCharts", lang)}</p>
              <Link
                href="/composite"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl text-white text-sm font-medium transition-all"
              >
                <Star size={14} />
                {tx("loadComposite", lang)}
              </Link>
            </div>
          )}

          {!loadingComposite && !compositeError && compositeCharts.length > 0 && (
            <div className="space-y-3">
              {compositeCharts.map((composite) => (
                <div
                  key={composite.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Composite icon */}
                    <div className="w-10 h-10 rounded-lg bg-pink-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star size={18} className="text-pink-400" />
                    </div>

                    {/* Composite info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-pink-300">{composite.person1Name || tx("person1Short", lang)}</span>
                        <span className="text-slate-500">+</span>
                        <span className="font-semibold text-purple-300">{composite.person2Name || tx("person2Short", lang)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(composite.createdAt?.seconds ? composite.createdAt.seconds * 1000 : Date.now(), lang)}
                        </span>
                        {composite.houseSystem && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 text-[10px]">
                            {composite.houseSystem === "P" ? "Porphyry" : composite.houseSystem === "E" ? "Equal" : composite.houseSystem}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadCompositeChart(composite)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-medium transition-all flex items-center gap-1"
                        title={tx("loadComposite", lang)}
                      >
                        <Upload size={12} />
                        {tx("loadComposite", lang)}
                      </button>
                      {showCompositeConfirm === composite.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteCompositeChart(composite.id!)}
                            disabled={deletingCompositeId === composite.id}
                            className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-all"
                          >
                            {deletingCompositeId === composite.id ? <Loader2 size={10} className="animate-spin" /> : tx("deleteComposite", lang)}
                          </button>
                          <button
                            onClick={() => setShowCompositeConfirm(null)}
                            className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white transition-all"
                          >
                            {tx("cancel", lang)}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCompositeConfirm(composite.id!)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all"
                          title={tx("deleteComposite", lang)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </main>
    </div>
  );
}'''

content = content.replace(old_charts_section_end, new_charts_section_end)

# Write back
with open(r'C:\Users\user\.qclaw\astrology-clean\src\app\profile\page.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("SUCCESS: Added composite charts section to profile page")
