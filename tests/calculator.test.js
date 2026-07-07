import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCustoms, findSeedClassification } from '../shared/calculator.js';

test('okosóra seed classification', () => {
  const c = findSeedClassification('Samsung Galaxy Watch4 SM-R875', 'LTE eSIM');
  assert.equal(c.code, '8517620000');
});

test('IOSS low value B2C with restrictions does not use flat duty', () => {
  const r = calculateCustoms({ productName: 'naposcsibe', valueHuf: 10000, currencyRateHufPerEur: 400, flow: 'b2c', vatScheme: 'ioss' });
  assert.equal(r.assumptions.canUseFlatDuty, false);
});

test('fallback low value B2C can use 3 EUR flat duty', () => {
  const r = calculateCustoms({ productName: 'ismeretlen műanyag termék', valueHuf: 10000, currencyRateHufPerEur: 400, flow: 'b2c', vatScheme: 'sa', declarationLines: 2 });
  assert.equal(r.assumptions.canUseFlatDuty, true);
  assert.equal(r.amounts.appliedDutyHuf, 2400);
});
