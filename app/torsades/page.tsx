'use client';

import { useEffect, useState } from 'react';
import type { Torsade } from '../../lib/db';

const FAMILIES = ['Toutes', 'PASSENGER DOOR RHD', 'PASSENGER DOOR LHD'];

export default function TorsadesPage() {
  const [torsades, setTorsades] = useState<Torsade[]>([]);
  const [loading, setLoading] = useState(true);
  const [famille, setFamille] = useState('Toutes');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = famille !== 'Toutes' ? `?famille=${encodeURIComponent(famille)}` : '';
    fetch(`/api/torsades${params}`)
      .then(r => r.json())
      .then(d => { setTorsades(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [famille]);

  const groups = torsades.reduce<Record<string, Torsade[]>>((acc, t) => {
    acc[t.num_torsade] = acc[t.num_torsade] || [];
    acc[t.num_torsade].push(t);
    return acc;
  }, {});

  const filteredKeys = Object.keys(groups).filter(k =>
    !search || k.toLowerCase().includes(search.toLowerCase()) ||
    groups[k].some(t => t.num_fil.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Cutting Data</h2>
          <p>Fiches de préparation — {Object.keys(groups).length} torsades</p>
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
        <input className="search-input" placeholder="Rechercher num_torsade, num_fil..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="loading-state">Chargement des torsades...</div>
      ) : (
        <div className="torsade-grid">
          {filteredKeys.map(key => {
            const rows = groups[key];
            const isOpen = expanded === key;
            return (
              <div key={key} className={`torsade-card${isOpen ? ' open' : ''}`}>
                <button className="torsade-header" onClick={() => setExpanded(isOpen ? null : key)}>
                  <div className="torsade-title">
                    <span className="code-chip">{key}</span>
                    <span className="torsade-fils-count">{rows.length} fil{rows.length > 1 ? 's' : ''}</span>
                    <span className="zone-cell">{rows[0].zone}</span>
                  </div>
                  <div className="torsade-meta">
                    <span>Pas: <strong>{rows[0].pas_de_torsade} mm</strong></span>
                    <span>Section: <strong>{rows[0].section}</strong></span>
                    <span>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="torsade-body">
                    <table className="table table-dense">
                      <thead>
                        <tr>
                          <th>Num_Fil</th>
                          <th>Couleur</th>
                          <th>Bobine</th>
                          <th>L. Initiale</th>
                          <th>L. Finale</th>
                          <th>L. Libre 1</th>
                          <th>Seal 1</th>
                          <th>Terminal 1</th>
                          <th>L. Torsade</th>
                          <th>L. Libre 2</th>
                          <th>Seal 2</th>
                          <th>Terminal 2</th>
                          <th>KSK Module</th>
                          <th>DPN KSK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(t => (
                          <tr key={t.id}>
                            <td><span className="code-chip">{t.num_fil}</span></td>
                            <td><span className="color-badge" style={{ background: colorBg(t.couleur) }}>{t.couleur}</span></td>
                            <td className="mono-sm">{t.bobine}</td>
                            <td className="num-cell">{t.longueur_initiale}</td>
                            <td className="num-cell">{t.longueur_finale}</td>
                            <td className="num-cell">{t.longueur_libre_1}</td>
                            <td className="mono-sm">{t.seal_1 || '—'}</td>
                            <td className="mono-sm">{t.terminal_1}</td>
                            <td className="num-cell highlight">{t.longueur_torsade}</td>
                            <td className="num-cell">{t.longueur_libre_2}</td>
                            <td className="mono-sm">{t.seal_2 || '—'}</td>
                            <td className="mono-sm">{t.terminal_2}</td>
                            <td className="mono-sm">{t.ksk_module}</td>
                            <td className="mono-sm">{t.dpn_ksk_module}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
          {filteredKeys.length === 0 && (
            <div className="loading-state">Aucune torsade trouvée</div>
          )}
        </div>
      )}
    </main>
  );
}

function colorBg(color: string): string {
  const map: Record<string, string> = {
    BK: '#1a1a1a', WH: '#e0e0e0', RD: '#a00', GN: '#2a7a2a',
    BU: '#1a4a8a', YE: '#b8900a', GY: '#555', BN: '#5a3010',
    'BK-WH': '#444', 'GN-BU': '#1a5a5a', 'BN-GN': '#3a5a10',
    'YE-OG': '#8a5a10', 'VT-GY': '#5a2a7a', 'GN-VT': '#2a5a3a',
  };
  return map[color] || '#333';
}
