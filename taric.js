import { calculateCustoms, findSeedClassification } from './shared/calculator.js';

const json = (statusCode, body) => ({
statusCode,
headers: {
'content-type': 'application/json; charset=utf-8',
'access-control-allow-origin': '*',
'access-control-allow-methods': 'GET,POST,OPTIONS',
'access-control-allow-headers': 'content-type'
},
body: JSON.stringify(body, null, 2)
});

function parseBody(event) {
if (event.httpMethod === 'GET') {
const q = event.queryStringParameters || {};
return {
productName: q.productName || q.q || '',
description: q.description || '',
valueHuf: Number(q.valueHuf || 100000),
currencyRateHufPerEur: Number(q.rate || q.currencyRateHufPerEur || 400),
declarationLines: Number(q.lines || q.declarationLines || 1),
flow: q.flow || 'b2c',
vatScheme: q.vatScheme || 'ioss',
procedure: q.procedure || 'H7',
preferentialTreatment: q.preferentialTreatment === 'true'
};
}
return event.body ? JSON.parse(event.body) : {};
}

export async function handler(event) {
if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
if (!['GET', 'POST'].includes(event.httpMethod)) return json(405, { error: 'Method not allowed' });

try {
const input = parseBody(event);
if (!input.productName || !String(input.productName).trim()) {
return json(400, { error: 'productName kötelező' });
}
const classification = findSeedClassification(input.productName, input.description);
const result = calculateCustoms({ ...input, classification });
return json(200, {
ok: true,
input,
...result,
links: {
euTaric: result.classification.code
? `https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp?Lang=hu&Taric=${result.classification.code}`
: null,
navTaric: 'https://kkk.nav.gov.hu/eles/1/taricweb/'
}
});
} catch (error) {
return json(500, { error: error.message || 'Internal error' });
}
}
