import { afterEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TaxBreakdown } from "../TaxBreakdown";

describe("TaxBreakdown [COMPONENT]", () => {
  afterEach(cleanup);

  test.each`
    title
    ${"SRL - Profit"}
    ${"SRL - Micro"}
  `("should render appropiate components for $title", ({ title }) => {
    const mockTaxes = {
      CAS: 0,
      CASS: 500,
      incomeTax: 0,
      srlTax: 400,
      dividendTax: 300,
      totalTaxes: 1200,
      netIncome: 5000,
      incomeBiggerThanNormLimit: false,
    };
    render(<TaxBreakdown title={title} taxes={mockTaxes} />);

    expect(screen.getByText(`CASS (RON): ${mockTaxes.CASS}`)).toBeDefined();
    expect(
      screen.getByText(`Impozit SRL (RON): ${mockTaxes.srlTax}`)
    ).toBeDefined();
    expect(
      screen.getByText(`Impozit dividende (RON): ${mockTaxes.dividendTax}`)
    ).toBeDefined();
    expect(
      screen.getByText(`Total taxe (RON): ${mockTaxes.totalTaxes}`)
    ).toBeDefined();
    expect(
      screen.getByText(`Total net (RON): ${mockTaxes.netIncome}`)
    ).toBeDefined();
  });

  test.each`
    title
    ${"CIM"}
    ${"PFA - Real"}
    ${"PFA - Norma de venit"}
  `("should render appropiate components for $title", ({ title }) => {
    const mockTaxes = {
      CAS: 500,
      CASS: 200,
      incomeTax: 400,
      srlTax: 0,
      dividendTax: 0,
      totalTaxes: 1100,
      netIncome: 5000,
      incomeBiggerThanNormLimit: false,
    };
    render(<TaxBreakdown title={title} taxes={mockTaxes} />);
    expect(screen.getByText(`CAS (RON): ${mockTaxes.CAS}`)).toBeDefined();
    expect(screen.getByText(`CASS (RON): ${mockTaxes.CASS}`)).toBeDefined();
    expect(
      screen.getByText(`Impozit venit (RON): ${mockTaxes.incomeTax}`)
    ).toBeDefined();
    expect(
      screen.getByText(`Total taxe (RON): ${mockTaxes.totalTaxes}`)
    ).toBeDefined();
    expect(
      screen.getByText(`Total net (RON): ${mockTaxes.netIncome}`)
    ).toBeDefined();
  });
});
