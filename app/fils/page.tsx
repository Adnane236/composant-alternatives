'use client';

import { useEffect, useState } from 'react';
import type { Fil } from '../../lib/db';
import { rowMatches } from '../../lib/search';
import { EditableTable, type Column } from '../components/EditableTable';

const FAMILIES = ['Toutes', 'PASSENGER DOOR RHD', 'PASSENGER DOOR LHD'];

const COLUMNS: Column[] = [
  { key: 'num_fil', label: 'Num Fil', mono: true },
  { key: 'famille', label: 'Famille' },
  { key: 'zone', label: 'Zone' },
  { key: 'num_drwn', label: 'Num Drwn', mono: true },
  { key: 'long', label: 'Long (mm)' },
  { key: 'cable', label: 'Cable', mono: true },
  { key: 'section_fil', label: 'Section' },
  { key: 'coml', label: 'Coml' },
  { key: 'type_isol', label: 'Type Isol' },
  { key: 'union_tors_a', label: 'Union Tors A' },
  { key: 'connect_a', label: 'Connect A' },
  { key: 'dpn_connect_a', label: 'DPN Connect A', mono: true },
  { key: 'acces', label: 'Accès' },
  { key: 'voie_a', label: 'Voie A' },
  { key: 'terminal_a', label: 'Terminal A', mono: true },
  { key: 'seal_a', label: 'Seal A' },
  { key: 'connect_b', label: 'Connect B' },
  { key: 'dpn_connect_b', label: 'DPN Connect B', mono: true },
  { key: 'voie_b', label: 'Voie B' },
  { key: 'terminal_b', label: 'Terminal B', mono: true },
  { key: 'seal_b', label: 'Seal B' },
  { key: 'options', label: 'Options' },
];

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

  function updateLocal(id: number, key: string, value: string) {
    setFils(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
  }

  const filtered = fils.filter(f => rowMatches(f, search));

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Wire Cutting Specs</h2>
          <p>Données de câblage — {fils.length} fils chargés · cliquer une ligne pour modifier</p>
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
        <EditableTable
          rows={filtered}
          columns={COLUMNS}
          apiPath="/api/fils"
          onChange={updateLocal}
          emptyLabel="Aucun fil trouvé"
        />
      )}
    </main>
  );
}
