import { calculateCustoms, findSeedClassification } from '../../shared/calculator.js';

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

const tools = [
  {
    name: 'classify_taric_product',
    description: 'TARIC/VTSZ seed-besorolás és vám/ÁFA kalkuláció magyar e-kereskedelmi import esetekre.',
    input_schema: {
      type: 'object',
      properties: {
        productName: { type: 'string' },
        description: { type: 'string' },
        valueHuf: { type: 'number' },
        currencyRateHufPerEur: { type: 'number' },
        declarationLines: { type: 'number' },
        flow: { type: 'string', enum: ['b2c', 'b2b'] },
        vatScheme: { type: 'string', enum: ['ioss', 'sa', 'normal'] },
        preferentialTreatment: { type: 'boolean' }
      },
      required: ['productName']
    }
  }
];

function toolResult(payload) {
  const classification = findSeedClassification(payload.productName, payload.description);
  return calculateCustoms({ ...payload, classification });
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod === 'GET') {
    return json(200, {
      name: 'TARIC Agent Netlify MCP facade',
      version: '0.1.0',
      tools,
      note: 'Ez MCP/App SDK irányú facade. Éles ChatGPT Apphoz az aktuális Apps SDK manifestet kell ráilleszteni.'
    });
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const toolName = body.name || body.tool || body.method;
    const args = body.arguments || body.args || body.input || body;
    if (toolName && toolName !== 'classify_taric_product') {
      return json(404, { error: `Unknown tool: ${toolName}` });
    }
    if (!args.productName) return json(400, { error: 'productName kötelező' });
    return json(200, { ok: true, tool: 'classify_taric_product', result: toolResult(args) });
  } catch (error) {
    return json(500, { error: error.message || 'Internal error' });
  }
}
