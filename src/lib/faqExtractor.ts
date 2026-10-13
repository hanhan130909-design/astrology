// Extract FAQ items from markdown sections for FAQPage schema
export function extractFaqsFromMarkdown(sections: string, maxFaqs = 4): Array<{ question: string; answer: string }> {
  if (!sections) return [];

  const faqs: Array<{ question: string; answer: string }> = [];
  // Split by H2 headings
  const h2Blocks = sections.split(/\n## /);

  for (let i = 1; i < h2Blocks.length && faqs.length < maxFaqs; i++) {
    const block = h2Blocks[i];
    const lines = block.split('\n');
    const heading = lines[0].trim().replace(/^#+\s*/, '');

    // Skip non-question headings (Table of Contents, Related Articles, etc.)
    if (
      heading.toLowerCase().includes('table of contents') ||
      heading.toLowerCase().includes('related') ||
      heading.toLowerCase().includes('discover') ||
      heading.toLowerCase().includes('continue reading') ||
      heading.toLowerCase().includes('get your') ||
      heading.length < 8
    ) {
      continue;
    }

    // Get first 1-2 paragraphs as answer (skip H3, lists, links)
    const paragraphs: string[] = [];
    let paraCount = 0;
    for (let j = 1; j < lines.length && paraCount < 2; j++) {
      const line = lines[j].trim();
      if (!line || line.startsWith('#') || line.startsWith('•') || line.startsWith('-') || line.startsWith('[')) continue;
      // Clean markdown links and bold
      const clean = line
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[.*?\]/g, '')
        .trim();
      if (clean.length > 30) {
        paragraphs.push(clean);
        paraCount++;
      }
    }

    if (paragraphs.length > 0) {
      // Make heading sound like a question if it isn't already
      let question = heading;
      if (!question.endsWith('?') && !question.toLowerCase().startsWith('how') && !question.toLowerCase().startsWith('what') && !question.toLowerCase().startsWith('why') && !question.toLowerCase().startsWith('when') && !question.toLowerCase().startsWith('which') && !question.toLowerCase().startsWith('who') && !question.toLowerCase().startsWith('can') && !question.toLowerCase().startsWith('do') && !question.toLowerCase().startsWith('is')) {
        question = `What is ${question.charAt(0).toLowerCase() + question.slice(1)}?`;
      }
      faqs.push({
        question,
        answer: paragraphs.join(' ').substring(0, 300),
      });
    }
  }

  return faqs;
}

export function serializeFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}
