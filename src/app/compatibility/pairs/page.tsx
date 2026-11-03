/**
 * Compatibility matrix hub — /compatibility/pairs
 *
 * 12×12 矩阵：每个格子链到对应的规范配对页，上三角 + 对角线共 78 条链接。
 * 目的有两个：给 Google 一条清晰的内部链接路径，也给人一个能一眼扫完的对照表。
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { scorePair, pairSlug } from '@/lib/compatibilityEngine';
import { zodiacProfiles } from '@/content/zodiacProfiles';
import { createPageMetadata } from '@/lib/seoMetadata';

export const dynamic = 'force-static';

export const metadata: Metadata = createPageMetadata({
  path: '/compatibility/pairs',
  title: 'Zodiac Compatibility Chart — All 78 Sign Pairings Scored',
  description:
    'Every zodiac compatibility pairing in one matrix: 66 cross-sign combinations plus 12 same-sign pairings, each scored on element, modality, polarity and rulership, with a full reading for each pair.',
  keywords: [
    'zodiac compatibility chart',
    'all zodiac pairs',
    'compatibility matrix',
    'sun sign compatibility',
    'zodiac match table',
  ],
});

const scoreTone = (score: number) => {
  if (score >= 85) return { bg: '#111111', color: '#ffffff' };
  if (score >= 78) return { bg: '#e8e8e8', color: '#111111' };
  if (score >= 70) return { bg: '#f3f3f3', color: '#111111' };
  if (score >= 62) return { bg: '#fafafa', color: '#555555' };
  return { bg: '#ffffff', color: '#999999' };
};

export default function CompatibilityMatrixPage() {
  const pairs = zodiacProfiles.map((row) =>
    zodiacProfiles.map((col) => {
      // 下三角镜像到同一规范页：A-B 与 B-A 本来就是同一个 URL
      const [x, y] = [row.slug, col.slug].sort();
      const score = scorePair(row, col).overall;
      const mirrored = col.slug < row.slug;
      return { slug: `${x}-${y}`, score, mirrored };
    }),
  );

  const all = zodiacProfiles.flatMap((row) =>
    zodiacProfiles
      .filter((col) => col.slug >= row.slug)
      .map((col) => ({
        slug: pairSlug(row.slug, col.slug),
        label: `${row.name} + ${col.name}`,
        score: scorePair(row, col).overall,
      })),
  );

  const top = [...all].sort((x, y) => y.score - x.score).slice(0, 8);
  const bottom = [...all].sort((x, y) => x.score - y.score).slice(0, 8);

  return (
    <div className="cx-page">
      <header className="cx-header">
        <nav className="cx-crumbs" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/compatibility" className="hover:underline">Compatibility</Link>
          <span>/</span>
          <span>All pairs</span>
        </nav>
        <h1 className="cx-title">Zodiac Compatibility Chart</h1>
        <p className="cx-sub">
          All 78 sun-sign pairings — 66 cross-sign combinations and 12 same-sign pairings —
          scored on the same four factors used throughout this site: elemental chemistry
          (40 points), modality rhythm (25), polarity (20) and shared rulership (5).
          Darker cells are the pairings with the least friction to negotiate; lighter
          cells are the ones that require deliberate work.
        </p>
      </header>

      <div className="cx-stack">
        <section className="cx-card cx-card-pad">
          <div className="cx-table-wrap" style={{ border: 0 }}>
            <table className="cx-table">
              <caption className="sr-only">Zodiac compatibility score matrix</caption>
              <thead>
                <tr>
                  <th className="left" style={{ minWidth: 96 }}>Sign</th>
                  {zodiacProfiles.map((col) => (
                    <th key={col.slug} title={col.name}>
                      <span className="cx-glyph">{col.glyph}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zodiacProfiles.map((row, rowIndex) => (
                  <tr key={row.slug}>
                    <th className="left" scope="row" style={{ position: 'static', background: '#fff' }}>
                      <span className="cx-glyph" style={{ marginRight: 6 }}>{row.glyph}</span>
                      {row.name}
                    </th>
                    {pairs[rowIndex].map((cell, colIndex) => (
                      <td key={zodiacProfiles[colIndex].slug}>
                        <Link
                          href={`/compatibility/${cell.slug}`}
                          style={{
                            display: 'block',
                            padding: '4px 0',
                            borderRadius: 6,
                            fontWeight: cell.mirrored ? 400 : 600,
                            fontVariantNumeric: 'tabular-nums',
                            opacity: cell.mirrored ? 0.45 : 1,
                            ...scoreTone(cell.score),
                          }}
                          title={`${row.name} + ${zodiacProfiles[colIndex].name}: ${cell.score}/100`}
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
        </section>

        <div className="cx-grid3">
          <section className="cx-card cx-card-pad">
            <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
              Lowest-friction pairings
            </h2>
            <div className="cx-stack" style={{ gap: 6 }}>
              {top.map((item) => (
                <Link className="cx-pair-link" href={`/compatibility/${item.slug}`} key={item.slug}>
                  <span>{item.label}</span>
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
                <Link className="cx-pair-link" href={`/compatibility/${item.slug}`} key={item.slug}>
                  <span>{item.label}</span>
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
                The number describes starting conditions, not survival odds. A high score
                means little has to be translated between the two of you; a low score means
                almost everything does. Neither predicts whether the relationship lasts —
                that depends on the two of you, not on the sun signs.
              </p>
              <p>
                For the actual geometry between two specific charts, generate both birth
                charts and compare the aspects. Sun-sign scoring is the rough pass.
              </p>
            </div>
            <Link href="/compatibility" className="cx-btn cx-btn-sm" style={{ marginTop: 14 }}>
              Full synastry analysis <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
