declare module "lunar-javascript" {
  export const Solar: {
    fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): {
      getLunar(): {
        toString(): string;
        getJieQi(): string;
        getPrevJieQi(): {
          getName(): string;
          getSolar(): { toYmdHms(): string };
        };
        getNextJieQi(): {
          getName(): string;
          getSolar(): { toYmdHms(): string };
        };
        getEightChar(): {
          getYear(): string;
          getMonth(): string;
          getDay(): string;
          getTime(): string;
          getDayGan(): string;
          getDayZhi(): string;
          getDayWuXing(): string;
          getDayShiShenGan(): string;
          getYearHideGan(): string[];
          getMonthHideGan(): string[];
          getDayHideGan(): string[];
          getTimeHideGan(): string[];
          getYearWuXing(): string;
          getMonthWuXing(): string;
          getTimeWuXing(): string;
          getYearShiShenGan(): string;
          getMonthShiShenGan(): string;
          getTimeShiShenGan(): string;
          getNaYin(): string;
          getYearNaYin(): string;
          getMonthNaYin(): string;
          getDayNaYin(): string;
          getTimeNaYin(): string;
        };
      };
    };
  };
}
