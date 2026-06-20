'use client';

import { useEffect, useState } from 'react';
import type { Torsade } from '../../lib/db';
import { rowMatches } from '../../lib/search';
import { EditableTable, type Column } from '../components/EditableTable';

const FAMILIES = ['Toutes', 'PASSENGER DOOR RHD', 'PASSENGER DOOR LHD'];

const COLUMNS: Column[] = [
  { key: 'num_torsade', label: 'Num Torsade', mono: true },
  { key: 'num_fil', label: 'Num Fil', mono: true },
  { key: 'famille', label: 'Famille' },
  { key: 'zone', label: 'Zone' },
  { key: 'lead_code_torsade', label: 'Lead Code Torsade' },
  { key: 'lead_code_fil', label: 'Lead Code Fil' },
  { key: 'couleur', label: 'Couleur' },
  { key: 'section', label: 'Section' },
  { key: 'bobine', label: 'Bobine', mono: true },
  { key: 'longueur_torsade', label: 'L. Torsade' },
  { key: 'longueur_initiale', label: 'L. Initiale' },
  { key: 'longueur_finale', label: 'L. Finale' },
  { key: 'longueur_libre_1', label: 'L. Libre 1' },
  { key: 'seal_1', label: 'Seal 1' },
  { key: 'terminal_1', label: 'Terminal 1', mono: true },
  { key: 'longueur_libre_2', label: 'L. Libre 2' },
  { key: 'seal_2', label: 'Seal 2' },
  { key: 'terminal_2', label: 'Terminal 2', mono: true },
  { key: 'pas_de_torsade', label: 'Pas (mm)' },
  { key: 'ksk_module', label: 'KSK Module', mono: true },
  { key: 'dpn_ksk_module', label: 'DPN KSK', mono: true },
];

export default function TorsadesPage() {
  const [torsades, setTorsades] = useState<Torsade[]>([]);
  const [loading, setLoading] = useState(true);
  const [famille, setFamille] = useState('Toutes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = famille !== 'Toutes' ? `?famille=${encodeURIComponent(famille)}` : '';
    fetch(`/api/torsades${params}`)
      .then(r => r.json())
      .then(d => { setTorsades(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [famille]);

  function updateLocal(id: number, key: string, value: string) {
    setTorsades(prev => prev.map(t => t.id === id ? { ...t, [key]: value } : t));
  }

  const uniqueTorsades = new Set(torsades.map(t => t.num_torsade)).size;

  const filtered = torsades.filter(t => rowMatches(t, search));

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Cutting Data</h2>
          <p>Fiches de préparation — {uniqueTorsades} torsades · {torsades.length} fils · cliquer une ligne pour modifier</p>
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
        <EditableTable
          rows={filtered}
          columns={COLUMNS}
          apiPath="/api/torsades"
          onChange={updateLocal}
          emptyLabel="Aucune torsade trouvée"
        />
      )}
    </main>
  );
}
