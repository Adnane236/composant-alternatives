'use client';

import { useEffect, useState } from 'react';
import type { Splice } from '../../lib/db';
import { rowMatches } from '../../lib/search';
import { EditableTable, type Column } from '../components/EditableTable';

const FAMILIES = ['Toutes', 'PASSENGER DOOR RHD', 'PASSENGER DOOR LHD'];

const COLUMNS: Column[] = [
  { key: 'splice', label: 'Splice', mono: true },
  { key: 'famille', label: 'Famille' },
  { key: 'zone', label: 'Zone' },
  { key: 'us_location', label: 'US Location' },
  { key: 'groupe', label: 'Groupe' },
  { key: 'n_file', label: 'N° Fils' },
  { key: 'couleur', label: 'Couleur' },
  { key: 'section', label: 'Section' },
  { key: 'type_iso', label: 'Type Iso' },
  { key: 'long', label: 'Long (mm)' },
  { key: 'cout', label: 'Coût' },
  { key: 'to_item', label: 'To Item' },
  { key: 'to_cavity', label: 'To Cavity' },
  { key: 'union_torsade', label: 'Union Torsade' },
  { key: 'option', label: 'Option' },
];

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

  function updateLocal(id: number, key: string, value: string) {
    setSplices(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  }

  const filtered = splices.filter(s => rowMatches(s, search));

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>QC & Traceability</h2>
          <p>Points de jonction — {splices.length} splices chargés · cliquer une ligne pour modifier</p>
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
        <EditableTable
          rows={filtered}
          columns={COLUMNS}
          apiPath="/api/splices"
          onChange={updateLocal}
          emptyLabel="Aucun splice trouvé"
        />
      )}
    </main>
  );
}
