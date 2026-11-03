/**
 * Chinese zodiac pair page — /compatibility/chinese/[pair]
 *
 * 78 个规范页（66 组跨生肖 + 12 组自配对），替代原来 66 篇 69 词的空壳页。
 * 关系分类严格按合婚规则：六合 / 三合 / 无合无冲 / 六害 / 六冲 / 同气，
 * 并标注三刑与自刑。
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  allChinesePairSlugs,
  getChineseCompatibilityPage,
  parseChinesePairSlug,
} from '@/lib/chineseZodiacEngine';
import {
  trineLabel,
  wuXingHanzi,
  wuXingLabel,
} from '@/content/chineseZodiacProfiles';
import { createPageMetadata, SITE_ORIGIN } from '@/lib/seoMetadata';

interface Props {
  params: Promise<{ pair: string }>;
}

export const dynamic = 'force-static';

export function generateStaticParams() {
  return allChinesePairSlugs().map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parseChinesePairSlug(pair);
  if (!parsed) return { title: 'Chinese Zodiac Compatibility — LunaXStar' };

  const page = getChineseCompatibilityPage(parsed[0], parsed[1]);
  if (!page) return { title: 'Chinese Zodiac Compatibility — LunaXStar' };

  return createPageMetadata({
    path: `/compatibility/chinese/${page.slug}`,
    title: page.title,
    description: page.description,
    keywords: [
      `${page.a.name} ${page.b.name} compatibility`,
      `${page.a.name} and ${page.b.name} chinese zodiac`,
      `chinese zodiac compatibility`,
      `${page.relation.hanzi} ${page.a.name} ${page.b.name}`,
      'chinese zodiac match',
      'bazi compatibility',
    ],
    type: 'article',
  });
}

export default async function ChinesePairPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parseChinesePairSlug(pair);
  if (!parsed) notFound();

  const page = getChineseCompatibilityPage(parsed[0], parsed[1]);
  if (!page) notFound();

  const { a, b, score, relation, sections, faqs, related } = page;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: page.title,
        description: page.description,
        url: `${SITE_ORIGIN}/compatibility/chinese/${page.slug}`,
        author: { '@type': 'Organization', name: 'LunaXStar' },
        publisher: { '@type': 'Organization', name: 'LunaXStar' },
        about: ['Chinese astrology', 'Chinese zodiac compatibility', a.name, b.name],
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Compatibility',
            item: `${SITE_ORIGIN}/compatibility`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Chinese zodiac',
            item: `${SITE_ORIGIN}/compatibility/chinese`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: `${a.name} and ${b.name}`,
            item: `${SITE_ORIGIN}/compatibility/chinese/${page.slug}`,
          },
        ],
      },
    ],
  };

  const bars = [
    { label: 'Branch', value: score.relationPoints, max: 55 },
    { label: 'Element', value: score.element, max: 50 },
    { label: 'Yin-yang', value: score.polarity, max: 20 },
  ];

  return (
    <div className="cx-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="cx-header">
        <nav className="cx-crumbs" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/compatibility" className="hover:underline">Compatibility</Link>
          <span>/</span>
          <Link href="/compatibility/chinese" className="hover:underline">Chinese zodiac</Link>
          <span>/</span>
          <span>{a.name} + {b.name}</span>
        </nav>

        <div className="cx-pair-hero">
          <div>
            <div className="cx-pair-signs">
              <span>{a.name}</span>
              <span style={{ color: 'var(--gray-400)', fontSize: 13 }}>{a.branch} · {a.branchPinyin}</span>
              <span style={{ color: 'var(--gray-300)' }}>+</span>
              <span>{b.name}</span>
              <span style={{ color: 'var(--gray-400)', fontSize: 13 }}>{b.branch} · {b.branchPinyin}</span>
            </div>
            <h1 className="cx-title" style={{ marginTop: 10 }}>{page.h1}</h1>
            <p className="cx-sub">{score.bandNote}</p>
            <div className="cx-meta" style={{ marginTop: 14 }}>
              <span className="cx-chip"><b>{relation.hanzi}</b> · {relation.label}</span>
              <span className="cx-chip">{wuXingLabel[a.element]} {wuXingHanzi[a.element]} + {wuXingLabel[b.element]} {wuXingHanzi[b.element]}</span>
              <span className="cx-chip">{trineLabel[a.trine].hanzi} trine</span>
              {relation.punishes ? <span className="cx-chip">相刑</span> : null}
              {relation.breaks ? <span className="cx-chip">相破</span> : null}
              {relation.selfPunish ? <span className="cx-chip">自刑</span> : null}
            </div>
          </div>

          <aside className="cx-card cx-score-card">
            <div className="cx-score-num">
              {score.overall}
              <span>/100</span>
            </div>
            <div className="cx-score-band">{relation.label}</div>
            <div className="cx-score-bars">
              {bars.map((bar) => (
                <div className="cx-score-row" key={bar.label}>
                  <span>{bar.label}</span>
                  <span className="cx-score-track">
                    <span
                      className="cx-score-fill"
                      style={{ width: `${Math.round((bar.value / bar.max) * 100)}%`, display: 'block' }}
                    />
                  </span>
                  <span className="cx-score-val">{bar.value}/{bar.max}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </header>

      <div className="cx-stack">
        <section className="cx-card cx-card-pad">
          <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 12 }}>
            Birth years for this pairing
          </h2>
          <div className="cx-table-wrap" style={{ border: 0 }}>
            <table className="cx-table">
              <tbody>
                <tr>
                  <td className="left" style={{ fontWeight: 600 }}>{a.name} ({a.branch})</td>
                  <td className="left">{a.years.filter((y) => y >= 1960).join(' · ')}</td>
                </tr>
                <tr>
                  <td className="left" style={{ fontWeight: 600 }}>{b.name} ({b.branch})</td>
                  <td className="left">{b.years.filter((y) => y >= 1960).join(' · ')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="cx-sub" style={{ marginTop: 12, maxWidth: 'none' }}>
            Check your own birth year against these lists — Chinese New Year, not January 1st,
            is the boundary, so anyone born in January or early February belongs to the
            previous animal.
          </p>
        </section>

        {sections.map((section) => (
          <section className="cx-card cx-card-pad cx-prose" key={section.id} id={section.id}>
            <h2 className="cx-card-title" style={{ fontSize: 18, marginBottom: 12 }}>
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="cx-card cx-card-pad cx-prose" id="faq">
          <h2 className="cx-card-title" style={{ fontSize: 18, marginBottom: 4 }}>
            Frequently asked
          </h2>
          <div className="cx-faq">
            {faqs.map((faq) => (
              <div className="cx-faq-item" key={faq.q}>
                <div className="cx-faq-q">{faq.q}</div>
                <div className="cx-faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cx-card cx-card-pad">
          <h2 className="cx-card-title" style={{ fontSize: 18, marginBottom: 4 }}>
            What the animal layer cannot tell you
          </h2>
          <p className="cx-sub" style={{ maxWidth: 'none' }}>
            Everything here is read from the two birth-year branches. That is the first filter,
            not the verdict: the heavenly stem above each animal changes the element, the day
            pillar changes the self, and the spouse palace decides how a person actually behaves
            inside a marriage. A 六冲 animal pair with a compatible day pillar can run more
            smoothly than a 六合 pair whose day pillars clash.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <Link href="/compatibility/bazi" className="cx-btn cx-btn-primary">
              <Sparkles size={15} /> Free BaZi compatibility
            </Link>
            <Link href="/bazi" className="cx-btn">Four Pillars calculator</Link>
          </div>
        </section>

        <section className="cx-panel">
          <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 12 }}>
            {a.name} with the other animals
          </h2>
          <div className="cx-pair-grid">
            {related.map((item) => (
              <Link
                className="cx-pair-link"
                href={`/compatibility/chinese/${item.slug}`}
                key={item.slug}
              >
                <span>{item.label}</span>
                <b>{item.overall}</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="cx-panel">
          <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 12 }}>
            Browse all 78 Chinese zodiac pairings
          </h2>
          <Link href="/compatibility/chinese" className="cx-btn cx-btn-sm">
            Chinese zodiac compatibility chart <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
