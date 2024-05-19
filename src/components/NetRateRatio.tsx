"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { calculateTaxes } from "@/utils/taxCalculator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legends: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Net rate ratio 2024",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Venit lunar brut (RON)",
      },
    },
    y: {
      title: {
        display: true,
        text: "Valoare",
      },
    },
  },
};

const labels = Array.from({ length: 100 }, (_, i) => 5000 + i * 500);

const data = {
  labels,
  datasets: [
    {
      label: "CIM",
      data: labels.map(
        (grossMonthlyIncome) =>
          calculateTaxes({
            grossMonthlyIncome,
            contractType: "CIM",
            privateContribution: true,
          }).netRateRatio
      ),
      borderColor: "rgb(255, 255, 0)",
      backgroundColor: "rgba(255, 255, 0, 0.5)",
    },
    {
      label: "PFA - Real",
      data: labels.map(
        (grossMonthlyIncome) =>
          calculateTaxes({
            grossMonthlyIncome,
            contractType: "PFAReal",
            accountant: 0,
            expenses: 0,
          }).netRateRatio
      ),
      borderColor: "rgb(0,0,255)",
      backgroundColor: "rgba(0,0,255,0.5)",
    },
    {
      label: "PFA - Norma de venit",
      data: labels.map(
        (grossMonthlyIncome) =>
          calculateTaxes({
            grossMonthlyIncome,
            contractType: "PFANorma",
            incomeNorm: 40000,
          }).netRateRatio
      ),
      borderColor: "rgb(0,255,0)",
      backgroundColor: "rgba(0,255,0,0.5)",
    },
    {
      label: "SRL - Profit",
      data: labels.map(
        (grossMonthlyIncome) =>
          calculateTaxes({
            grossMonthlyIncome,
            contractType: "SRLProfit",
            accountant: 4000,
            expenses: 0,
          }).netRateRatio
      ),
      borderColor: "rgb(255,0,0)",
      backgroundColor: "rgba(255,0,0,0.5)",
    },
    {
      label: "SRL - Micro",
      data: labels.map(
        (grossMonthlyIncome) =>
          calculateTaxes({
            grossMonthlyIncome,
            contractType: "SRLMicro",
            caenCode: "6201",
            accountant: 4000,
            expenses: 0,
          }).netRateRatio
      ),
      borderColor: "rgb(0,255,255)",
      backgroundColor: "rgba(0,255,255,0.5)",
    },
  ],
};

export const NetRateRatio = () => {
  return (
    <div className="hidden lg:block xl:w-1/2 xl:h-1/2 w-3/4 h-3/4 bg-white rounded-xl border border-black">
      <Line data={data} options={options} />
    </div>
  );
};
