export type CalculateTaxesTypes = {
  grossMonthlyIncome: number;
  contractType: "CIM" | "PFAReal" | "PFANorma" | "SRLMicro" | "SRLProfit";
  expenses?: number;
  accountant?: number;
  incomeNorm?: number;
  privateContribution?: boolean;
  caenCode?: string;
};

export type TaxBreakdownT = {
  CAS: number;
  CASS: number;
  incomeTax: number;
  srlTax: number;
  dividendTax: number;
  totalTaxes: number;
  netIncome: number;
  incomeBiggerThanNormLimit: boolean;
};

const getPFARealCASAmount = (income: number, minimumWage: number): number => {
  switch (true) {
    default:
    case income < minimumWage * 12:
      return 0;

    case income > minimumWage * 12 && income < minimumWage * 24:
      return 39600;

    case income > minimumWage * 24:
      return 79200;
  }
};

const getPFARealCASSAmount = (income: number, minimumWage: number): number => {
  switch (true) {
    default:
    case income < minimumWage * 6:
      return 0;

    case income > minimumWage * 6 && income < minimumWage * 60:
      return income;

    case income > minimumWage * 60:
      return 198000;
  }
};

const getPFANormaCASAmount = (income: number, minimumWage: number): number => {
  switch (true) {
    default:
    case income < minimumWage * 6:
      return 0;

    case income > minimumWage * 6 && income < minimumWage * 12:
      return 19800;

    case income > minimumWage * 12 && income < minimumWage * 24:
      return 39600;

    case income > minimumWage * 24:
      return 79200;
  }
};

const getPFANormaCASSAmount = (income: number, minimumWage: number) => {
  switch (true) {
    default:
    case income < minimumWage * 6:
      return 0;

    case income > minimumWage * 6 && income < minimumWage * 60:
      return income;

    case income > minimumWage * 60:
      return 198000;
  }
};

const getSRLAdminCASSAmount = (income: number, minimumWage: number) => {
  switch (true) {
    default:
    case income < minimumWage * 6:
      return 0;

    case income > minimumWage * 6 && income < minimumWage * 12:
      return 19800;

    case income > minimumWage * 12 && income < minimumWage * 24:
      return 39600;

    case income > minimumWage * 24:
      return 79200;
  }
};

const getSRLMicroTaxRate = (income: number, caenCode: string) => {
  const threePercentTaxRateCaenCodes = [
    "5510",
    "5520",
    "5530",
    "5590",
    "5610",
    "5621",
    "5629",
    "5630",
    "5821",
    "5829",
    "6201",
    "6209",
    "6910",
    "8621",
    "8622",
    "8623",
    "8690",
  ];

  if (threePercentTaxRateCaenCodes.includes(caenCode) || income > 300000) {
    return 0.03;
  }

  return 0.01;
};

export const calculateTaxes = ({
  grossMonthlyIncome,
  contractType,
  expenses = 0,
  accountant = 4000,
  incomeNorm = 0,
  privateContribution = true,
  caenCode = "",
}: CalculateTaxesTypes): TaxBreakdownT => {
  // Tax rates
  const casContribution = !privateContribution ? 0.2025 : 0.25;
  const cassContribution = 0.1;
  const dividendContribution = 0.08;
  const incomeTaxContribution = 0.1;
  const privatePensionContribution = 0.0475;
  const profitContribution = 0.16;

  // Common constants
  const monthsInYear = 12;

  // Common amounts
  const grossAnnualIncome = grossMonthlyIncome * monthsInYear;
  const minWage = 3300;
  const incomeTaxThreshold = 10000;
  const maximumNorm = 123750;
  const minWageTax = 15555;

  let CAS = 0,
    CASS = 0,
    incomeTax = 0,
    srlTax = 0,
    dividendTax = 0,
    totalTaxes = 0,
    netIncome = 0,
    incomeBiggerThanNormLimit = false;

  switch (contractType) {
    case "CIM":
      CAS =
        grossAnnualIncome * casContribution +
        (privateContribution
          ? 0
          : Math.max(grossAnnualIncome - incomeTaxThreshold, 0) *
            privatePensionContribution);
      CASS = grossAnnualIncome * cassContribution;
      incomeTax =
        Math.max(
          (grossAnnualIncome - incomeTaxThreshold * monthsInYear) *
            (1 - casContribution - cassContribution),
          0
        ) * incomeTaxContribution;

      totalTaxes = CAS + CASS + incomeTax;
      netIncome = grossAnnualIncome - totalTaxes;
      break;

    case "PFAReal":
      const netIncomeReal = grossAnnualIncome - expenses - accountant;
      CAS = getPFARealCASAmount(netIncomeReal, minWage) * casContribution;
      CASS = getPFARealCASSAmount(netIncomeReal, minWage) * cassContribution;
      incomeTax = (netIncomeReal - CAS - CASS) * incomeTaxContribution;
      totalTaxes = CAS + CASS + incomeTax + accountant;
      netIncome = netIncomeReal - totalTaxes;
      break;

    case "PFANorma":
      if (grossAnnualIncome > maximumNorm) {
        incomeBiggerThanNormLimit = true;
      }
      CAS = getPFANormaCASAmount(incomeNorm, minWage) * casContribution;
      CASS = getPFANormaCASSAmount(incomeNorm, minWage) * cassContribution;
      incomeTax = incomeNorm * incomeTaxContribution;
      totalTaxes = CAS + CASS + incomeTax;
      netIncome = grossAnnualIncome - totalTaxes;
      break;

    case "SRLMicro":
      srlTax = Math.round(
        grossAnnualIncome * getSRLMicroTaxRate(grossAnnualIncome, caenCode)
      );
      dividendTax = Math.round(
        (grossAnnualIncome - accountant - expenses - (39600 + 837) - srlTax) *
          dividendContribution
      );
      const adminIncomeMicro = Math.round(
        grossAnnualIncome - accountant - minWageTax - srlTax - dividendTax
      );
      CASS =
        getSRLAdminCASSAmount(adminIncomeMicro, minWage) * cassContribution;
      totalTaxes = minWageTax + accountant + srlTax + dividendTax + CASS;
      netIncome = grossAnnualIncome - totalTaxes;
      break;

    case "SRLProfit":
      srlTax = Math.round(
        (grossAnnualIncome - expenses - accountant) * profitContribution
      );
      dividendTax = Math.round(
        (grossAnnualIncome - expenses - accountant - srlTax) *
          dividendContribution
      );
      const adminIncome = Math.round(
        grossAnnualIncome - accountant - srlTax - dividendTax
      );
      CASS = getSRLAdminCASSAmount(adminIncome, minWage) * cassContribution;
      totalTaxes = srlTax + dividendTax + CASS + accountant;
      netIncome = grossAnnualIncome - totalTaxes;
      break;

    default:
      console.error("Unknown contract type");
  }

  return {
    CAS: Math.round(CAS),
    CASS: Math.round(CASS),
    incomeTax: Math.round(incomeTax),
    srlTax: Math.round(srlTax),
    dividendTax: Math.round(dividendTax),
    totalTaxes: Math.round(totalTaxes),
    netIncome: Math.round(netIncome),
    incomeBiggerThanNormLimit,
  };
};
