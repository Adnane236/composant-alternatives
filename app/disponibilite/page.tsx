'use client';

import { useEffect, useState } from 'react';
import type { Fil } from '../../lib/db';

export default function AvailabilityPage() {
  const [fils, setFils] = useState<Fil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fils').then(r => r.json()).then(d => { setFils(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const rhd = fils.filter(f => f.famille?.includes('RHD'));
  const lhd = fils.filter(f => f.famille?.includes('LHD'));

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Disponibilité des câblages</h2>
          <p>Vue consolidée des fils par famille et zone</p>
        </div>
      </div>

      <div className="status-strip">
        <div className="status-card"><strong style={{ color: '#3f8cff' }}>{fils.length}</strong><span>Total fils</span></div>
        <div className="status-card"><strong style={{ color: '#4bc292' }}>{rhd.length}</strong><span>RHD</span></div>
        <div className="status-card"><strong style={{ color: '#f5c86b' }}>{lhd.length}</strong><span>LHD</span></div>
      </div>

      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : (
        <section className="card table-wrapper">
          <table className="table table-dense">
            <thead><tr>
              <th>Num_Fil</th><th>Famille</th><th>Zone</th><th>Long (mm)</th>
              <th>Section</th><th>Type Isol</th><th>Connect A</th><th>Connect B</th><th>Options</th>
            </tr></thead>
            <tbody>{fils.map(f => (
              <tr key={f.id}>
                <td><span className="code-chip">{f.num_fil}</span></td>
                <td><span className="famille-badge">{f.famille?.replace('PASSENGER DOOR ','')}</span></td>
                <td className="zone-cell">{f.zone}</td>
                <td className="num-cell">{f.long}</td>
                <td className="num-cell">{f.section_fil}</td>
                <td>{f.type_isol}</td>
                <td><span className="connect-chip">{f.connect_a}</span></td>
                <td><span className="connect-chip">{f.connect_b}</span></td>
                <td><span className="option-badge">{f.options}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </section>
      )}
    </main>
  );
}
