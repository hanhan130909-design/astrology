export type SolarReturnRequestPayload<TBirthData> = Readonly<{
  type: "solar_return";
  birthData: TBirthData;
  transitDate: Readonly<{ year: number }>;
  houseSystem: string;
}>;

export function createSolarReturnRequestPayload<TBirthData>(
  birthData: TBirthData,
  year: number,
  houseSystem: string,
): SolarReturnRequestPayload<TBirthData> {
  return {
    type: "solar_return",
    birthData,
    transitDate: { year },
    houseSystem,
  };
}
