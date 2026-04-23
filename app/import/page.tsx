'use client';

import { FormEvent, useState } from 'react';
import type { Fil, Torsade, Splice } from '../../lib/db';

type SearchResult = { fils: Fil[]; torsades: Torsade[]; splices: Splice[] };

export default function ImportPage() {
  const [query, setQuery] = useState('CLN04A, CLN17MB, T2_CRB01A');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data: SearchResult = await response.json();
      setResult(data);
      if (!data.fils.length && !data.torsades.length && !data.splices.length) {
        setMessage('Aucun élément trouvé pour ces références.');
      }
    } catch {
      setMessage('Erreur lors de la recherche. Vérifiez la connexion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Recherche multi-références</h2>
          <p>Entrez les références de fils, torsades ou splices — séparés par virgule ou retour à la ligne.</p>
        </div>
      </div>

      <section className="panel import-card">
        <form onSubmit={handleSearch} className="import-card">
          <label htmlFor="query" style={{ color: '#82a3dc', fontSize: '0.9rem' }}>
            Références (num_fil, num_torsade, splice...)
          </label>
          <textarea
            id="query"
            className="textarea-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ex: CLN04A, CLN17MB, T2_CRB01A, 5BD136A/Y"
          />
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </form>
      </section>

      {message && (
        <p style={{ color: '#f87171', marginTop: 18 }}>{message}</p>
      )}

      {result && (
        <section style={{ marginTop: 24 }}>
          <div className="status-strip" style={{ marginBottom: 24 }}>
            <div className="status-card">
              <strong style={{ color: '#3f8cff' }}>{result.fils.length}</strong>
              <span>Fils trouvés</span>
            </div>
            <div className="status-card">
              <strong style={{ color: '#47d7ff' }}>{result.torsades.length}</strong>
              <span>Torsades</span>
            </div>
            <div className="status-card">
              <strong style={{ color: '#f5c86b' }}>{result.splices.length}</strong>
              <span>Splices</span>
            </div>
          </div>

          {result.fils.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ color: '#3f8cff', marginBottom: 12 }}>Fils ({result.fils.length})</h3>
              <section className="card table-wrapper">
                <table className="table table-dense">
                  <thead><tr>
                    <th>Num_Fil</th><th>Long</th><th>Section</th><th>Type Isol</th>
                    <th>Connect A</th><th>Terminal A</th><th>Connect B</th><th>Terminal B</th><th>Options</th><th>Zone</th>
                  </tr></thead>
                  <tbody>{result.fils.map(f => (
                    <tr key={f.id}>
                      <td><span className="code-chip">{f.num_fil}</span></td>
                      <td className="num-cell">{f.long}</td>
                      <td className="num-cell">{f.section_fil}</td>
                      <td>{f.type_isol}</td>
                      <td><span className="connect-chip">{f.connect_a}</span></td>
                      <td className="mono-sm">{f.terminal_a}</td>
                      <td><span className="connect-chip">{f.connect_b}</span></td>
                      <td className="mono-sm">{f.terminal_b}</td>
                      <td><span className="option-badge">{f.options}</span></td>
                      <td className="zone-cell">{f.zone}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </section>
            </div>
          )}

          {result.torsades.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ color: '#47d7ff', marginBottom: 12 }}>Torsades ({result.torsades.length})</h3>
              <section className="card table-wrapper">
                <table className="table table-dense">
                  <thead><tr>
                    <th>Num_Torsade</th><th>Num_Fil</th><th>Couleur</th><th>Section</th>
                    <th>L. Initiale</th><th>L. Finale</th><th>L. Torsade</th>
                    <th>Terminal 1</th><th>Terminal 2</th><th>Pas</th><th>KSK Module</th>
                  </tr></thead>
                  <tbody>{result.torsades.map(t => (
                    <tr key={t.id}>
                      <td><span className="code-chip">{t.num_torsade}</span></td>
                      <td><span className="code-chip">{t.num_fil}</span></td>
                      <td>{t.couleur}</td>
                      <td className="num-cell">{t.section}</td>
                      <td className="num-cell">{t.longueur_initiale}</td>
                      <td className="num-cell">{t.longueur_finale}</td>
                      <td className="num-cell highlight">{t.longueur_torsade}</td>
                      <td className="mono-sm">{t.terminal_1}</td>
                      <td className="mono-sm">{t.terminal_2}</td>
                      <td className="num-cell">{t.pas_de_torsade}</td>
                      <td className="mono-sm">{t.ksk_module}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </section>
            </div>
          )}

          {result.splices.length > 0 && (
            <div>
              <h3 style={{ color: '#f5c86b', marginBottom: 12 }}>Splices ({result.splices.length})</h3>
              <section className="card table-wrapper">
                <table className="table table-dense">
                  <thead><tr>
                    <th>Splice</th><th>Fils</th><th>Couleur</th><th>Section</th>
                    <th>Type Iso</th><th>To Item</th><th>Option</th><th>Famille</th>
                  </tr></thead>
                  <tbody>{result.splices.map(s => (
                    <tr key={s.id}>
                      <td><span className="code-chip">{s.splice}</span></td>
                      <td style={{ fontSize: '0.8rem' }}>{s.n_file}</td>
                      <td>{s.couleur}</td>
                      <td className="num-cell">{s.section}</td>
                      <td>{s.type_iso}</td>
                      <td><span className="connect-chip">{s.to_item}</span></td>
                      <td><span className="option-badge">{s.option}</span></td>
                      <td className="famille-badge">{s.famille?.replace('PASSENGER DOOR ','')}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </section>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
