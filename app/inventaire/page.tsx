'use client';

import { useEffect, useState } from 'react';
import type { OutilInventaire } from '../../lib/db';
import { rowMatches } from '../../lib/search';
import { EditableTable, type Column } from '../components/EditableTable';

const LOCATIONS = ['Toutes', 'Rack01-A', 'Rack01-B', 'Rack02-A', 'Rack02-B'];

const COLUMNS: Column[] = [
  { key: 'inventory_no', label: 'Inventory No', mono: true },
  { key: 'type_outil', label: 'Type' },
  { key: 'n_outil', label: 'N° Outil', mono: true },
  { key: 'alphab', label: 'Alphab.' },
  { key: 'localisation', label: 'Localisation' },
  { key: 'terminal', label: 'Terminal', mono: true },
  { key: 'type_corp', label: 'Type Corp' },
  { key: 'commentaire', label: 'Commentaire' },
];

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

  function updateLocal(id: number, key: string, value: string) {
    setOutils(prev => prev.map(o => o.id === id ? { ...o, [key]: value } : o));
  }

  const filtered = outils.filter(o => {
    if (typeFilter !== 'Tous' && o.type_outil !== typeFilter) return false;
    return rowMatches(o, search);
  });

  const typeG = outils.filter(o => o.type_outil === 'G').length;
  const typeP = outils.filter(o => o.type_outil === 'P').length;

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Crimping Dies &amp; Alternatives</h2>
          <p>M6 Wk02-4 — Total: <strong style={{ color: '#f5c86b' }}>{outils.length}</strong> outils · cliquer une ligne pour modifier</p>
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
        <EditableTable
          rows={filtered}
          columns={COLUMNS}
          apiPath="/api/inventaire"
          onChange={updateLocal}
          emptyLabel="Aucun outil trouvé"
        />
      )}
    </main>
  );
}
