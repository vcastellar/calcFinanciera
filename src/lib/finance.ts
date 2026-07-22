export type Frequency = 1 | 2 | 4 | 12 | 365;

export interface CompoundInterestInput {
  initialCapital: number;
  periodicContribution: number;
  annualRate: number;
  years: number;
  contributionFrequency: Frequency;
  capitalizationFrequency: Frequency;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  interestEarned: number;
  yearlyRows: Array<{ year: number; balance: number; contributions: number; interest: number }>;
}

export interface LoanPaymentResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
  amortizedCapital: number;
}

export interface MortgageResult extends LoanPaymentResult {
  downPayment: number;
  estimatedCosts: number;
  financedPercentage: number;
  cashNeeded: number;
}

export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const assertNonNegative = (value: number, field: string) => {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${field} must be a non-negative number`);
};

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { initialCapital, periodicContribution, annualRate, years, contributionFrequency, capitalizationFrequency } = input;
  assertNonNegative(initialCapital, 'initialCapital');
  assertNonNegative(periodicContribution, 'periodicContribution');
  assertNonNegative(annualRate, 'annualRate');
  assertNonNegative(years, 'years');

  const periods = Math.round(years * capitalizationFrequency);
  const periodicRate = annualRate / 100 / capitalizationFrequency;
  const contributionEveryPeriods = Math.max(1, Math.round(capitalizationFrequency / contributionFrequency));
  let balance = initialCapital;
  let totalContributions = initialCapital;
  const yearlyRows: CompoundInterestResult['yearlyRows'] = [];

  for (let period = 1; period <= periods; period += 1) {
    if (period % contributionEveryPeriods === 0) {
      balance += periodicContribution;
      totalContributions += periodicContribution;
    }
    balance *= 1 + periodicRate;

    if (period % capitalizationFrequency === 0 || period === periods) {
      const year = Math.ceil(period / capitalizationFrequency);
      yearlyRows.push({
        year,
        balance: roundMoney(balance),
        contributions: roundMoney(totalContributions),
        interest: roundMoney(balance - totalContributions),
      });
    }
  }

  return {
    futureValue: roundMoney(balance),
    totalContributions: roundMoney(totalContributions),
    interestEarned: roundMoney(balance - totalContributions),
    yearlyRows,
  };
}

export function calculateLoanPayment(principal: number, annualRate: number, years: number): LoanPaymentResult {
  assertNonNegative(principal, 'principal');
  assertNonNegative(annualRate, 'annualRate');
  assertNonNegative(years, 'years');
  const months = Math.round(years * 12);
  if (months === 0) return { monthlyPayment: 0, totalPaid: 0, totalInterest: 0 };
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? principal / months
    : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
  const totalPaid = monthlyPayment * months;
  return {
    monthlyPayment: roundMoney(monthlyPayment),
    totalPaid: roundMoney(totalPaid),
    totalInterest: roundMoney(totalPaid - principal),
  };
}

export function buildAmortizationTable(principal: number, annualRate: number, years: number): AmortizationRow[] {
  const { monthlyPayment } = calculateLoanPayment(principal, annualRate, years);
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;
  let remaining = principal;
  let amortizedCapital = 0;

  return Array.from({ length: months }, (_, index) => {
    const month = index + 1;
    const interest = remaining * monthlyRate;
    const principalPayment = month === months ? remaining : Math.min(monthlyPayment - interest, remaining);
    remaining = Math.max(0, remaining - principalPayment);
    amortizedCapital += principalPayment;
    return {
      month,
      payment: roundMoney(principalPayment + interest),
      interest: roundMoney(interest),
      principal: roundMoney(principalPayment),
      remainingBalance: roundMoney(remaining),
      amortizedCapital: roundMoney(amortizedCapital),
    };
  });
}

export function calculateMortgage(homePrice: number, downPaymentPercent: number, annualRate: number, years: number, costPercent = 10): MortgageResult {
  assertNonNegative(homePrice, 'homePrice');
  assertNonNegative(downPaymentPercent, 'downPaymentPercent');
  assertNonNegative(costPercent, 'costPercent');
  const downPayment = homePrice * (downPaymentPercent / 100);
  const principal = Math.max(0, homePrice - downPayment);
  const loan = calculateLoanPayment(principal, annualRate, years);
  const estimatedCosts = homePrice * (costPercent / 100);
  return {
    ...loan,
    downPayment: roundMoney(downPayment),
    estimatedCosts: roundMoney(estimatedCosts),
    financedPercentage: roundMoney((principal / homePrice) * 100),
    cashNeeded: roundMoney(downPayment + estimatedCosts),
  };
}

export function calculateMonthlySavingsGoal(targetAmount: number, initialCapital: number, annualRate: number, years: number): number {
  assertNonNegative(targetAmount, 'targetAmount');
  assertNonNegative(initialCapital, 'initialCapital');
  assertNonNegative(annualRate, 'annualRate');
  assertNonNegative(years, 'years');
  const months = Math.round(years * 12);
  if (months === 0) return Math.max(0, roundMoney(targetAmount - initialCapital));
  const monthlyRate = annualRate / 100 / 12;
  const initialFutureValue = initialCapital * (1 + monthlyRate) ** months;
  if (initialFutureValue >= targetAmount) return 0;
  if (monthlyRate === 0) return roundMoney((targetAmount - initialCapital) / months);
  return roundMoney((targetAmount - initialFutureValue) * monthlyRate / ((1 + monthlyRate) ** months - 1));
}
