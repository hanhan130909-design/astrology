# Core Acquisition Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce LunaXStar's shared and blog-index JavaScript while adding indexable natal-chart guidance, without changing chart calculations, chart geometry, aspect tables, house systems, or the established calculator workflow.

**Architecture:** Keep the current global auth API but move Firebase behind one dynamic loader so it is emitted as an optional chunk. Split the blog index into a server data assembler and a client renderer that receives serializable summaries only. Render the natal guide and FAQ from server components after the existing calculator, with visible FAQ content and JSON-LD generated from one shared data source.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.9, Firebase 12, Tailwind CSS, Node.js assertion scripts, Playwright browser verification, Vercel CLI.

---

## Boundaries And File Map

The following files are the only production files in scope:

- Create `src/lib/loadFirebaseClient.ts`: the only shared entry point for dynamically importing `src/lib/firebase.ts`.
- Modify `src/lib/firebase.ts`: expose a password-reset wrapper so callers do not import `firebase/auth` directly.
- Modify `src/contexts/AuthContext.tsx`: preserve its exported API while replacing static Firebase value imports with calls to the loader.
- Modify `src/app/natal/page.tsx`: use `useAuth()` for user/logout state and load the reset action only when invoked.
- Create `src/app/blog/blogSummary.ts`: serializable client-facing summary type and a mapper that removes article bodies.
- Create `src/app/blog/blogIndexData.ts`: server-only assembly of SEO, destiny, and legacy blog summaries.
- Create `src/app/blog/BlogIndexClient.tsx`: current interactive blog list UI with no article-source imports.
- Modify `src/app/blog/page.tsx`: small server component that passes summaries to `BlogIndexClient`.
- Create `src/components/natalFaq.ts`: canonical natal FAQ data and JSON-LD serializer.
- Create `src/components/NatalSeoContent.tsx`: English server-rendered guide and related links.
- Modify `src/app/natal/layout.tsx`: retain metadata/WebPage schema, add the shared FAQ schema, then render the guide after the calculator.
- Create `scripts/test-performance-boundaries.mjs`: bundle-boundary and summary-shape regression checks.
- Create `scripts/test-natal-seo-content.mjs`: FAQ parity, content, and internal-link checks.
- Modify `package.json`: expose both new checks through `test:acquisition`.

Do not modify these files or behaviors in this batch:

- `src/components/NatalChartWheel.tsx`
- `src/components/AlmutenChartLayout.tsx`
- `src/app/api/chart/route.ts`
- chart payload construction, chart auto-generation, dignity tables, Firdaria, profections, Aphesis, saved charts, AI requests, copy-link behavior, or image export behavior

## Baseline

Use the same production-build report before and after implementation. The accepted pre-change reference is:

- Shared JavaScript: approximately `339 kB`
- `/natal`: approximately `483 kB`
- `/blog`: approximately `827 kB`

The executor must record the exact post-change values in the implementation summary and must not claim a reduction that is absent from the build output.

---

### Task 1: Add Failing Performance-Boundary Tests

**Files:**
- Create: `scripts/test-performance-boundaries.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create the boundary test with the required assertions**

Create `scripts/test-performance-boundaries.mjs` with this content:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import { toBlogSummary } from "../src/app/blog/blogSummary.ts";

const read = (path) => fs.readFileSync(path, "utf8");

const authContextSource = read("src/contexts/AuthContext.tsx");
const natalPageSource = read("src/app/natal/page.tsx");
const blogClientSource = read("src/app/blog/BlogIndexClient.tsx");
const blogPageSource = read("src/app/blog/page.tsx");
const blogDataSource = read("src/app/blog/blogIndexData.ts");

assert.doesNotMatch(authContextSource, /from ["']@\/lib\/firebase["']/);
assert.doesNotMatch(natalPageSource, /from ["']@\/lib\/firebase["']/);
assert.doesNotMatch(natalPageSource, /from ["']firebase\/auth["']/);
assert.match(authContextSource, /loadFirebaseClient\(/);
assert.match(natalPageSource, /loadFirebaseClient\(/);

for (const forbiddenImport of [
  "seo-articles",
  "more-seo-articles",
  "destiny-blog-articles",
]) {
  assert.ok(
    !blogClientSource.includes(forbiddenImport),
    `BlogIndexClient must not import ${forbiddenImport}`,
  );
}

assert.doesNotMatch(blogClientSource, /\.content\b/);
assert.match(blogDataSource, /import ["']server-only["']/);
assert.match(blogPageSource, /getBlogSummaries\(\)/);
assert.match(blogPageSource, /<BlogIndexClient articles=\{articles\}/);

const sourceArticle = {
  id: "article-1",
  slug: "article-1",
  category: "guide",
  categoryZh: "指南",
  categoryEn: "Guide",
  categoryId: "Panduan",
  title: { en: "Title", zh: "标题", id: "Judul" },
  excerpt: { en: "Excerpt", zh: "摘要", id: "Ringkasan" },
  content: { en: "Full private body" },
  author: "星缘团队",
  authorEn: "LunaXStar Team",
  authorId: "Tim LunaXStar",
  date: "2026-07-17",
  readTime: 5,
  tags: ["Natal chart"],
};

const summary = toBlogSummary(sourceArticle);
assert.equal(summary.slug, sourceArticle.slug);
assert.equal(summary.title.en, sourceArticle.title.en);
assert.equal(Object.hasOwn(summary, "content"), false);
assert.equal(JSON.stringify(summary).includes("Full private body"), false);

console.log("Performance boundary tests passed");
```

