import { Calculator } from "@/components/Calculator";
import { NetRateRatio } from "@/components/NetRateRatio";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24 w-full">
      <h1 className="text-4xl font-bold">Calculator Taxe 2024</h1>
      <Calculator />
      <h1 className="text-4xl font-bold mt-8 mb-4">Net rate ratio</h1>
      <NetRateRatio />
    </main>
  );
}
