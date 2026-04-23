'use client';

import { useEffect, useState } from 'react';
import type { ProductionTracking } from '../../lib/db';

const FEUILLES = ['Toutes', 'MFA', 'JLRKSK', 'JLRBL55X', 'JLRBX540', 'JLRDOORServicekits'];

function StatusBadge({ status }: { status: string }) {
  const style: React.CSSProperties =
    status === 'On Time' ? { background: 'rgba(75,194,146,0.2)', color: '#4bc292', border: '1px solid rgba(75,194,146,0.3)' }
    : status === 'Delay' ? { background: 'rgba(239,68,68,0.18)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }
    : { background: 'rgba(255,255,255,0.06)', color: '#93a7cb' };
  return <span style={{ borderRadius: 999, padding: '4px 10px', fontSize: '0.82rem', ...style }}>{status || '—'}</span>;
}

function OkNok({ val }: { val: string }) {
  if (!val) return <span style={{ color: '#4a5568' }}>—</span>;
  if (val === 'OK') return <span style={{ color: '#4bc292', fontWeight: 700 }}>✓</span>;
  if (val === 'NOK') return <span style={{ color: '#f87171', fontWeight: 700 }}>✗</span>;
  return <span style={{ color: '#f5c86b', fontSize: '0.78rem' }}>{val}</span>;
}

export default function ProductionPage() {
  const [rows, setRows] = useState<ProductionTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [feuille, setFeuille] = useState('Toutes');
  const [statusFilter, setStatusFilter] = useState('Toutes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = feuille !== 'Toutes' ? `?feuille=${encodeURIComponent(feuille)}` : '';
    fetch(`/api/production${params}`)
      .then(r => r.json())
      .then(d => { setRows(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [feuille]);

  const filtered = rows.filter(r => {
    if (statusFilter !== 'Toutes' && r.plant_status !== statusFilter) return false;
    if (search && !r.jlr_pn?.toLowerCase().includes(search.toLowerCase()) &&
        !r.apn?.toLowerCase().includes(search.toLowerCase()) &&
        !r.famille?.toLowerCase().includes(search.toLowerCase()) &&
        !r.comment?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const onTime = rows.filter(r => r.plant_status === 'On Time').length;
  const delay = rows.filter(r => r.plant_status === 'Delay').length;
  const rate = rows.length ? Math.round((onTime / rows.length) * 100) : 0;

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Suivi Production</h2>
          <p>Commandes et livraisons — {rows.length} lignes</p>
        </div>
      </div>

      <div className="status-strip">
        <div className="status-card">
          <strong style={{ color: '#4bc292' }}>{onTime}</strong>
          <span>On Time</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#f87171' }}>{delay}</strong>
          <span>Delay</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#f5c86b' }}>{rate}%</strong>
          <span>Delivery Rate</span>
        </div>
        <div className="status-card">
          <strong>{rows.length}</strong>
          <span>Total commandes</span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          {FEUILLES.map(f => (
            <button key={f} className={`filter-btn${feuille === f ? ' active' : ''}`} onClick={() => setFeuille(f)}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="search-input" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="Toutes">Tous statuts</option>
            <option value="On Time">On Time</option>
            <option value="Delay">Delay</option>
          </select>
          <input className="search-input" placeholder="JLR PN, famille, commentaire..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : (
        <section className="card table-wrapper">
          <table className="table table-dense">
            <thead>
              <tr>
                <th>Plant</th>
                <th>OEM</th>
                <th>JLR PN</th>
                <th>APN</th>
                <th>Famille</th>
                <th>Rec. Order</th>
                <th>Lead</th>
                <th>Needed</th>
                <th>Delivery Plan</th>
                <th>Status</th>
                <th>Qty</th>
                <th>Ship.</th>
                <th>Net</th>
                <th>ME D</th>
                <th>Draw.</th>
                <th>Wire</th>
                <th>Prod.</th>
                <th>Valid.</th>
                <th>Ship.</th>
                <th>Plan OK</th>
                <th>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={r.plant_status === 'Delay' ? { background: 'rgba(239,68,68,0.04)' } : undefined}>
                  <td>{r.plant}</td>
                  <td>{r.oem}</td>
                  <td><span className="code-chip">{r.jlr_pn}</span></td>
                  <td className="mono-sm">{r.apn}</td>
                  <td style={{ maxWidth: 140, fontSize: '0.8rem' }}>{r.famille || '—'}</td>
                  <td className="mono-sm">{r.received_order_date?.slice(0,10)}</td>
                  <td className="num-cell">{r.s_lead_time}</td>
                  <td className="mono-sm">{r.needed_in_customer?.slice(0,10)}</td>
                  <td className="mono-sm">{r.plant_delivery_plan?.slice(0,10)}</td>
                  <td><StatusBadge status={r.plant_status} /></td>
                  <td className="num-cell">{r.qty}</td>
                  <td className="num-cell">{r.shipped}</td>
                  <td className="num-cell" style={{ color: r.net < 0 ? '#f87171' : r.net > 0 ? '#4bc292' : undefined }}>{r.net}</td>
                  <td style={{ textAlign: 'center' }}><OkNok val={r.me_d} /></td>
                  <td style={{ textAlign: 'center' }}><OkNok val={r.drawing} /></td>
                  <td style={{ textAlign: 'center' }}><OkNok val={r.wires} /></td>
                  <td style={{ textAlign: 'center' }}><OkNok val={r.production} /></td>
                  <td style={{ textAlign: 'center' }}><OkNok val={r.validation} /></td>
                  <td style={{ textAlign: 'center' }}><OkNok val={r.shipment} /></td>
                  <td style={{ textAlign: 'center' }}><OkNok val={r.is_shipment_plan_ok} /></td>
                  <td style={{ fontSize: '0.78rem', color: '#93a7cb', maxWidth: 160 }}>{r.comment || '—'}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={21} style={{ textAlign: 'center', color: '#82a3dc', padding: '32px' }}>Aucune commande trouvée</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
