import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const fmt = (n) => Number.isFinite(Number(n)) ? `${Math.round(Number(n)).toLocaleString('hu-HU')} Ft` : '—';

function App() {
const [form, setForm] = useState({
productName: 'Samsung Galaxy Watch4 SM-R875',
description: 'LTE/eSIM okosóra',
valueHuf: 100000,
currencyRateHufPerEur: 400,
declarationLines: 1,
flow: 'b2c',
vatScheme: 'ioss',
procedure: 'H7',
preferentialTreatment: false
});
const [result, setResult] = useState(null);
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const change = (key) => (event) => {
const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
setForm((prev) => ({ ...prev, [key]: value }));
};

async function submit(event) {
event.preventDefault();
setLoading(true);
setError('');
setResult(null);
try {
const response = await fetch('/api/taric', {
method: 'POST',
headers: { 'content-type': 'application/json' },
body: JSON.stringify({
...form,
valueHuf: Number(form.valueHuf),
currencyRateHufPerEur: Number(form.currencyRateHufPerEur),
declarationLines: Number(form.declarationLines)
})
});
const data = await response.json();
if (!response.ok) throw new Error(data.error || 'Hiba történt');
setResult(data);
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
}

return (
<main className="shell">
<header className="hero">
<p className="eyebrow">ChatGPT / Netlify TARIC Agent</p>
<h1>TARIC ügynök</h1>
<p>API-kulcs nélküli Netlify-eszközréteg ChatGPT App / MCP irányhoz. A jelenlegi besorolás seed-katalógust használ; a NAV/EU TARIC HTML parser következő modul.</p>
</header>

<section className="grid">
<form className="card" onSubmit={submit}>
<label>Terméknév<input value={form.productName} onChange={change('productName')} /></label>
<label>Leírás<textarea value={form.description} onChange={change('description')} /></label>
<div className="row">
<label>Vámérték Ft<input type="number" value={form.valueHuf} onChange={change('valueHuf')} /></label>
<label>EUR árfolyam<input type="number" value={form.currencyRateHufPerEur} onChange={change('currencyRateHufPerEur')} /></label>
</div>
<div className="row">
<label>Tételsor<input type="number" min="1" value={form.declarationLines} onChange={change('declarationLines')} /></label>
<label>Forgalom<select value={form.flow} onChange={change('flow')}><option value="b2c">B2C</option><option value="b2b">B2B</option></select></label>
</div>
<div className="row">
<label>ÁFA mód<select value={form.vatScheme} onChange={change('vatScheme')}><option value="ioss">IOSS</option><option value="sa">SA</option><option value="normal">Normál</option></select></label>
<label>Eljárás<select value={form.procedure} onChange={change('procedure')}><option value="H7">H7</option><option value="H1">H1</option></select></label>
</div>
<label className="check"><input type="checkbox" checked={form.preferentialTreatment} onChange={change('preferentialTreatment')} /> Preferenciális elbánás</label>
<button disabled={loading}>{loading ? 'Számítás…' : 'Besorolás és kalkuláció'}</button>
{error && <p className="error">{error}</p>}
</form>

<section className="card result">
{!result && <p className="muted">Futtatás után itt jelenik meg az eredmény.</p>}
{result && (
<>
<p className="badge">{result.classification.confidence}</p>
<h2>{result.classification.code || 'Nincs kód'}</h2>
<p>{result.classification.title}</p>
<dl>
<dt>Forrás</dt><dd>{result.classification.source}</dd>
<dt>Vám</dt><dd>{fmt(result.amounts.appliedDutyHuf)}</dd>
<dt>ÁFA</dt><dd>{fmt(result.amounts.vatHuf)}</dd>
<dt>Összes közteher</dt><dd>{fmt(result.amounts.totalPublicChargeHuf)}</dd>
<dt>3 EUR alkalmazható</dt><dd>{result.assumptions.canUseFlatDuty ? 'igen' : 'nem'}</dd>
</dl>
<h3>Intézkedések / kockázatok</h3>
<ul>{(result.classification.restrictions || []).map((item) => <li key={item}>{item}</li>)}</ul>
<h3>JSON</h3>
<pre>{JSON.stringify(result, null, 2)}</pre>
</>
)}
</section>
</section>
</main>
);
}

createRoot(document.getElementById('root')).render(<App />);