- [ ] **Step 2: Register the test command without adding it to the aggregate yet**

Add this script to `package.json`:

```json
"test:performance-boundaries": "node --experimental-strip-types scripts/test-performance-boundaries.mjs"
```

- [ ] **Step 3: Run the test and verify that it fails for missing planned modules**

Run:

```bash
npm run test:performance-boundaries
```

Expected: non-zero exit with `ERR_MODULE_NOT_FOUND` for `src/app/blog/blogSummary.ts` or `ENOENT` for `BlogIndexClient.tsx`.

Do not commit at this point because the test intentionally describes files that do not exist yet. Task 2 produces the first green commit.

---

### Task 2: Split The Blog Index Into Server Data And Client UI

**Files:**
- Create: `src/app/blog/blogSummary.ts`
- Create: `src/app/blog/blogIndexData.ts`
- Create: `src/app/blog/BlogIndexClient.tsx`
- Modify: `src/app/blog/page.tsx`
- Test: `scripts/test-performance-boundaries.mjs`

- [ ] **Step 1: Define the client-facing summary contract and stripping mapper**

Create `src/app/blog/blogSummary.ts`:

```ts
export interface BlogSummary {
  id: string;
  slug: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  categoryId: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  author: string;
  authorEn: string;
  authorId: string;
  date: string;
  readTime: number;
  tags: string[];
}

export type BlogArticleForSummary = BlogSummary & {
  content?: unknown;
};

export function toBlogSummary(article: BlogArticleForSummary): BlogSummary {
  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    categoryZh: article.categoryZh,
    categoryEn: article.categoryEn,
    categoryId: article.categoryId,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    authorEn: article.authorEn,
    authorId: article.authorId,
    date: article.date,
    readTime: article.readTime,
    tags: article.tags,
  };
}
```

- [ ] **Step 2: Run the mapper assertion and confirm the remaining failure is the missing client file**

Run:

```bash
npm run test:performance-boundaries
```

Expected: `toBlogSummary` imports successfully, then the script exits non-zero because `src/app/blog/BlogIndexClient.tsx` does not exist.

- [ ] **Step 3: Move the existing interactive page into the client component**

Run:

```bash
mv src/app/blog/page.tsx src/app/blog/BlogIndexClient.tsx
```

In `BlogIndexClient.tsx`:

1. Keep `'use client'`, the translation map, category colors, pagination, date localization, cards, and links unchanged.
2. Remove imports of `seoArticles`, `moreSeoArticles`, and `destinyArticles`.
3. Remove the local `BlogArticle` interface and the complete `blogArticles` array.
4. Add `import type { BlogSummary } from './blogSummary';`.
5. Replace the component signature and internal `blogArticles` references with the prop shown below.

The resulting component boundary must be:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Clock, Tag, ChevronRight } from 'lucide-react';
import type { BlogSummary } from './blogSummary';

type BlogIndexClientProps = {
  articles: BlogSummary[];
};

export default function BlogIndexClient({ articles }: BlogIndexClientProps) {
  const { language } = useLanguage();
  const currentT = t[language] || t.en;
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const pagedArticles = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}
```

Everything below `pagedArticles` in the moved component remains byte-for-byte unchanged except that `getCategoryName` receives `BlogSummary` and all former `blogArticles` reads become `articles` reads. This is not a UI rewrite; the existing formatter, category helpers, card JSX, and pagination controls stay in the moved file.

Update `getCategoryName` to accept the new type exactly:

```ts
const getCategoryName = (article: BlogSummary) => {
  if (language === 'zh') return article.categoryZh;
  if (language === 'en') return article.categoryEn;
  if (language === 'id') return article.categoryId;
  return article.categoryEn;
};
```

- [ ] **Step 4: Build server-only index data without retaining legacy bodies**

Create `src/app/blog/blogIndexData.ts` with the following imports, normalizer, and export:

```ts
import 'server-only';

import { destinyArticles } from '@/content/destiny-blog-articles';
import { moreSeoArticles } from './more-seo-articles';
import { seoArticles } from './seo-articles';
import {
  toBlogSummary,
  type BlogArticleForSummary,
  type BlogSummary,
} from './blogSummary';

const sourceArticles: BlogArticleForSummary[] = [
  ...seoArticles,
  ...moreSeoArticles,
  ...destinyArticles.map((article, index) => ({
    id: `destiny-${index}`,
    slug: article.slug,
    category: article.category,
    categoryZh: article.categoryLabel.zh,
    categoryEn: article.categoryLabel.en,
    categoryId: article.categoryLabel.id,
    title: article.title,
    excerpt: article.description,
    content: { en: article.sections, zh: article.sections, id: article.sections },
    author: '星缘团队',
    authorEn: 'LunaXStar Team',
    authorId: 'Tim LunaXStar',
    date: '2026-06-15',
    readTime: Math.ceil(article.wordCount / 200),
    tags: [article.categoryLabel.en, 'BaZi', 'Chinese Astrology'],
  })),
];

