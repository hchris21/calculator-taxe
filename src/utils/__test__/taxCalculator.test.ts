import { describe, expect, test } from "vitest";
import { calculateTaxes } from "../taxCalculator";

describe("calculateTaxes [UTIL]", () => {
  describe("CIM", () => {
    test.each`
      grossMonthlyIncome | privateContribution | CAS      | CASS     | incomeTax | netIncome
      ${495}             | ${true}             | ${1485}  | ${594}   | ${0}      | ${3861}
      ${10395}           | ${true}             | ${31185} | ${12474} | ${308}    | ${80773}
      ${495}             | ${false}            | ${1203}  | ${594}   | ${0}      | ${4143}
      ${10395}           | ${false}            | ${30710} | ${12474} | ${331}    | ${81225}
    `(
      "should calculate taxes correctly for monthly income $grossMonthlyIncome and privateContribution $privateContribution",
      ({
        grossMonthlyIncome,
        privateContribution,
        CAS,
        CASS,
        incomeTax,
        netIncome,
      }) => {
        const taxes = calculateTaxes({
          grossMonthlyIncome: grossMonthlyIncome,
          contractType: "CIM",
          privateContribution: privateContribution,
        });

        expect(taxes).toEqual({
          CAS: CAS,
          CASS: CASS,
          incomeTax: incomeTax,
          totalTaxes: CAS + CASS + incomeTax,
          netIncome: netIncome,
          srlTax: 0,
          dividendTax: 0,
          incomeBiggerThanNormLimit: false,
        });
      }
    );
  });

  describe("PFA - Real", () => {
    test.each`
      grossMonthlyIncome | CAS      | CASS     | incomeTax | netIncome
      ${1485}            | ${0}     | ${0}     | ${1782}   | ${16038}
      ${1980}            | ${0}     | ${2376}  | ${2138}   | ${19246}
      ${2970}            | ${0}     | ${3564}  | ${3208}   | ${28868}
      ${3465}            | ${9900}  | ${4158}  | ${2752}   | ${24770}
      ${6435}            | ${9900}  | ${7722}  | ${5960}   | ${53638}
      ${6930}            | ${19800} | ${8316}  | ${5504}   | ${49540}
      ${16335}           | ${19800} | ${19602} | ${15662}  | ${140956}
      ${16830}           | ${19800} | ${19800} | ${16236}  | ${146124}
    `(
      "should calculate taxes correctly for monthly income $grossMonthlyIncome",
      ({ grossMonthlyIncome, CAS, CASS, incomeTax, netIncome }) => {
        const taxes = calculateTaxes({
          grossMonthlyIncome: grossMonthlyIncome,
          contractType: "PFAReal",
          accountant: 0,
        });

        expect(taxes).toEqual({
          CAS: CAS,
          CASS: CASS,
          incomeTax: incomeTax,
          totalTaxes: CAS + CASS + incomeTax,
          netIncome: netIncome,
          srlTax: 0,
          dividendTax: 0,
          incomeBiggerThanNormLimit: false,
        });
      }
    );
  });

  describe("PFA - Norma", () => {
    test.each`
      grossMonthlyIncome | incomeNorm | CAS     | CASS    | incomeTax | netIncome | incomeBiggerThanNormLimit
      ${1485}            | ${40000}   | ${9900} | ${4000} | ${4000}   | ${-80}    | ${false}
      ${1980}            | ${40000}   | ${9900} | ${4000} | ${4000}   | ${5860}   | ${false}
      ${9900}            | ${40000}   | ${9900} | ${4000} | ${4000}   | ${100900} | ${false}
      ${10395}           | ${40000}   | ${9900} | ${4000} | ${4000}   | ${106840} | ${true}
    `(
      "should calculate taxes correctly for monthly income $grossMonthlyIncome and income norm of $incomeNorm",
      ({
        grossMonthlyIncome,
        incomeNorm,
        CAS,
        CASS,
        incomeTax,
        netIncome,
        incomeBiggerThanNormLimit,
      }) => {
        const taxes = calculateTaxes({
          grossMonthlyIncome: grossMonthlyIncome,
          contractType: "PFANorma",
          incomeNorm: incomeNorm,
        });

        expect(taxes).toEqual({
          CAS: CAS,
          CASS: CASS,
          incomeTax: incomeTax,
          totalTaxes: CAS + CASS + incomeTax,
          netIncome: netIncome,
          srlTax: 0,
          dividendTax: 0,
          incomeBiggerThanNormLimit: incomeBiggerThanNormLimit,
        });
      }
    );
  });

  describe("SRL - Profit", () => {
    test.each`
      grossMonthlyIncome | accountant | expenses | CASS    | srlTax   | dividendTax | netIncome
      ${495}             | ${4000}    | ${0}     | ${0}    | ${310}   | ${130}      | ${1500}
      ${1980}            | ${4000}    | ${0}     | ${0}    | ${3162}  | ${1328}     | ${15270}
      ${2475}            | ${4000}    | ${0}     | ${1980} | ${4112}  | ${1727}     | ${17881}
      ${4455}            | ${4000}    | ${0}     | ${1980} | ${7914}  | ${3324}     | ${36242}
      ${4950}            | ${4000}    | ${0}     | ${3960} | ${8864}  | ${3723}     | ${38853}
      ${8415}            | ${4000}    | ${0}     | ${3960} | ${15517} | ${6517}     | ${70986}
      ${8910}            | ${4000}    | ${0}     | ${7920} | ${16467} | ${6916}     | ${71617}
      ${8910}            | ${4000}    | ${0}     | ${7920} | ${16467} | ${6916}     | ${71617}
    `(
      "should calculate taxes correctly for monthly income $grossMonthlyIncome and expenses $expenses",
      ({
        grossMonthlyIncome,
        accountant,
        expenses,
        CASS,
        srlTax,
        dividendTax,
        netIncome,
      }) => {
        const taxes = calculateTaxes({
          grossMonthlyIncome: grossMonthlyIncome,
          contractType: "SRLProfit",
          expenses: expenses,
        });

        expect(taxes).toEqual({
          CAS: 0,
          CASS,
          incomeTax: 0,
          totalTaxes: CASS + srlTax + dividendTax + accountant,
          netIncome,
          srlTax: srlTax,
          dividendTax,
          incomeBiggerThanNormLimit: false,
        });
      }
    );
  });

  describe("SRL - Micro", () => {
    test.each`
      grossMonthlyIncome | caenCode  | accountant | expenses | CASS    | srlTax  | dividendTax | netIncome
      ${1485}            | ${"6201"} | ${4000}    | ${0}     | ${0}    | ${535}  | ${-2172}    | ${-98}
      ${1980}            | ${"6201"} | ${4000}    | ${0}     | ${0}    | ${713}  | ${-1711}    | ${5203}
      ${2970}            | ${"6201"} | ${4000}    | ${0}     | ${0}    | ${1069} | ${-789}     | ${15805}
      ${3465}            | ${"6201"} | ${4000}    | ${0}     | ${1980} | ${1247} | ${-328}     | ${19126}
      ${4950}            | ${"6201"} | ${4000}    | ${0}     | ${1980} | ${1782} | ${1054}     | ${35029}
      ${5445}            | ${"6201"} | ${4000}    | ${0}     | ${3960} | ${1960} | ${1515}     | ${38350}
      ${8415}            | ${"6201"} | ${4000}    | ${0}     | ${3960} | ${3029} | ${4281}     | ${70155}
      ${8910}            | ${"6201"} | ${4000}    | ${0}     | ${7920} | ${3208} | ${4742}     | ${71495}
    `(
      "should calculate taxes correctly for monthly income $grossMonthlyIncome and expenses $expenses",
      ({
        grossMonthlyIncome,
        accountant,
        expenses,
        CASS,
        srlTax,
        dividendTax,
        netIncome,
        caenCode,
      }) => {
        const taxes = calculateTaxes({
          grossMonthlyIncome: grossMonthlyIncome,
          contractType: "SRLMicro",
          expenses: expenses,
          caenCode,
        });

        expect(taxes).toEqual({
          CAS: 0,
          CASS: CASS,
          incomeTax: 0,
          totalTaxes: 15555 + CASS + srlTax + dividendTax + accountant,
          netIncome: netIncome,
          srlTax: srlTax,
          dividendTax: dividendTax,
          incomeBiggerThanNormLimit: false,
        });
      }
    );
  });
});
