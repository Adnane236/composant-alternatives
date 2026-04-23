'use client';

import { useEffect, useState } from 'react';
import type { Fil } from '../../lib/db';

const FAMILIES = ['Toutes', 'PASSENGER DOOR RHD', 'PASSENGER DOOR LHD'];

export default function FilsPage() {
  const [fils, setFils] = useState<Fil[]>([]);
  const [loading, setLoading] = useState(true);
  const [famille, setFamille] = useState('Toutes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = famille !== 'Toutes' ? `?famille=${encodeURIComponent(famille)}` : '';
    fetch(`/api/fils${params}`)
      .then(r => r.json())
      .then(d => { setFils(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [famille]);

  const filtered = fils.filter(f =>
    !search || f.num_fil.toLowerCase().includes(search.toLowerCase()) ||
    f.connect_a?.toLowerCase().includes(search.toLowerCase()) ||
    f.connect_b?.toLowerCase().includes(search.toLowerCase()) ||
    f.options?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Fils simples</h2>
          <p>Données de câblage — {fils.length} fils chargés</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          {FAMILIES.map(f => (
            <button
              key={f}
              className={`filter-btn${famille === f ? ' active' : ''}`}
              onClick={() => setFamille(f)}
            >
              {f === 'Toutes' ? 'Toutes' : f.replace('PASSENGER DOOR ', '')}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="Rechercher num_fil, connecteur, option..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Chargement des fils...</div>
      ) : (
        <section className="card table-wrapper">
          <table className="table table-dense">
            <thead>
              <tr>
                <th>Num_Fil</th>
                <th>Long (mm)</th>
                <th>Section</th>
                <th>Type Isol</th>
                <th>Connect A</th>
                <th>Voie A</th>
                <th>Terminal A</th>
                <th>Connect B</th>
                <th>Voie B</th>
                <th>Terminal B</th>
                <th>Options</th>
                <th>Zone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td><span className="code-chip">{f.num_fil}</span></td>
                  <td className="num-cell">{f.long ?? '—'}</td>
                  <td className="num-cell">{f.section_fil ?? '—'}</td>
                  <td>{f.type_isol}</td>
                  <td><span className="connect-chip">{f.connect_a}</span></td>
                  <td className="num-cell">{f.voie_a}</td>
                  <td className="mono-sm">{f.terminal_a}</td>
                  <td><span className="connect-chip">{f.connect_b}</span></td>
                  <td className="num-cell">{f.voie_b}</td>
                  <td className="mono-sm">{f.terminal_b}</td>
                  <td>{f.options ? <span className={`option-badge opt-${f.options.toLowerCase().replace(/[^a-z]/g,'')}`}>{f.options}</span> : '—'}</td>
                  <td className="zone-cell">{f.zone}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={12} style={{ textAlign: 'center', color: '#82a3dc', padding: '32px' }}>Aucun fil trouvé</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