const legacyBlogSummaries: BlogSummary[] = [
  {
    id: '1',
    slug: 'birth-chart-tutorial',
    category: 'tutorial',
    categoryZh: '教程',
    categoryEn: 'Tutorial',
    categoryId: 'Tutorial',
    title: {
      zh: '本命盘基础教程：读懂你的出生星图',
      en: 'Birth Chart Tutorial: Read Your Natal Chart',
      id: 'Tutorial Bagan Natal: Membaca Bagan Bintang Kelahiran Anda',
    },
    excerpt: {
      zh: '本命盘是占星学的核心工具，它记录了你出生时行星的位置。通过学习四元素、十二星座和十二宫位，你可以揭开星图的奥秘，了解自己的性格、天赋和人生轨迹。',
      en: 'A birth chart is the core tool of astrology, recording planetary positions at your birth. By learning the four elements, twelve zodiac signs, and twelve houses, you can unlock the mysteries of the star map and understand your personality, talents, and life path.',
      id: 'Bagan kelahiran adalah alat inti astrologi yang mencatat posisi planet saat kelahiran Anda. Dengan mempelajari empat elemen, dua belas tanda zodiak, dan dua belas rumah, Anda dapat membuka misteri peta bintang dan memahami kepribadian, bakat, dan jalur hidup Anda.',
    },
    author: '星缘团队', authorEn: 'Lunaxstar Team', authorId: 'Tim Lunaxstar',
    date: '2026-05-20', readTime: 8,
    tags: ['本命盘', '星盘解读', '出生盘', '十二星座', '宫位'],
  },
  {
    id: '2',
    slug: 'transit-chart-guide',
    category: 'guide',
    categoryZh: '指南', categoryEn: 'Guide', categoryId: 'Guide',
    title: {
      zh: '推运盘完全指南：预测你的流年运势',
      en: 'Transit Chart Guide: Predict Your Yearly Horoscope',
      id: 'Panduan Bagan Transit: Memprediksi Ramalan Tahunan Anda',
    },
    excerpt: {
      zh: '推运盘（Transit Chart）展示了当前行星位置与你出生星图的互动关系。通过解读行星相位和流年运势，你可以把握时机，提前规划人生重要决策。',
      en: 'A transit chart shows the interaction between current planetary positions and your birth chart. By interpreting planetary aspects and yearly horoscopes, you can seize opportunities and plan important life decisions in advance.',
      id: 'Bagan transit menunjukkan interaksi antara posisi planet saat ini dan bagan kelahiran Anda. Dengan menafsirkan aspek planet dan ramalan tahunan, Anda dapat memanfaatkan peluang dan merencanakan keputusan hidup penting sebelumnya.',
    },
    author: '星缘团队', authorEn: 'Lunaxstar Team', authorId: 'Tim Lunaxstar',
    date: '2026-05-20', readTime: 10,
    tags: ['推运盘', '行运', '行星相位', '流年', 'Transit chart'],
  },
  {
    id: '3',
    slug: 'composite-chart-analysis',
    category: 'analysis',
    categoryZh: '分析', categoryEn: 'Analysis', categoryId: 'Analysis',
    title: {
      zh: '合盘关系分析：揭秘你们的情感兼容性',
      en: 'Composite Chart Analysis: Reveal Your Relationship Compatibility',
      id: 'Analisis Bagan Komposit: Mengungkap Kompatibilitas Hubungan Anda',
    },
    excerpt: {
      zh: '合盘（Composite Chart）是关系占星学的精华，通过合并两个人的出生数据，揭示关系的本质、挑战和成长方向。了解月亮星座兼容性，让爱情更加和谐。',
      en: 'A composite chart is the essence of relationship astrology. By combining two people’s birth data, it reveals the relationship’s essence, challenges, and growth direction. Understand moon sign compatibility for more harmonious love.',
      id: 'Bagan komposit adalah inti astrologi hubungan. Dengan menggabungkan data kelahiran dua orang, ini mengungkap esensi hubungan, tantangan, dan arah pertumbuhan. Pahami kompatibilitas tanda bulan untuk cinta yang lebih harmonis.',
    },
    author: '星缘团队', authorEn: 'Lunaxstar Team', authorId: 'Tim Lunaxstar',
    date: '2026-05-20', readTime: 9,
    tags: ['合盘', '组合盘', '关系占星', 'compatibility', 'synastry'],
  },
  {
    id: '4',
    slug: 'zodiac-personality-analysis',
    category: 'analysis',
    categoryZh: '分析', categoryEn: 'Analysis', categoryId: 'Analysis',
    title: {
      zh: '十二星座性格解析：四元素深度解读',
      en: 'Zodiac Personality Analysis: Deep Dive into Four Elements',
      id: 'Analisis Kepribadian Zodiak: Membedah Empat Elemen Secara Mendalam',
    },
    excerpt: {
      zh: '火象星座热情冲动，土象星座踏实稳重，风象星座聪明善辩，水象星座情感丰富。深入了解四元素如何影响十二星座的性格特质和守护星。',
      en: 'Fire signs are passionate and impulsive, Earth signs are practical and stable, Air signs are intelligent and communicative, Water signs are emotionally rich. Deep dive into how the four elements influence zodiac personality traits and ruling planets.',
      id: 'Tanda api penuh gairah dan impulsif, tanda bumi praktis dan stabil, tanda udara cerdas dan komunikatif, tanda air kaya secara emosional. Membedah secara mendalam bagaimana empat elemen mempengaruhi sifat kepribadian zodiak dan planet penguasa.',
    },
    author: '星缘团队', authorEn: 'Lunaxstar Team', authorId: 'Tim Lunaxstar',
    date: '2026-05-20', readTime: 12,
    tags: ['星座性格', '火象星座', '土象星座', '风象星座', '水象星座'],
  },
  {
    id: '5',
    slug: 'ai-astrology-advantages',
    category: 'technology',
    categoryZh: '科技', categoryEn: 'Technology', categoryId: 'Technology',
    title: {
      zh: 'AI占星解读的优势：传统vs人工智能',
      en: 'AI Astrology Advantages: Traditional vs Artificial Intelligence',
      id: 'Keunggulan Astrologi AI: Tradisional vs Kecerdasan Buatan',
    },
    excerpt: {
      zh: 'AI占星结合了古老智慧与现代科技，提供24/7免费服务、客观解读和个性化分析。星缘使用LLaMA模型，让每个人都能获得专业的占星指导。',
      en: 'AI astrology combines ancient wisdom with modern technology, offering 24/7 free service, objective interpretation, and personalized analysis. Lunaxstar uses LLaMA models to make professional astrological guidance accessible to everyone.',
      id: 'Astrologi AI menggabungkan kebijaksanaan kuno dengan teknologi modern, menawarkan layanan gratis 24/7, interpretasi objektif, dan analisis personalisasi. Lunaxstar menggunakan model LLaMA untuk membuat panduan astrologi profesional dapat diakses oleh semua orang.',
    },
    author: '星缘团队', authorEn: 'Lunaxstar Team', authorId: 'Tim Lunaxstar',
    date: '2026-05-20', readTime: 7,
    tags: ['AI占星', '免费解读', 'LLaMA占星', 'AI astrology', '人工智能'],
  },
  {
    id: '6',
    slug: '2026-horoscope-predictions',
    category: 'horoscope',
    categoryZh: '运势', categoryEn: 'Horoscope', categoryId: 'Horoscope',
    title: {
      zh: '2026年星座运势：哪些星座将迎来最佳年份',
      en: '2026 Horoscope Predictions: Which Signs Will Have the Best Year',
      id: 'Ramalan Zodiak 2026: Tanda Zodiak Mana yang Akan Memiliki Tahun Terbaik',
    },
    excerpt: {
      zh: '2026年，木星进入处女座，土星在双鱼座，天王星在双子座。这将是非常特殊的一年！了解行星 alignments 如何影响你的星座，提前规划精彩一年。',
      en: 'In 2026, Jupiter enters Virgo, Saturn is in Pisces, and Uranus is in Gemini. This will be a very special year! Learn how planetary alignments affect your sign and plan an amazing year ahead.',
      id: 'Pada 2026, Jupiter memasuki Virgo, Saturnus di Pisces, dan Uranus di Gemini. Ini akan menjadi tahun yang sangat istimewa! Pelajari bagaimana penyelarasan planet mempengaruhi tanda Anda dan rencanakan tahun yang luar biasa ke depan.',
    },
    author: '星缘团队', authorEn: 'Lunaxstar Team', authorId: 'Tim Lunaxstar',
    date: '2026-05-20', readTime: 11,
    tags: ['2026运势', '今年星座', '年度预测', 'yearly horoscope', '2026'],
  },
];

