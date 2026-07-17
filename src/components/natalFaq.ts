export type NatalFaq = Readonly<{
  question: string;
  answer: string;
}>;

export const natalFaqs: readonly NatalFaq[] = [
  {
    question: "What is a natal chart?",
    answer:
      "A natal chart is a map of the sky calculated for a birth date, exact time, and location. It places the planets in zodiac signs and houses and shows the angular relationships, or aspects, between them.",
  },
  {
    question: "How accurate is this birth chart calculator?",
    answer:
      "The calculator derives planetary positions from astronomical data using the birth date, time, and location you enter. Planet and sign positions are generally less sensitive to small time differences than the Ascendant and house cusps, so accurate inputs matter most for those fast-changing features.",
  },
  {
    question: "What is the difference between a Sun sign and a Rising sign?",
    answer:
      "The Sun sign describes the zodiac sign occupied by the Sun at birth. The Rising sign, or Ascendant, is the sign rising on the eastern horizon and changes much faster, so it depends closely on the recorded birth time and location.",
  },
  {
    question: "What do the twelve houses mean?",
    answer:
      "The twelve houses divide the chart into areas of life, such as identity, resources, communication, home, relationships, and public roles. A planet describes what is active, its sign describes how it operates, and its house suggests where that pattern may be experienced.",
  },
  {
    question: "How do I read aspects in a natal chart?",
    answer:
      "Aspects are measured angles between planets, including conjunctions, sextiles, squares, trines, and oppositions. Read the planets first, then consider whether the aspect suggests ease, emphasis, contrast, or tension that can be expressed in more than one way.",
  },
  {
    question: "What should I do without an exact birth time?",
    answer:
      "Use a documented birth time whenever possible. Without one, you can still examine many planetary sign placements and aspects, but the Moon may shift and the Rising sign, house cusps, and planet-to-house placements may be unreliable; avoid treating an estimated time as exact.",
  },
  {
    question: "Can a natal chart predict the future?",
    answer:
      "A natal chart does not guarantee future events. Astrologers use planets, signs, houses, and aspects to explore tendencies, themes, and possible responses, while choices, circumstances, and uncertainty remain part of how a life develops.",
  },
];

export function serializeNatalFaqJsonLd(
  faqs: readonly NatalFaq[],
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }).replace(/</g, "\\u003c");
}
