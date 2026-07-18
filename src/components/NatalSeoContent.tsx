import Link from "next/link";
import { natalFaqs } from "@/components/natalFaq";

const relatedTools = [
  { href: "/solar-return", label: "太阳返照盘" },
  { href: "/transits", label: "星象日历" },
  { href: "/compatibility", label: "星座配对" },
  { href: "/bazi", label: "八字排盘" },
  { href: "/blog/what-does-my-birth-chart-mean", label: "本命盘阅读指南" },
] as const;

export default function NatalSeoContent() {
  return (
    <section
      id="natal-chart-guide"
      aria-labelledby="natal-chart-guide-title"
      className="border-t border-gray-200 bg-white px-4 py-12 text-gray-700 sm:px-6 sm:py-16"
    >
      <div className="mx-auto min-w-0 max-w-3xl">
        <h1
          id="natal-chart-guide-title"
          className="text-2xl font-bold text-gray-950 sm:text-3xl"
        >
          如何阅读你的本命盘
        </h1>
        <p className="mt-4 break-words text-sm leading-7 text-gray-600 sm:text-base">
          本命盘由四个层次构成：行星描述正在运作的功能，星座描述它们如何表达，
          宫位将它们安置在生活的不同领域，而相位展示行星之间如何相互关联。
          把这四层放在一起看，不要把任何一个单独的落位当作完整的结论。
        </p>

        <section aria-labelledby="natal-layers-title" className="mt-10">
          <h2 id="natal-layers-title" className="text-xl font-semibold text-gray-950">
            星盘的四个层次
          </h2>
          <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">行星</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                太阳、月亮和行星代表了驱动力和功能，如身份认同、情感、沟通、关系和行动。
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">星座</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                行星所在的星座描述了该行星运作的风格、优先级和特质。
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">宫位</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                十二宫位按生活领域组织行星落位：从自我与资源，到关系、社群、事业与内心体验。
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">相位</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                行星之间测量的角度描述了一种连接，可能让人感觉支持、集中、对比或充满张力。
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="natal-reading-order-title" className="mt-10">
          <h2 id="natal-reading-order-title" className="text-xl font-semibold text-gray-950">
            实用的阅读顺序
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-gray-600 marker:font-semibold marker:text-gray-900 sm:text-base">
            <li>从太阳、月亮和上升星座开始，建立星盘的宏观框架。</li>
            <li>逐一阅读每颗行星——结合它的功能、星座和宫位落点。</li>
            <li>识别反复出现的星座、宫位、元素和主题，而不是孤立地看某一点。</li>
            <li>利用主要相位来判断哪些行星功能互相强化、哪些互相拉扯。</li>
          </ol>
        </section>

        <section aria-labelledby="birth-time-accuracy-title" className="mt-10">
          <h2 id="birth-time-accuracy-title" className="text-xl font-semibold text-gray-950">
            出生时间为什么重要
          </h2>
          <p className="mt-4 break-words text-sm leading-7 text-gray-600 sm:text-base">
            出生时间对上升星座、宫头和行星落宫的影响最大。即使时间只差一点，
            这些位置也可能完全不同。如果不知道准确时间，请重点关注可靠的行星星座
            位置和相位，并注意月亮在一天之内会有显著移动。将宫位和上升星座视为不确定项。
          </p>
        </section>

        <nav aria-label="相关占星工具与指南" className="mt-10 border-y border-gray-200 py-6">
          <h2 className="text-xl font-semibold text-gray-950">相关工具与指南</h2>
          <ul className="mt-4 grid min-w-0 gap-3 text-sm sm:grid-cols-2 sm:text-base">
            {relatedTools.map((tool) => (
              <li key={tool.href} className="min-w-0">
                <Link
                  href={tool.href}
                  className="break-words font-medium text-gray-700 underline underline-offset-4 hover:text-gray-950"
                >
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="natal-faq-title" className="mt-10">
          <h2 id="natal-faq-title" className="text-2xl font-bold text-gray-950">
            本命盘常见问题
          </h2>
          <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
            {natalFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer break-words font-semibold text-gray-900 marker:text-gray-500">
                  {faq.question}
                </summary>
                <p className="mt-3 break-words pr-1 text-sm leading-7 text-gray-600 sm:text-base">
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