export function getBlogSummaries(): BlogSummary[] {
  return [
    ...sourceArticles.map(toBlogSummary),
    ...legacyBlogSummaries,
  ];
}
```

The six records above deliberately contain no `content` key. Their index-visible fields and ordering match the current cards.

- [ ] **Step 5: Recreate the route as a server component**

Create `src/app/blog/page.tsx`:

```tsx
import BlogIndexClient from './BlogIndexClient';
import { getBlogSummaries } from './blogIndexData';

export default function BlogPage() {
  const articles = getBlogSummaries();
  return <BlogIndexClient articles={articles} />;
}
```

- [ ] **Step 6: Run boundary tests and production type/build checks**

Run:

```bash
npm run test:performance-boundaries
npm run build
```

Expected:

- `Performance boundary tests passed`
- `next build` exits `0`
- `/blog` remains a generated route
- the `/blog` first-load size is lower than the recorded `827 kB` baseline

If the TypeScript compiler reports an imported article shape mismatch, normalize that field inside `sourceArticles`; do not weaken `BlogSummary` with `any` and do not pass `content` to the client.

- [ ] **Step 7: Commit the blog split**

```bash
git add src/app/blog scripts/test-performance-boundaries.mjs package.json
git commit -m "perf: keep blog article bodies on the server"
```

---

### Task 3: Move Firebase Behind A Dynamic Client Loader

**Files:**
- Create: `src/lib/loadFirebaseClient.ts`
- Modify: `src/lib/firebase.ts`
- Modify: `src/contexts/AuthContext.tsx`
- Modify: `src/app/natal/page.tsx`
- Test: `scripts/test-performance-boundaries.mjs`

- [ ] **Step 1: Add the one allowed Firebase dynamic-import boundary**

Create `src/lib/loadFirebaseClient.ts`:

```ts
let firebaseClientPromise: Promise<typeof import('@/lib/firebase')> | null = null;

export function loadFirebaseClient() {
  firebaseClientPromise ??= import('@/lib/firebase').catch((error) => {
    firebaseClientPromise = null;
    throw error;
  });
  return firebaseClientPromise;
}
```

The cached promise prevents duplicate imports when auth initialization and a user action occur close together.

- [ ] **Step 2: Add password reset to the Firebase facade**

In `src/lib/firebase.ts`, add `sendPasswordResetEmail` to the existing `firebase/auth` import and export this function after auth initialization:

```ts
export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase 未配置，无法发送密码重置邮件');
  }
  await sendPasswordResetEmail(auth, email);
}
```

No other production file may import `sendPasswordResetEmail` from `firebase/auth` after this step.

- [ ] **Step 3: Replace AuthContext's static Firebase imports while preserving its public interface**

In `src/contexts/AuthContext.tsx`:

1. Delete the complete value import from `@/lib/firebase`.
2. Add `import { loadFirebaseClient } from '@/lib/loadFirebaseClient';`.
3. Replace `FirebaseUserProfile` with this local structural type:

```ts
type FirebaseProfileShape = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  language?: string;
};

