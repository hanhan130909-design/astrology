export type SolarReturnFaq = Readonly<{
  question: string;
  answer: string;
}>;

export const solarReturnFaqs: readonly SolarReturnFaq[] = [
  {
    question: "What is a Solar Return?",
    answer:
      "A Solar Return is the chart for the exact moment each year when the Sun returns to its natal position. Astrologers use it to explore themes and areas of emphasis from one birthday to the next.",
  },
  {
    question: "Do I need my exact birth time?",
    answer:
      "Use your exact recorded birth time when possible. The return can still be estimated without it, but the Ascendant, houses, and timing are sensitive to birth time.",
  },
  {
    question: "Why does the return location matter?",
    answer:
      "Location affects the Solar Return Ascendant and house cusps. This calculator currently uses the entered birth-location coordinates as its calculation location for both natal data and Solar Return houses; a separate relocated-return location input is not available yet.",
  },
];

export function serializeSolarReturnFaqJsonLd(
  faqs: readonly SolarReturnFaq[],
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
