import { DEFAULTS, SEED_RULES } from './catalog.js';

export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function findSeedClassification(productName, description = '') {
  const haystack = normalizeText(`${productName} ${description}`);
  const hit = SEED_RULES.find((rule) => rule.match.some((m) => haystack.includes(normalizeText(m))));
  if (hit) return { ...hit, source: 'seed-catalog' };
  return {
    code: null,
    title: 'Nincs biztos seed-találat; TARIC/NAV lookup szükséges',
    hs6: null,
    dutyPct: null,
    vatPct: 27,
    restrictions: [],
    confidence: 'alacsony',
    source: 'fallback'
  };
}

export function calculateCustoms(input) {
  const params = { ...DEFAULTS, ...input };
  const valueHuf = Number(params.valueHuf || 0);
  const rate = Number(params.currencyRateHufPerEur || DEFAULTS.currencyRateHufPerEur);
  const lines = Math.max(1, Number.parseInt(params.declarationLines || 1, 10));
  const classification = input.classification || findSeedClassification(input.productName, input.description);
  const vatPct = Number(classification.vatPct ?? params.vatRatePct ?? DEFAULTS.vatRatePct);
  const dutyPct = Number(classification.dutyPct ?? 0);
  const lowValueLimitHuf = 150 * rate;
  const isLowValueB2C = params.flow === 'b2c' && valueHuf > 0 && valueHuf < lowValueLimitHuf;
  const hasRestrictions = Array.isArray(classification.restrictions) && classification.restrictions.length > 0;
  const canUseFlatDuty = isLowValueB2C && !hasRestrictions;
  const flatDutyHuf = 3 * lines * rate;
  const normalDutyHuf = valueHuf * dutyPct / 100;
  const dutyHuf = canUseFlatDuty
    ? (params.preferentialTreatment ? 0 : flatDutyHuf)
    : normalDutyHuf;
  const iossVatExempt = canUseFlatDuty && params.vatScheme === 'ioss';
  const vatBaseHuf = valueHuf + dutyHuf;
  const vatHuf = iossVatExempt ? 0 : vatBaseHuf * vatPct / 100;
  return {
    classification,
    assumptions: {
      rate,
      valueHuf,
      lowValueLimitHuf,
      lines,
      flow: params.flow,
      procedure: params.procedure,
      vatScheme: params.vatScheme,
      preferentialTreatment: Boolean(params.preferentialTreatment),
      isLowValueB2C,
      hasRestrictions,
      canUseFlatDuty,
      iossVatExempt
    },
    amounts: {
      normalDutyHuf: Math.round(normalDutyHuf),
      flatDutyHuf: Math.round(flatDutyHuf),
      appliedDutyHuf: Math.round(dutyHuf),
      vatHuf: Math.round(vatHuf),
      totalPublicChargeHuf: Math.round(dutyHuf + vatHuf)
    },
    notes: [
      'A seed-katalógus csak prototípus. Éles rendszerben NAV/EU TARIC HTML lookup szükséges.',
      'A 3 EUR átalányvám logika csak kisértékű B2C, 150 EUR alatti, korlátozásmentes esetre alkalmazható.',
      'A válasz nem eKTF és nem hivatalos NAV állásfoglalás.'
    ]
  };
}
