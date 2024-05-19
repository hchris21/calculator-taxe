import { Calculator } from "@/components/Calculator";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-24 w-full">
      <h1 className="text-4xl font-bold">Calculator Taxe 2024</h1>
      <Calculator />
    </main>
  );
}