function toLocalProfile(fp: FirebaseProfileShape): UserProfile {
  return {
    uid: fp.uid,
    email: fp.email,
    displayName: fp.displayName,
    photoURL: fp.photoURL,
    language: (fp.language as UserProfile['language']) || 'zh',
  };
}
```

4. Add real readiness state and a local-profile fallback helper:

```ts
const [isFirebaseReady, setIsFirebaseReady] = useState(false);

const restoreLocalUser = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const local = JSON.parse(saved) as UserProfile;
      setUser(local);
      setProfile(local);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  setIsLoading(false);
};
```

5. Replace the initialization effect with a dynamic import and safe cleanup:

```ts
useEffect(() => {
  let active = true;
  let unsubscribe: (() => void) | undefined;

  void loadFirebaseClient()
    .then((firebase) => {
      if (!active) return;
      setIsFirebaseReady(firebase.isFirebaseConfigured);

      if (!firebase.isFirebaseConfigured || !firebase.auth) {
        restoreLocalUser();
        return;
      }

      unsubscribe = firebase.onAuthChange(async (firebaseUser) => {
        if (!active) return;
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        try {
          const stored = await firebase.getUserProfile(firebaseUser.uid);
          const local = stored
            ? toLocalProfile(stored as FirebaseProfileShape)
            : {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName:
                  firebaseUser.displayName ||
                  firebaseUser.email?.split('@')[0] ||
                  'User',
                photoURL: firebaseUser.photoURL || undefined,
                language: 'zh' as const,
              };
          if (active) {
            setUser(local);
            setProfile(local);
          }
        } catch (error) {
          console.error('Get profile error:', error);
        } finally {
          if (active) setIsLoading(false);
        }
      });
    })
    .catch((error) => {
      console.error('Firebase initialization error:', error);
      if (active) restoreLocalUser();
    });

  return () => {
    active = false;
    unsubscribe?.();
  };
}, []);
```

6. In `login`, `register`, `loginWithGoogleFn`, and `updateUser`, call `const firebase = await loadFirebaseClient()` inside the action before accessing Firebase functions. Keep the current local-user fallback when `firebase.isFirebaseConfigured` is false.
7. Keep `logout: () => void` synchronous for callers: clear React/localStorage state immediately, then call Firebase in the background.

Use this exact logout implementation:

```ts
const logout = () => {
  setUser(null);
  setProfile(null);
  localStorage.removeItem(STORAGE_KEY);

  void loadFirebaseClient()
    .then((firebase) => {
      if (firebase.isFirebaseConfigured) return firebase.logout();
    })
    .catch((error) => console.error('Logout error:', error));
};
```

The provider value remains API-compatible:

```tsx
<AuthContext.Provider
  value={{
    user,
    profile,
    isLoading,
    isConfigured: true,
    isFirebaseReady,
    login,
    register,
    signIn,
    signUp,
    loginWithGoogle: loginWithGoogleFn,
    logout,
    signOut: logout,
    updateUser,
  }}
>
  {children}
</AuthContext.Provider>
```

- [ ] **Step 4: Remove natal's direct Firebase imports**

In `src/app/natal/page.tsx`:

1. Delete imports of `auth`, `logout`, and `sendPasswordResetEmail`.
2. Add:

```ts
import { useAuth } from '@/contexts/AuthContext';
import { loadFirebaseClient } from '@/lib/loadFirebaseClient';
```

3. Inside `NatalPage`, obtain the current user and logout action:

```ts
const { user, logout } = useAuth();
```

4. Replace the two account handlers with:

```ts
const handlePasswordReset = async () => {
  setOpenMenu(null);
  const email = user?.email || window.prompt('请输入注册邮箱');
  if (!email) return;

  try {
    const firebase = await loadFirebaseClient();
    await firebase.sendPasswordReset(email);
    alert('密码重置邮件已发送');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '发送失败';
    alert(message);
  }
};

const handleLogout = () => {
  setOpenMenu(null);
  logout();
  alert('已登出');
  window.location.href = '/login';
};
```

Do not change chart state, chart requests, wheel rendering, aspect rendering, tabs, or calculator actions.

- [ ] **Step 5: Run focused tests and production build**

Run:

```bash
npm run test:performance-boundaries
npm run build
```

Expected:

- `Performance boundary tests passed`
- build exits `0`
- shared first-load JavaScript is measurably below the `339 kB` reference, or the output is recorded as unchanged with no false reduction claim
- `/natal` does not exceed its `483 kB` reference

- [ ] **Step 6: Commit the Firebase boundary**

```bash
git add src/lib/loadFirebaseClient.ts src/lib/firebase.ts src/contexts/AuthContext.tsx src/app/natal/page.tsx
git commit -m "perf: load firebase through an optional client chunk"
```

---

### Task 4: Add One Shared Natal FAQ Data Source

**Files:**
- Create: `src/components/natalFaq.ts`
- Create: `scripts/test-natal-seo-content.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the FAQ parity and internal-link test first**

