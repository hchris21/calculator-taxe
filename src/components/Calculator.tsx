"use client";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Label,
  Input,
} from "@/components/ui";
import { calculateTaxes } from "@/utils/taxCalculator";
import { TaxBreakdown } from "./TaxBreakdown";

export const Calculator = () => {
  const [accountantTax, setAccountantTax] = useState<number | undefined>(0);
  const [expenses, setExpenses] = useState<number | undefined>(0);
  const [tax, setTax] = useState<number | undefined>();
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleTaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setTax(undefined); // Reset the tax to undefined if the input is empty
    } else {
      setTax(Number(value));
    }
  };

  const handleAccountantTaxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value === "") {
      setAccountantTax(undefined); // Reset the tax to undefined if the input is empty
    } else {
      setAccountantTax(Number(value));
    }
  };

  const handleExpensesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setExpenses(undefined); // Reset the tax to undefined if the input is empty
    } else {
      setExpenses(Number(value));
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowResults(true);
  };

  return (
    <>
      <Card className="w-[350px] mt-10 pt-8" data-testid="calculator-card">
        <form>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 gap-2">
                <Label htmlFor="tax" className="mb-2">
                  Suma incasata lunar (RON)
                </Label>
                <Input
                  id="tax"
                  type="number"
                  placeholder="10000"
                  value={tax !== undefined ? tax : ""}
                  onChange={handleTaxChange}
                  required
                  data-testid="card-income-input"
                />
                <Label htmlFor="accountant" className="mb-2">
                  Contabilitate / an (RON)
                </Label>
                <Input
                  id="accountant"
                  type="number"
                  value={accountantTax !== undefined ? accountantTax : ""}
                  onChange={handleAccountantTaxChange}
                  data-testid="card-accountant-input"
                />
                <Label htmlFor="expenses" className="mb-2">
                  Cheltuieli deductibile / an (RON)
                </Label>
                <Input
                  id="expenses"
                  type="number"
                  value={expenses !== undefined ? expenses : ""}
                  onChange={handleExpensesChange}
                  data-testid="card-expenses-input"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleOnClick}>Calculeaza</Button>
          </CardFooter>
        </form>
      </Card>
      {showResults && !!tax && (
        <>
          <h2 className="text-3xl font-bold mt-10">Comparatie</h2>
          <section className="flex flex-row gap-4 flex-wrap items-center justify-center">
            <TaxBreakdown
              title="CIM"
              taxes={calculateTaxes({
                grossMonthlyIncome: tax,
                contractType: "CIM",
                privateContribution: true,
              })}
            />
            <TaxBreakdown
              title="PFA - Real"
              taxes={calculateTaxes({
                grossMonthlyIncome: tax,
                contractType: "PFAReal",
                accountant: accountantTax,
                expenses,
              })}
            />
            <TaxBreakdown
              title="PFA - Norma de venit"
              taxes={calculateTaxes({
                grossMonthlyIncome: tax,
                contractType: "PFANorma",
                incomeNorm: 40000,
              })}
            />
            <TaxBreakdown
              title="SRL - Profit"
              taxes={calculateTaxes({
                grossMonthlyIncome: tax,
                contractType: "SRLProfit",
                accountant: accountantTax,
                expenses,
              })}
            />
            <TaxBreakdown
              title="SRL - Micro"
              taxes={calculateTaxes({
                grossMonthlyIncome: tax,
                contractType: "SRLMicro",
                caenCode: "6201",
                accountant: accountantTax,
                expenses,
              })}
            />
          </section>
        </>
      )}
    </>
  );
};
