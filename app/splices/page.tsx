'use client';

import { useEffect, useState } from 'react';
import type { Splice } from '../../lib/db';

const FAMILIES = ['Toutes', 'PASSENGER DOOR RHD', 'PASSENGER DOOR LHD'];

export default function SplicesPage() {
  const [splices, setSplices] = useState<Splice[]>([]);
  const [loading, setLoading] = useState(true);
  const [famille, setFamille] = useState('Toutes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = famille !== 'Toutes' ? `?famille=${encodeURIComponent(famille)}` : '';
    fetch(`/api/splices${params}`)
      .then(r => r.json())
      .then(d => { setSplices(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [famille]);

  const filtered = splices.filter(s =>
    !search || s.splice.toLowerCase().includes(search.toLowerCase()) ||
    s.n_file?.toLowerCase().includes(search.toLowerCase()) ||
    s.to_item?.toLowerCase().includes(search.toLowerCase()) ||
    s.option?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Splices</h2>
          <p>Points de jonction — {splices.length} splices chargés</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          {FAMILIES.map(f => (
            <button key={f} className={`filter-btn${famille === f ? ' active' : ''}`} onClick={() => setFamille(f)}>
              {f === 'Toutes' ? 'Toutes' : f.replace('PASSENGER DOOR ', '')}
            </button>
          ))}
        </div>
        <input className="search-input" placeholder="Rechercher splice, fil, to_item..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-state">Chargement des splices...</div>
      ) : (
        <section className="card table-wrapper">
          <table className="table table-dense">
            <thead>
              <tr>
                <th>Splice</th>
                <th>N° Fils</th>
                <th>Couleur</th>
                <th>Section</th>
                <th>Type Iso</th>
                <th>Long (mm)</th>
                <th>To Item</th>
                <th>To Cavity</th>
                <th>Union Torsade</th>
                <th>Option</th>
                <th>Famille</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><span className="code-chip">{s.splice}</span></td>
                  <td style={{ fontSize: '0.8rem', maxWidth: 180, wordBreak: 'break-word' }}>{s.n_file}</td>
                  <td>{s.couleur}</td>
                  <td className="num-cell">{s.section}</td>
                  <td>{s.type_iso}</td>
                  <td className="num-cell">{s.long || '—'}</td>
                  <td><span className="connect-chip">{s.to_item}</span></td>
                  <td className="num-cell">{s.to_cavity || '—'}</td>
                  <td>{s.union_torsade || '—'}</td>
                  <td>{s.option ? <span className={`option-badge opt-${s.option.toLowerCase().replace(/[^a-z]/g,'')}`}>{s.option}</span> : '—'}</td>
                  <td><span className="famille-badge">{s.famille.replace('PASSENGER DOOR ','')}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} style={{ textAlign:'center', color:'#82a3dc', padding:'32px' }}>Aucun splice trouvé</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
