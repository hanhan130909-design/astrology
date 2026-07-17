import Link from "next/link";
import { solarReturnFaqs } from "@/components/solarReturnFaq";

export { solarReturnFaqs } from "@/components/solarReturnFaq";

export default function SolarReturnSeoContent() {
  return (
    <section
      aria-labelledby="solar-return-guide-title"
      className="mt-14 border-t border-gray-200 pt-10"
    >
      <div className="mx-auto max-w-3xl">
        <h2 id="solar-return-guide-title" className="text-2xl font-bold text-gray-900">
          What is a Solar Return chart?
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
          <p>
            A Solar Return chart maps the sky at the precise moment the Sun returns to the
            same zodiac position it held when you were born. That moment happens once each
            year near your birthday, and the chart is commonly read as a guide to the themes,
            priorities, and turning points of the year ahead.
          </p>
          <p>
            This calculator uses your birth date and time to identify your natal Sun position,
            then finds its next annual return. The coordinates selected in the form are used as
            the return location for the chart angles and houses, so location can change the
            Ascendant and where planets fall by house without changing the return moment itself.
          </p>
        </div>

        <nav
          aria-label="Related astrology resources"
          className="mt-8 border-y border-gray-200 py-5"
        >
          <h2 className="text-lg font-semibold text-gray-900">Continue your astrology study</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
            <Link className="font-medium text-gray-700 underline underline-offset-4 hover:text-gray-950" href="/natal">
              Create your natal chart
            </Link>
            <Link className="font-medium text-gray-700 underline underline-offset-4 hover:text-gray-950" href="/transits">
              Check current transits
            </Link>
            <Link
              className="font-medium text-gray-700 underline underline-offset-4 hover:text-gray-950"
              href="/blog/lunar-return-monthly-guide-430"
            >
              Read the Lunar Return guide
            </Link>
          </div>
        </nav>

        <section aria-labelledby="solar-return-faq-title" className="mt-10">
          <h2 id="solar-return-faq-title" className="text-2xl font-bold text-gray-900">
            Solar Return FAQ
          </h2>
          <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
            {solarReturnFaqs.map((faq) => (
              <article key={faq.question} className="py-5">
                <h3 className="text-base font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
