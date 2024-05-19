import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Input,
} from "@/components/ui";
import type { TaxBreakdownT } from "@/utils/taxCalculator";
import React from "react";

type TaxBreakdownProps = {
  title: string;
  taxes: TaxBreakdownT;
};

export const TaxBreakdown = ({ title, taxes }: TaxBreakdownProps) => {
  const isSRL = ["SRL - Profit", "SRL - Micro"].includes(title);

  return (
    <Card className="w-[350px] mt-10 pt-8">
      <CardHeader className="pt-0 pb-10">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {!isSRL && (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cas" className="mb-0 text-xl">
                CAS (RON): {taxes.CAS}
              </Label>
            </div>
          )}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="cass" className="mb-0 text-xl">
              CASS (RON): {taxes.CASS}
            </Label>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="impozit" className="mb-0 text-xl">
              {isSRL ? "Impozit SRL (RON)" : "Impozit venit (RON)"}:{" "}
              {isSRL ? taxes.srlTax : taxes.incomeTax}
            </Label>
          </div>
          {isSRL && (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dividend" className="mb-0 text-xl">
                Impozit dividende (RON): {taxes.dividendTax}
              </Label>
            </div>
          )}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="totalTax" className="mb-0 text-xl font-bold">
              Total taxe (RON): {taxes.totalTaxes}
            </Label>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="totalNet" className="mb-0 text-xl font-bold">
              Total net (RON): {taxes.netIncome}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
