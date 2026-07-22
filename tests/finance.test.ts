import { describe, expect, it } from 'vitest';
import { buildAmortizationTable, calculateLoanPayment, calculateMonthlySavingsGoal } from '../src/lib/finance';

describe('financial formulas', () => {
  it('calculates a standard loan payment', () => {
    expect(calculateLoanPayment(20000, 6, 5)).toEqual({ monthlyPayment: 386.66, totalPaid: 23199.36, totalInterest: 3199.36 });
  });

  it('amortizes the loan to zero balance', () => {
    const rows = buildAmortizationTable(20000, 6, 5);
    expect(rows).toHaveLength(60);
    expect(rows.at(-1)?.remainingBalance).toBe(0);
  });

  it('calculates monthly savings needed for a goal', () => {
    expect(calculateMonthlySavingsGoal(30000, 2000, 3, 5)).toBe(434.89);
  });
});
