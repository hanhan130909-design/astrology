import SolarReturnCalculator from "@/components/SolarReturnCalculator";
import SolarReturnSeoContent from "@/components/SolarReturnSeoContent";

export default function SolarReturnPage() {
  return (
    <>
      <SolarReturnCalculator />
      <div className="bg-white px-6 pb-16">
        <SolarReturnSeoContent />
      </div>
    </>
  );
}