Create `scripts/test-natal-seo-content.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  natalFaqs,
  serializeNatalFaqJsonLd,
} from "../src/components/natalFaq.ts";

assert.ok(natalFaqs.length >= 6);
assert.equal(new Set(natalFaqs.map((faq) => faq.question)).size, natalFaqs.length);

for (const faq of natalFaqs) {
  assert.ok(faq.question.trim().length >= 12);
  assert.ok(faq.answer.trim().length >= 40);
}

const faqSchema = JSON.parse(serializeNatalFaqJsonLd(natalFaqs));
assert.equal(faqSchema["@context"], "https://schema.org");
assert.equal(faqSchema["@type"], "FAQPage");
assert.deepEqual(
  faqSchema.mainEntity.map((entry) => ({
    question: entry.name,
    answer: entry.acceptedAnswer.text,
  })),
  natalFaqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  })),
);

const contentSource = fs.readFileSync("src/components/NatalSeoContent.tsx", "utf8");
const layoutSource = fs.readFileSync("src/app/natal/layout.tsx", "utf8");

for (const href of [
  "/solar-return",
  "/transits",
  "/compatibility",
  "/bazi",
  "/blog/what-does-my-birth-chart-mean",
]) {
  assert.ok(contentSource.includes(`href: '${href}'`), `Missing natal link ${href}`);
}

assert.match(contentSource, /How to read your natal chart/);
assert.match(contentSource, /Birth time accuracy/);
assert.match(contentSource, /natalFaqs\.map/);
assert.match(layoutSource, /serializeNatalFaqJsonLd\(natalFaqs\)/);
assert.match(layoutSource, /<NatalSeoContent \/>/);
assert.equal((layoutSource.match(/FAQPage/g) || []).length, 0);

console.log("Natal SEO content tests passed");
```

- [ ] **Step 2: Register the focused test command**

Add to `package.json`:

```json
"test:natal-seo-content": "node --experimental-strip-types scripts/test-natal-seo-content.mjs"
```

- [ ] **Step 3: Run the test and verify that it fails for the missing FAQ module**

Run:

```bash
npm run test:natal-seo-content
```

Expected: non-zero exit with `ERR_MODULE_NOT_FOUND` for `src/components/natalFaq.ts`.

- [ ] **Step 4: Create the canonical FAQ data and serializer**

Create `src/components/natalFaq.ts`:

```ts
export type NatalFaq = Readonly<{
  question: string;
  answer: string;
}>;

export const natalFaqs: readonly NatalFaq[] = [
  {
    question: 'What is a natal chart?',
    answer:
      'A natal chart is a map of the sky calculated for your birth date, exact birth time, and birthplace. It shows the zodiac positions of the planets, the Ascendant, the Midheaven, the twelve houses, and the angular relationships called aspects.',
  },
  {
    question: 'How accurate is this birth chart calculator?',
    answer:
      'The calculator uses astronomical ephemeris data to determine planetary positions and house cusps. Its angles and houses are only as accurate as the birth time, time zone, and location you enter, so recorded birth information gives the most reliable result.',
  },
  {
    question: 'What is the difference between a Sun sign and a Rising sign?',
    answer:
      'The Sun sign describes the zodiac position of the Sun and is commonly associated with identity and purpose. The Rising sign, or Ascendant, is the sign rising on the eastern horizon and changes much faster, so it depends strongly on birth time and location.',
  },
  {
    question: 'What do the twelve houses mean in a natal chart?',
    answer:
      'The twelve houses organize the chart into life areas such as identity, resources, communication, home, relationships, career, and community. A planet is interpreted through its sign, its house, and the aspects it makes to other planets.',
  },
  {
    question: 'How should I read aspects between planets?',
    answer:
      'Aspects describe angular relationships between planets. Conjunctions combine themes, trines and sextiles often show easier cooperation, while squares and oppositions often describe tension that requires awareness, choices, and development.',
  },
  {
    question: 'What should I enter if I do not know my exact birth time?',
    answer:
      'You can use an estimated time to inspect planetary signs, but the Ascendant, Midheaven, house cusps, and house placements may be wrong. Treat time-sensitive interpretations as uncertain until you can confirm the time from a birth record or another reliable source.',
  },
  {
    question: 'Can a natal chart predict the future?',
    answer:
      'A natal chart describes a symbolic pattern for the birth moment rather than a guaranteed future. Astrologers combine it with timing techniques such as transits and returns to discuss themes and possibilities, not fixed outcomes or certain events.',
  },
];

export function serializeNatalFaqJsonLd(
  faqs: readonly NatalFaq[],
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }).replace(/</g, '\\u003c');
}
```

- [ ] **Step 5: Run the focused test and confirm the next expected failure**

Run:

```bash
npm run test:natal-seo-content
```

Expected: FAQ data assertions pass, then the script exits non-zero because `src/components/NatalSeoContent.tsx` does not exist.

Do not commit while the integration test is still red. Task 5 commits the FAQ data, guide, layout integration, tests, and package scripts together after all assertions pass.

---

### Task 5: Render The Natal Guide After The Complete Calculator

**Files:**
- Create: `src/components/NatalSeoContent.tsx`
- Modify: `src/app/natal/layout.tsx`
- Modify: `package.json`
- Test: `scripts/test-natal-seo-content.mjs`

- [ ] **Step 1: Create the server-rendered guide**

Create `src/components/NatalSeoContent.tsx` without a `'use client'` directive:

