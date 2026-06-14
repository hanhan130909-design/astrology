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
        };
      };
    };
  };
}
