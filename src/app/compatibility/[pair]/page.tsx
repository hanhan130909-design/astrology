/**
 * Compatibility pair page — /compatibility/[pair]
 *
 * 78 个规范页（66 组无序组合 + 12 组同座自配对），替代原来 144 篇
 * 47 词的空壳博客页。A-B 与 B-A 是同一个 URL，重复内容从源头消失。
 *
 * Server component：正文、canonical、JSON-LD 全部静态输出，无客户端水合成本。
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import {
  allPairSlugs,
  getCompatibilityPage,
  parsePairSlug,
} from '@/lib/compatibilityEngine';
import {
  elementLabel,
  modalityLabel,
  polarityLabel,
  zodiacBySlug,
} from '@/content/zodiacProfiles';
import { createPageMetadata, SITE_ORIGIN } from '@/lib/seoMetadata';

interface Props {
  params: Promise<{ pair: string }>;
}

export const dynamic = 'force-static';

export function generateStaticParams() {
  return allPairSlugs().map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePairSlug(pair);
  if (!parsed) return { title: 'Compatibility — LunaXStar' };

  const page = getCompatibilityPage(parsed[0], parsed[1]);
  if (!page) return { title: 'Compatibility — LunaXStar' };

  return createPageMetadata({
    path: `/compatibility/${page.slug}`,
    title: page.title,
    description: page.description,
    keywords: [
      `${page.a.name} ${page.b.name} compatibility`,
      `${page.a.name} and ${page.b.name}`,
      `${page.a.name} ${page.b.name} match`,
      'zodiac compatibility',
      `${page.a.element} ${page.b.element} compatibility`,
      'synastry',
    ],
    type: 'article',
  });
}

const MAX = { element: 40, modality: 25, polarity: 20, ruler: 5 };

export default async function CompatibilityPairPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePairSlug(pair);
  if (!parsed) notFound();

  const page = getCompatibilityPage(parsed[0], parsed[1]);
  if (!page) notFound();

  const { a, b, score, sections, faqs, related } = page;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: page.title,
        description: page.description,
        url: `${SITE_ORIGIN}/compatibility/${page.slug}`,
        author: { '@type': 'Organization', name: 'LunaXStar' },
        publisher: { '@type': 'Organization', name: 'LunaXStar' },
        about: ['Astrology', 'Zodiac compatibility', `${a.name}`, `${b.name}`],
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
            name: `${a.name} and ${b.name}`,
            item: `${SITE_ORIGIN}/compatibility/${page.slug}`,
          },
        ],
      },
    ],
  };

  const bars = [
    { label: 'Element', value: score.element, max: MAX.element },
    { label: 'Rhythm', value: score.modality, max: MAX.modality },
    { label: 'Polarity', value: score.polarity, max: MAX.polarity },
    { label: 'Rulership', value: score.ruler, max: MAX.ruler },
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
          <span>{a.name} + {b.name}</span>
        </nav>

        <div className="cx-pair-hero">
          <div>
            <div className="cx-pair-signs">
              <span className="cx-glyph">{a.glyph}</span>
              <span>{a.name}</span>
              <span style={{ color: 'var(--gray-300)' }}>+</span>
              <span className="cx-glyph">{b.glyph}</span>
              <span>{b.name}</span>
            </div>
            <h1 className="cx-title" style={{ marginTop: 10 }}>{page.h1}</h1>
            <p className="cx-sub">{score.bandNote}</p>
            <div className="cx-meta" style={{ marginTop: 14 }}>
              <span className="cx-chip"><b>{elementLabel[a.element]}</b> + <b>{elementLabel[b.element]}</b></span>
              <span className="cx-chip"><b>{modalityLabel[a.modality]}</b> + <b>{modalityLabel[b.modality]}</b></span>
              <span className="cx-chip">{polarityLabel[a.polarity]} / {polarityLabel[b.polarity]}</span>
              <span className="cx-chip">{a.ruler} + {b.ruler}</span>
            </div>
          </div>

          <aside className="cx-card cx-score-card">
            <div className="cx-score-num">
              {score.overall}
              <span>/100</span>
            </div>
            <div className="cx-score-band">{score.band}</div>
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
            What the sun signs cannot tell you
          </h2>
          <p className="cx-sub" style={{ maxWidth: 'none' }}>
            Everything on this page is read from the two sun signs. It describes the
            disposition each of you brings, not the actual geometry between your charts.
            Moon, Venus, Mars and the rising signs routinely override the sun-sign
            picture — a “difficult” pair with a tight Moon–Moon trine often runs more
            smoothly than a “compatible” pair with Venus in hard aspect. If you want the
            real answer, generate both charts and compare the aspects.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <Link href="/natal" className="cx-btn cx-btn-primary">
              <Sparkles size={15} /> Free birth chart
            </Link>
            <Link href="/compatibility" className="cx-btn">
              <Heart size={15} /> Full synastry analysis
            </Link>
          </div>
        </section>

        <section className="cx-panel">
          <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 12 }}>
            {a.name} with the other signs
          </h2>
          <div className="cx-pair-grid">
            {related.map((item) => (
              <Link className="cx-pair-link" href={`/compatibility/${item.slug}`} key={item.slug}>
                <span>{item.label}</span>
                <b>{item.overall}</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="cx-panel">
          <h2 className="cx-card-title" style={{ fontSize: 16, marginBottom: 12 }}>
            Browse all 78 pairings
          </h2>
          <Link href="/compatibility/pairs" className="cx-btn cx-btn-sm">
            All zodiac compatibility pairs <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