```tsx
import Link from 'next/link';
import { natalFaqs } from '@/components/natalFaq';

const relatedTools = [
  { href: '/solar-return', label: 'Calculate your Solar Return' },
  { href: '/transits', label: 'Open the astrology calendar' },
  { href: '/compatibility', label: 'Compare relationship charts' },
  { href: '/bazi', label: 'Create a BaZi chart' },
  { href: '/blog/what-does-my-birth-chart-mean', label: 'Read the birth chart guide' },
] as const;

export default function NatalSeoContent() {
  return (
    <section
      id="natal-chart-guide"
      aria-labelledby="natal-chart-guide-title"
      className="border-t border-gray-200 px-4 py-12 sm:px-6"
    >
      <div className="mx-auto max-w-4xl">
        <h2 id="natal-chart-guide-title" className="text-2xl font-bold text-gray-900">
          How to read your natal chart
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
          A birth chart combines planets, zodiac signs, houses, and aspects into one map of
          the sky at your birth moment. Start with the major angles and personal planets,
          then add house placement and aspects instead of reading each symbol in isolation.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <section aria-labelledby="natal-reading-order-title">
            <h3 id="natal-reading-order-title" className="text-lg font-semibold text-gray-900">
              A practical reading order
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-600 sm:text-base">
              <li>Read the Sun, Moon, and Ascendant as the chart&apos;s foundation.</li>
              <li>Check each personal planet&apos;s sign and house.</li>
              <li>Identify close conjunctions, oppositions, squares, trines, and sextiles.</li>
              <li>Use house rulers and timing techniques only after the natal pattern is clear.</li>
            </ol>
          </section>

          <section aria-labelledby="natal-birth-time-title">
            <h3 id="natal-birth-time-title" className="text-lg font-semibold text-gray-900">
              Birth time accuracy
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Birth time has the greatest effect on the Ascendant, Midheaven, house cusps,
              and planet house placements. A small time difference can move these points,
              so use the time recorded on an official birth record whenever possible.
            </p>
          </section>
        </div>

        <section aria-labelledby="natal-chart-parts-title" className="mt-10">
          <h3 id="natal-chart-parts-title" className="text-lg font-semibold text-gray-900">
            The four parts of a birth chart
          </h3>
          <dl className="mt-4 grid gap-x-8 gap-y-5 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:text-base">
            <div>
              <dt className="font-semibold text-gray-900">Planets</dt>
              <dd className="mt-1">The functions and drives being expressed, from identity and emotion to communication and action.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Signs</dt>
              <dd className="mt-1">The style, motivation, and qualities through which each planet operates.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Houses</dt>
              <dd className="mt-1">The life areas where planetary themes become most visible and concrete.</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Aspects</dt>
              <dd className="mt-1">The angular relationships showing how different planets cooperate, reinforce, or challenge one another.</dd>
            </div>
          </dl>
        </section>

        <nav aria-label="Related astrology calculators" className="mt-10 border-y border-gray-200 py-5">
          <h3 className="text-lg font-semibold text-gray-900">Continue your chart study</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="font-medium text-gray-700 underline underline-offset-4 hover:text-gray-950"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </nav>

        <section aria-labelledby="natal-faq-title" className="mt-10">
          <h3 id="natal-faq-title" className="text-2xl font-bold text-gray-900">
            Natal chart FAQ
          </h3>
          <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
            {natalFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-gray-900 marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace hardcoded FAQ JSON-LD and append the guide in the natal layout**

Replace `src/app/natal/layout.tsx` with:

```tsx
import NatalSeoContent from '@/components/NatalSeoContent';
import {
  natalFaqs,
  serializeNatalFaqJsonLd,
} from '@/components/natalFaq';
import { natalMetadata } from '@/lib/seoMetadata';

export const metadata = natalMetadata;

const natalWebPageJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Free Birth Chart Calculator - Natal Chart Analysis',
  description:
    'Generate your free professional natal chart based on real astronomical calculations. AI-powered interpretation reveals your core self, emotions, relationships and life purpose.',
  url: 'https://lunaxstar.com/natal',
  isPartOf: {
    '@type': 'WebSite',
    name: 'LunaxStar',
    url: 'https://lunaxstar.com',
  },
}).replace(/</g, '\\u003c');

export default function NatalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: natalWebPageJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeNatalFaqJsonLd(natalFaqs),
        }}
      />
      {children}
      <NatalSeoContent />
    </>
  );
}
```

This placement is mandatory: the guide must follow the complete natal page rather than appearing between the form, chart, aspect matrix, or professional tables.

- [ ] **Step 3: Add both focused tests to the acquisition suite**

Change the `test:acquisition` script in `package.json` to:

```json
"test:acquisition": "npm run test:seo-metadata && npm run test:blog-index && npm run test:solar-return-content && npm run test:analytics && npm run test:natal-mobile && npm run test:performance-boundaries && npm run test:natal-seo-content"
```

- [ ] **Step 4: Run the focused and aggregate suites**

Run:

```bash
npm run test:natal-seo-content
npm run test:acquisition
```

Expected:

- `Natal SEO content tests passed`
- `Performance boundary tests passed`
- every pre-existing acquisition test exits `0`

- [ ] **Step 5: Commit the natal guide**

```bash
git add src/components/natalFaq.ts src/components/NatalSeoContent.tsx src/app/natal/layout.tsx scripts/test-natal-seo-content.mjs package.json
git commit -m "feat: add indexable natal chart guidance"
```

---

### Task 6: Verify Calculators, Bundles, And Browser Behavior

**Files:**
- Verify only; do not change chart implementation files during this task.

- [ ] **Step 1: Run all scoped regression checks**

Run:

```bash
npm run test:acquisition
node scripts/test-latest-birth-profile.mjs
node scripts/test-bazi-view-data.mjs
git diff --check
```

Expected: every command exits `0`, with no whitespace errors.

- [ ] **Step 2: Produce and save the final production build report**

Run:

```bash
npm run build | tee /tmp/lunaxstar-core-acquisition-build.txt
```

Expected: build exits `0`. Record the exact shared, `/natal`, and `/blog` sizes from this report next to the accepted baseline values.

Inspect the report with:

```bash
rg -n "First Load JS shared by all|/blog|/natal" /tmp/lunaxstar-core-acquisition-build.txt
```

Acceptance:

- `/blog` is measurably below `827 kB`.
- shared JavaScript is measurably below `339 kB`, or the final report explicitly records that it remained unchanged.
- `/natal` is no larger than `483 kB`.

- [ ] **Step 3: Start the production server for browser checks**

Run:

```bash
npm run start -- --hostname 127.0.0.1 --port 3017
```

Expected: `Ready` and listener `http://127.0.0.1:3017`.

