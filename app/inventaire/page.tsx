'use client';

import { useEffect, useState } from 'react';
import type { OutilInventaire } from '../../lib/db';

const LOCATIONS = ['Toutes', 'Rack01-A', 'Rack01-B', 'Rack02-A', 'Rack02-B'];

export default function InventairePage() {
  const [outils, setOutils] = useState<OutilInventaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [localisation, setLocalisation] = useState('Toutes');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = localisation !== 'Toutes' ? `?localisation=${encodeURIComponent(localisation)}` : '';
    fetch(`/api/inventaire${params}`)
      .then(r => r.json())
      .then(d => { setOutils(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [localisation]);

  const filtered = outils.filter(o => {
    if (typeFilter !== 'Tous' && o.type_outil !== typeFilter) return false;
    if (search && !o.n_outil.toLowerCase().includes(search.toLowerCase()) &&
        !o.inventory_no?.toLowerCase().includes(search.toLowerCase()) &&
        !o.alphab?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const typeG = outils.filter(o => o.type_outil === 'G').length;
  const typeP = outils.filter(o => o.type_outil === 'P').length;

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Inventaire Outils</h2>
          <p>M6 Wk02-4 — Total: <strong style={{ color: '#f5c86b' }}>{outils.length}</strong> outils</p>
        </div>
      </div>

      <div className="status-strip">
        <div className="status-card">
          <strong>{outils.length}</strong>
          <span>Total outils</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#47d7ff' }}>{typeG}</strong>
          <span>Type G</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#ffa12f' }}>{typeP}</strong>
          <span>Type P</span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          {LOCATIONS.map(l => (
            <button key={l} className={`filter-btn${localisation === l ? ' active' : ''}`} onClick={() => setLocalisation(l)}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="search-input" style={{ width: 'auto' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="Tous">Tous types</option>
            <option value="G">Type G</option>
            <option value="P">Type P</option>
          </select>
          <input className="search-input" placeholder="N° outil, alphab, inventaire..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Chargement inventaire...</div>
      ) : (
        <section className="card table-wrapper">
          <table className="table table-dense">
            <thead>
              <tr>
                <th>Type</th>
                <th>N° Outil</th>
                <th>Alphab.</th>
                <th>Inventory No</th>
                <th>Localisation</th>
                <th>Terminal</th>
                <th>Type Corp</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: 8, fontWeight: 700, fontSize: '0.85rem',
                      background: o.type_outil === 'G' ? 'rgba(71,215,255,0.15)' : 'rgba(255,161,47,0.15)',
                      color: o.type_outil === 'G' ? '#47d7ff' : '#ffa12f',
                    }}>{o.type_outil}</span>
                  </td>
                  <td><span className="code-chip">{o.n_outil}</span></td>
                  <td style={{ color: '#f5c86b', fontWeight: 600 }}>{o.alphab}</td>
                  <td className="mono-sm">{o.inventory_no}</td>
                  <td>{o.localisation}</td>
                  <td className="mono-sm">{o.terminal || '—'}</td>
                  <td>{o.type_corp || '—'}</td>
                  <td style={{ color: '#82a3dc', fontSize: '0.85rem' }}>{o.commentaire || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#82a3dc', padding: '32px' }}>Aucun outil trouvé</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
