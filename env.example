export const DEFAULTS = {
  currencyRateHufPerEur: 400,
  vatRatePct: 27,
  declarationLines: 1,
  procedure: 'H7',
  vatScheme: 'ioss',
  flow: 'b2c',
  preferentialTreatment: false
};

// Minimal seed catalogue. This is intentionally small: live TARIC/NAV lookup is the next module.
export const SEED_RULES = [
  {
    match: ['naposcsibe', 'csibe', 'házi tyúk', 'kakas', 'tyúk'],
    code: '0105111100',
    title: 'Élő házityúk, legfeljebb 185 g, tenyésztésre',
    hs6: '010511',
    dutyPct: 0,
    vatPct: 27,
    restrictions: ['állategészségügyi okmányok', 'TRACES', 'állatorvosi ellenőrzés'],
    confidence: 'kozepes'
  },
  {
    match: ['szamáröszvér', 'öszvér', 'lóöszvér'],
    code: '0101900000',
    title: 'Élő lóféle, más',
    hs6: '010190',
    dutyPct: 11.5,
    vatPct: 27,
    restrictions: ['állategészségügyi okmányok', 'TRACES', 'állatorvosi ellenőrzés'],
    confidence: 'kozepes'
  },
  {
    match: ['okosóra', 'smartwatch', 'galaxy watch', 'watch4', 'sm-r875', 'sm-r870'],
    code: '8517620000',
    title: 'Készülékek adatok vételére, átalakítására és továbbítására',
    hs6: '851762',
    dutyPct: 0,
    vatPct: 27,
    restrictions: ['CE megfelelőség', 'rádióberendezés dokumentáció'],
    confidence: 'kozepes'
  },
  {
    match: ['kristálycukor', 'cukor', 'répacukor'],
    code: '1701991000',
    title: 'Fehér cukor, szilárd állapotban',
    hs6: '170199',
    dutyPct: 33.9,
    vatPct: 27,
    restrictions: ['mezőgazdasági intézkedések ellenőrizendők'],
    confidence: 'alacsony'
  }
];
