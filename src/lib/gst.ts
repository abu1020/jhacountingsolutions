/** Estimate GST; callers should treat the result as guidance, not tax advice. */
export function calculateGst(amount: number, rate: number, inclusive: boolean, supply: 'intra' | 'inter') {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const safeRate = Number.isFinite(rate) ? Math.max(0, rate) : 0;
  const base = inclusive ? safeAmount * 100 / (100 + safeRate) : safeAmount;
  const tax = inclusive ? safeAmount - base : base * safeRate / 100;
  return {
    base,
    cgst: supply === 'intra' ? tax / 2 : 0,
    sgst: supply === 'intra' ? tax / 2 : 0,
    igst: supply === 'inter' ? tax : 0,
    totalTax: tax,
    total: inclusive ? safeAmount : base + tax
  };
}