- [ ] **Step 4: Verify initial HTML contains indexable natal content**

Run:

```bash
curl -fsS http://127.0.0.1:3017/natal > /tmp/lunaxstar-natal.html
rg -n "How to read your natal chart|Birth time accuracy|Natal chart FAQ|href=\"/solar-return\"|href=\"/transits\"|href=\"/compatibility\"|href=\"/bazi\"" /tmp/lunaxstar-natal.html
```

Expected: all guide headings and all four canonical links appear without browser hydration.

- [ ] **Step 5: Verify `/natal` at mobile and desktop widths with Playwright**

At `390x844`:

1. Open `http://127.0.0.1:3017/natal`.
2. Wait for the chart request to finish and confirm the chart wheel and aspect matrix are nonblank.
3. Confirm `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
4. Change one birth-form field and submit/update the chart; confirm a new successful `/api/chart` response and a rendered chart.
5. Open the AI reading panel and confirm its input and send control are visible.
6. Confirm `储存星图`, `复制链接`, and `导出图片` remain visible after chart generation.
7. Scroll past all professional tables and confirm `How to read your natal chart` appears only after them.
8. Open one native FAQ disclosure and confirm the answer is readable.

Repeat at `1440x1000` and confirm the established aspect-table-left/chart-right desktop arrangement has not changed. Capture screenshots for both viewports and inspect them visually.

Expected: no first-party console errors, chart rendering remains populated, controls work, and the new guide does not overlap or interrupt calculator content.

- [ ] **Step 6: Verify `/blog` interaction and article navigation**

At `390x844` and `1440x1000`:

1. Open `http://127.0.0.1:3017/blog`.
2. Confirm titles, localized excerpts, category labels, read times, and dates render.
3. Use pagination and confirm the list updates without a console error.
4. Open one SEO article and one destiny article; confirm both detail routes render their full body.

Expected: the index behaves as before, while full article bodies remain available on detail routes.

- [ ] **Step 7: Verify deferred auth behavior**

1. Open a calculator route in a fresh browser context and confirm the calculator becomes usable even if Firebase initialization is delayed.
2. Navigate to `/login`, complete one configured authentication flow, and confirm the current Navbar/user state updates.
3. Return to `/natal`, invoke password reset with a valid email, and confirm the existing success or Firebase error message appears without affecting the chart.
4. Invoke logout and confirm navigation to `/login`.

Expected: auth actions remain functional and a Firebase error cannot blank or block the natal calculator.

- [ ] **Step 8: Commit any test-only corrections, then confirm a clean tree**

If browser verification exposed a scoped defect, fix only the file responsible, rerun Steps 1–7, then commit with a message describing that defect. After verification, run:

```bash
git status --short
git log --oneline -6
```

Expected: no uncommitted changes and the blog, Firebase, FAQ, and natal-guide commits are present.

---

### Task 7: Deploy And Verify Production

**Files:**
- No source changes expected.

- [ ] **Step 1: Push the verified commits**

Run:

```bash
git push origin main
```

Expected: `main -> main` succeeds.

- [ ] **Step 2: Create the production Vercel deployment**

Run:

```bash
set -o pipefail
npx vercel --prod --yes 2>&1 | tee /tmp/lunaxstar-vercel-deploy.txt
```

Expected: the command exits `0` and prints a new Vercel production URL. Save it immediately:

```bash
rg -o 'https://[^ ]+\.vercel\.app' /tmp/lunaxstar-vercel-deploy.txt | tail -n 1 > /tmp/lunaxstar-deployment-url.txt
test -s /tmp/lunaxstar-deployment-url.txt
```

- [ ] **Step 3: Point the verified deployment at the production domain**

Run with the URL saved in Step 2:

```bash
npx vercel alias set "$(cat /tmp/lunaxstar-deployment-url.txt)" lunaxstar.com
```

Expected: Vercel reports that `https://lunaxstar.com` now points to the new deployment.

- [ ] **Step 4: Repeat production smoke checks**

Run:

```bash
curl -fsSI https://lunaxstar.com/natal
curl -fsSI https://lunaxstar.com/blog
curl -fsS https://lunaxstar.com/natal | rg "How to read your natal chart|Natal chart FAQ"
```

Expected: both routes return `200`, and the server HTML contains the guide and FAQ headings.

Use Playwright against `https://lunaxstar.com/natal` and `https://lunaxstar.com/blog` at `390x844` and desktop width. Repeat the populated-chart, no-overflow, blog-pagination, article-detail, FAQ, and console checks from Task 6.

- [ ] **Step 5: Record the production result**

The final implementation report must include:

- commit range deployed
- production deployment URL and `https://lunaxstar.com` alias confirmation
- before/after shared, `/natal`, and `/blog` build sizes
- automated test commands and results
- browser viewport checks and console result
- confirmation that no chart algorithm, chart component, aspect-table component, route URL, or sitemap URL set changed

Do not resubmit the sitemap in Search Console because this batch does not change the canonical URL set.
