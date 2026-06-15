"use client";

import NatalChartWheel from "@/components/NatalChartWheel";
import { AspectMatrix } from "@/components/AlmutenChartLayout";

type ChartData = {
  planets?: Record<string, any>;
  houses?: any[];
  aspects?: any[];
  ascendant?: any;
  midheaven?: any;
};

export default function ClassicReturnChart({ chart, className = "" }: { chart: ChartData; className?: string }) {
  return (
    <section data-classic-return-chart="true" className={`w-full overflow-x-auto rounded border border-[#bbb] bg-white ${className}`}>
      <div className="flex min-w-[1040px] items-start justify-center gap-8 px-4 pb-5 pt-2">
        <div className="w-[430px] shrink-0">
          <AspectMatrix chart={chart} />
        </div>
        <div className="w-[540px] shrink-0 pt-2">
          <NatalChartWheel chart={chart} />
        </div>
      </div>
    </section>
  );
}
