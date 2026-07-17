import Link from "next/link";
import { natalFaqs } from "@/components/natalFaq";

const relatedTools = [
  { href: "/solar-return", label: "Solar Return chart" },
  { href: "/transits", label: "Astrology calendar" },
  { href: "/compatibility", label: "Compatibility chart" },
  { href: "/bazi", label: "BaZi calculator" },
  { href: "/blog/what-does-my-birth-chart-mean", label: "Birth chart reading guide" },
] as const;

export default function NatalSeoContent() {
  return (
    <section
      id="natal-chart-guide"
      aria-labelledby="natal-chart-guide-title"
      className="border-t border-gray-200 bg-white px-4 py-12 text-gray-700 sm:px-6 sm:py-16"
    >
      <div className="mx-auto min-w-0 max-w-3xl">
        <h2
          id="natal-chart-guide-title"
          className="text-2xl font-bold text-gray-950 sm:text-3xl"
        >
          How to read your natal chart
        </h2>
        <p className="mt-4 break-words text-sm leading-7 text-gray-600 sm:text-base">
          A natal chart combines four layers: planets describe the functions at work,
          signs describe how they are expressed, houses locate them in areas of life, and
          aspects show how the planets relate to one another. Read these layers together
          instead of treating any single placement as a complete verdict.
        </p>

        <section aria-labelledby="natal-layers-title" className="mt-10">
          <h3 id="natal-layers-title" className="text-xl font-semibold text-gray-950">
            The four chart layers
          </h3>
          <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">Planets</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                The Sun, Moon, and planets represent drives and functions such as identity,
                emotion, communication, relating, and action.
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">Signs</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                The zodiac sign of a planet describes the style, priorities, and qualities
                through which that planet may operate.
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">Houses</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                The twelve houses organize placements by life area, from self and resources
                to relationships, community, vocation, and private experience.
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-semibold text-gray-900">Aspects</dt>
              <dd className="mt-1 min-w-0 break-words text-sm leading-6 text-gray-600 sm:mt-0 sm:text-base">
                The measured angles between planets describe connections that may feel
                supportive, concentrated, contrasting, or demanding.
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="natal-reading-order-title" className="mt-10">
          <h3 id="natal-reading-order-title" className="text-xl font-semibold text-gray-950">
            A practical reading order
          </h3>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-gray-600 marker:font-semibold marker:text-gray-900 sm:text-base">
            <li>Begin with the Sun, Moon, and Rising sign to establish the chart&apos;s broad frame.</li>
            <li>Read each planet by combining its function, sign, and house placement.</li>
            <li>Identify repeated signs, houses, elements, and themes rather than isolating one factor.</li>
            <li>Use major aspects to see where planetary functions reinforce or challenge each other.</li>
          </ol>
        </section>

        <section aria-labelledby="birth-time-accuracy-title" className="mt-10">
          <h3 id="birth-time-accuracy-title" className="text-xl font-semibold text-gray-950">
            Birth time accuracy
          </h3>
          <p className="mt-4 break-words text-sm leading-7 text-gray-600 sm:text-base">
            Birth time has the strongest effect on the Ascendant, house cusps, and which
            houses contain the planets. Even a modest time difference can change those
            placements. If the time is unknown, focus on reliable planetary sign positions
            and aspects, note that the Moon can move noticeably during a day, and treat
            houses and the Rising sign as uncertain.
          </p>
        </section>

        <nav aria-label="Related astrology tools and guides" className="mt-10 border-y border-gray-200 py-6">
          <h3 className="text-xl font-semibold text-gray-950">Related tools and guides</h3>
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
            Natal chart FAQ
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
