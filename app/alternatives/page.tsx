'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Torsade } from '../../lib/db';

export default function AlternativesPage() {
  const [torsades, setTorsades] = useState<Torsade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/torsades').then(r => r.json()).then(d => { setTorsades(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const groups = torsades.reduce<Record<string, Torsade[]>>((acc, t) => {
    acc[t.num_torsade] = acc[t.num_torsade] || [];
    acc[t.num_torsade].push(t);
    return acc;
  }, {});

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Torsades & variantes</h2>
          <p>Vue par groupe de torsades et fils associés</p>
        </div>
        <Link href="/torsades" className="button-primary">Vue complète →</Link>
      </div>

      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : (
        <div className="grid-2">
          {Object.entries(groups).map(([key, rows]) => (
            <div key={key} className="card">
              <h3 style={{ margin: '0 0 12px' }}><span className="code-chip">{key}</span></h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {rows.map(t => (
                  <span key={t.id} className="label-chip">{t.num_fil}</span>
                ))}
              </div>
              <div style={{ marginTop: 12, color: '#82a3dc', fontSize: '0.85rem' }}>
                Section {rows[0].section} · Pas {rows[0].pas_de_torsade}mm · {rows[0].zone}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
