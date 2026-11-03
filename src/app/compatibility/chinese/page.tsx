/**
 * Chinese zodiac compatibility hub — /compatibility/chinese
 *
 * 12×12 矩阵：格子链到规范配对页；镜像格指向同一页（A-B 与 B-A 同 URL）。
 * 附六合 / 三合 / 六冲 / 六害四张对照表，让读者一眼看到规则来源。
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  chinesePairSlug,
  classifyRelation,
  scoreChinesePair,
} from '@/lib/chineseZodiacEngine';
import {
  chineseZodiacProfiles,
  trineLabel,
  wuXingHanzi,
  wuXingLabel,
} from '@/content/chineseZodiacProfiles';
import { createPageMetadata } from '@/lib/seoMetadata';

export const dynamic = 'force-static';

export const metadata: Metadata = createPageMetadata({
  path: '/compatibility/chinese',
  title: 'Chinese Zodiac Compatibility Chart — All 78 Animal Pairings Scored',
  description:
    'Every Chinese zodiac pairing in one matrix: 66 cross-animal combinations plus 12 same-animal pairings, scored on the branch relation (六合 / 三合 / 六害 / 六冲), the five-element interaction and the yin-yang pairing.',
  keywords: [
    'chinese zodiac compatibility',
    'chinese zodiac compatibility chart',
    'chinese zodiac match',
    '生肖合婚',
    'shengxiao compatibility',
    'bazi compatibility',
  ],
});

const tone = (score: number) => {
  if (score >= 88) return { bg: '#111111', color: '#ffffff' };
  if (score >= 78) return { bg: '#e8e8e8', color: '#111111' };
  if (score >= 62) return { bg: '#f3f3f3', color: '#111111' };
  if (score >= 48) return { bg: '#fafafa', color: '#555555' };
  return { bg: '#ffffff', color: '#999999' };
};

export default function ChineseCompatibilityHubPage() {
  const grid = chineseZodiacProfiles.map((row) =>
    chineseZodiacProfiles.map((col) => {
      const [x, y] = [row.slug, col.slug].sort();
      return {
        slug: `${x}-${y}`,
        col,
        score: scoreChinesePair(row, col).overall,
        relation: classifyRelation(row, col),
        mirrored: col.slug < row.slug,
      };
    }),
  );

  const all = chineseZodiacProfiles.flatMap((row) =>
    chineseZodiacProfiles
      .filter((col) => col.slug >= row.slug)
      .map((col) => ({
        slug: chinesePairSlug(row.slug, col.slug),
        label: `${row.name} + ${col.name}`,
        score: scoreChinesePair(row, col).overall,
        relation: classifyRelation(row, col).hanzi,
      })),
  );

  const top = [...all].sort((x, y) => y.score - x.score).slice(0, 8);
  const bottom = [...all].sort((x, y) => x.score - y.score).slice(0, 8);

  const relationTables = [
    {
      title: '六合 Secret Friends',
      note: 'Six branch pairs that pull toward each other. The friendliest relation in the system.',
      pairs: all.filter((item) => item.relation === '六合'),
    },
    {
      title: '三合 Three Harmonies',
      note: 'Four trines of three animals each; any two of the three form this alliance.',
      pairs: all.filter((item) => item.relation === '三合'),
    },
    {
      title: '六冲 Direct Clash',
      note: 'Branches sitting 180° apart. Expensive rather than doomed — they need 通关, a deliberate bridge.',
      pairs: all.filter((item) => item.relation === '六冲'),
    },
    {
      title: '六害 Mutual Harm',
      note: 'The quietest relation: no open conflict, a slow steady cost in one direction.',
      pairs: all.filter((item) => item.relation === '六害'),
    },
  ];

  return (
    <div className="cx-page">
      <header className="cx-header">
        <nav className="cx-crumbs" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/compatibility" className="hover:underline">Compatibility</Link>
          <span>/</span>
          <span>Chinese zodiac</span>
        </nav>
        <h1 className="cx-title">Chinese Zodiac Compatibility Chart</h1>
        <p className="cx-sub">
          All 78 animal pairings — 66 cross-animal combinations and 12 same-animal pairings —
          scored on the three layers the classical tables actually use: the branch relation
          (六合 / 三合 / 六害 / 六冲, weighted 55 points), the five-element interaction between
          the two birth years (50) and the yin-yang pairing (20). Two people with the same
          animal but different birth-year stems therefore do not all score the same.
        </p>
      </header>

      <div className="cx-stack">
        <section className="cx-card cx-card-pad">
          <div className="cx-table-wrap" style={{ border: 0 }}>
            <table className="cx-table">
              <caption className="sr-only">Chinese zodiac compatibility score matrix</caption>
              <thead>
                <tr>
                  <th className="left" style={{ minWidth: 100 }}>Animal</th>
                  {chineseZodiacProfiles.map((col) => (
                    <th key={col.slug} title={`${col.name} (${col.branch})`}>
                      {col.branch}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chineseZodiacProfiles.map((row, rowIndex) => (
                  <tr key={row.slug}>
                    <th className="left" scope="row" style={{ position: 'static', background: '#fff' }}>
                      {row.name}
                      <span style={{ marginLeft: 6, color: 'var(--gray-400)', fontWeight: 400 }}>
                        {wuXingHanzi[row.element]}
                      </span>
                    </th>
                    {grid[rowIndex].map((cell) => (
                      <td key={cell.slug}>
                        <Link
                          href={`/compatibility/chinese/${cell.slug}`}
                          style={{
                            display: 'block',
                            padding: '4px 0',
                            borderRadius: 6,
                            fontWeight: cell.mirrored ? 400 : 600,
                            fontVariantNumeric: 'tabular-nums',
                            opacity: cell.mirrored ? 0.45 : 1,
                            ...tone(cell.score),
                          }}
                          title={`${row.name} + ${cell.col.name}: ${cell.score}/100 · ${cell.relation.hanzi}`}
                        >
                          {cell.score}
                        </Link>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cx-sub" style={{ marginTop: 12, maxWidth: 'none' }}>
            Columns are earthly branches (子丑寅卯辰巳午未申酉戌亥). Lower-left cells mirror the
            upper-right ones, because Rat–Ox and Ox–Rat are the same relationship.
          </p>
        </section>

        <div className="cx-grid3">
          <section className="cx-card cx-card-pad">
            <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
              Highest-scoring pairings
            </h2>
            <div className="cx-stack" style={{ gap: 6 }}>
              {top.map((item) => (
                <Link className="cx-pair-link" href={`/compatibility/chinese/${item.slug}`} key={item.slug}>
                  <span>{item.label} <span style={{ color: 'var(--gray-400)', fontSize: 11 }}>{item.relation}</span></span>
                  <b>{item.score}</b>
                </Link>
              ))}
            </div>
          </section>

          <section className="cx-card cx-card-pad">
            <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
              Highest-friction pairings
            </h2>
            <div className="cx-stack" style={{ gap: 6 }}>
              {bottom.map((item) => (
                <Link className="cx-pair-link" href={`/compatibility/chinese/${item.slug}`} key={item.slug}>
                  <span>{item.label} <span style={{ color: 'var(--gray-400)', fontSize: 11 }}>{item.relation}</span></span>
                  <b>{item.score}</b>
                </Link>
              ))}
            </div>
          </section>

          <section className="cx-card cx-card-pad">
            <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
              How to read the score
            </h2>
            <div className="cx-prose" style={{ fontSize: 14 }}>
              <p>
                The branch relation sets the band and the element and polarity only modulate
                within it — so a 六合 pairing will never score below a 三合 one, and a 六冲 will
                never outscore a neutral pair. That ordering is deliberate: it keeps the numbers
                consistent with the classical tables.
              </p>
              <p>
                For the whole picture you need the day pillar, not just the birth year. A 六冲
                couple with a harmonious spouse palace often does better than a 六合 couple whose
                day pillars fight.
              </p>
            </div>
            <Link href="/compatibility/bazi" className="cx-btn cx-btn-sm" style={{ marginTop: 14 }}>
              Full BaZi synastry <ArrowRight size={14} />
            </Link>
          </section>
        </div>

        {relationTables.map((table) => (
          <section className="cx-card cx-card-pad" key={table.title}>
            <h2 className="cx-card-title" style={{ fontSize: 16 }}>
              {table.title}
            </h2>
            <p className="cx-sub" style={{ marginTop: 6, maxWidth: 'none' }}>{table.note}</p>
            <div className="cx-pair-grid" style={{ marginTop: 12 }}>
              {table.pairs.map((item) => (
                <Link className="cx-pair-link" href={`/compatibility/chinese/${item.slug}`} key={item.slug}>
                  <span>{item.label}</span>
                  <b>{item.score}</b>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="cx-card cx-card-pad">
          <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
            The twelve animals and their elements
          </h2>
          <div className="cx-table-wrap" style={{ border: 0 }}>
            <table className="cx-table">
              <thead>
                <tr>
                  <th className="left">Animal</th>
                  <th>Branch</th>
                  <th>Element</th>
                  <th className="left">Trine</th>
                  <th className="left">六合 with</th>
                  <th className="left">六冲 with</th>
                </tr>
              </thead>
              <tbody>
                {chineseZodiacProfiles.map((z) => (
                  <tr key={z.slug}>
                    <td className="left" style={{ fontWeight: 600 }}>{z.name}</td>
                    <td>{z.branch}</td>
                    <td>{wuXingLabel[z.element]} {wuXingHanzi[z.element]}</td>
                    <td className="left">{trineLabel[z.trine].hanzi}</td>
                    <td className="left">{z.secretFriend}</td>
                    <td className="left">{z.clash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cx-panel">
          <Link href="/compatibility/pairs" className="cx-btn cx-btn-sm">
            Western zodiac compatibility chart <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
