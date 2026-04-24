'use client';

import { useEffect, useState } from 'react';
import type { ProductionTracking } from '../../lib/db';

const FEUILLES = ['Toutes', 'MFA', 'JLRKSK', 'JLRBL55X', 'JLRBX540', 'JLRDOORServicekits'];
const STATUS_OPTIONS = ['On Time', 'Delay', 'Missing', 'Pending'];

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const color =
    value === 'On Time' ? '#4bc292'
    : value === 'Delay' ? '#f87171'
    : value === 'Missing' ? '#ffa12f'
    : '#93a7cb';

  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      style={{
        borderRadius: 999,
        padding: '3px 10px',
        fontSize: '0.82rem',
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
        cursor: 'pointer',
        outline: 'none',
        minWidth: 96,
      }}
    >
      <option value="">—</option>
      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function OkNok({ val }: { val: string }) {
  if (!val) return <span style={{ color: '#4a5568' }}>—</span>;
  if (val === 'OK') return <span style={{ color: '#4bc292', fontWeight: 700 }}>✓</span>;
  if (val === 'NOK') return <span style={{ color: '#f87171', fontWeight: 700 }}>✗</span>;
  return <span style={{ color: '#f5c86b', fontSize: '0.78rem' }}>{val}</span>;
}

function EditableCell({
  value,
  placeholder,
  onChange,
  width,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  width?: number;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(130,163,220,0.2)',
        borderRadius: 6,
        color: '#c3d4ee',
        fontSize: '0.8rem',
        padding: '3px 8px',
        width: width ?? 130,
        outline: 'none',
      }}
    />
  );
}

export default function ProductionPage() {
  const [rows, setRows] = useState<ProductionTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [feuille, setFeuille] = useState('Toutes');
  const [statusFilter, setStatusFilter] = useState('Toutes');
  const [search, setSearch] = useState('');

  // Local overrides (not persisted to DB — front-end only)
  const [statusOverrides, setStatusOverrides] = useState<Record<number, string>>({});
  const [responsables, setResponsables] = useState<Record<number, string>>({});
  const [commentaires, setCommentaires] = useState<Record<number, string>>({});

  useEffect(() => {
    setLoading(true);
    const params = feuille !== 'Toutes' ? `?feuille=${encodeURIComponent(feuille)}` : '';
    fetch(`/api/production${params}`)
      .then(r => r.json())
      .then(d => { setRows(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [feuille]);

  const getStatus = (r: ProductionTracking) => statusOverrides[r.id] ?? r.plant_status ?? '';
  const getComment = (r: ProductionTracking) => commentaires[r.id] ?? r.comment ?? '';

  const filtered = rows.filter(r => {
    const status = getStatus(r);
    if (statusFilter !== 'Toutes' && status !== statusFilter) return false;
    const comment = getComment(r);
    if (search && !r.jlr_pn?.toLowerCase().includes(search.toLowerCase()) &&
        !r.apn?.toLowerCase().includes(search.toLowerCase()) &&
        !r.famille?.toLowerCase().includes(search.toLowerCase()) &&
        !comment.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const onTime = rows.filter(r => getStatus(r) === 'On Time').length;
  const delay = rows.filter(r => getStatus(r) === 'Delay').length;
  const missing = rows.filter(r => getStatus(r) === 'Missing').length;
  const rate = rows.length ? Math.round((onTime / rows.length) * 100) : 0;

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Order Planning</h2>
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
          <strong style={{ color: '#ffa12f' }}>{missing}</strong>
          <span>Missing</span>
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
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
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
                <th>Statut</th>
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
                <th style={{ minWidth: 150 }}>Responsable</th>
                <th style={{ minWidth: 200 }}>Commentaire absence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const status = getStatus(r);
                const isDelay = status === 'Delay';
                const isMissing = status === 'Missing';
                return (
                  <tr
                    key={r.id}
                    style={
                      isMissing ? { background: 'rgba(255,161,47,0.05)' }
                      : isDelay ? { background: 'rgba(239,68,68,0.04)' }
                      : undefined
                    }
                  >
                    <td>{r.plant}</td>
                    <td>{r.oem}</td>
                    <td><span className="code-chip">{r.jlr_pn}</span></td>
                    <td className="mono-sm">{r.apn}</td>
                    <td style={{ maxWidth: 140, fontSize: '0.8rem' }}>{r.famille || '—'}</td>
                    <td className="mono-sm">{r.received_order_date?.slice(0,10)}</td>
                    <td className="num-cell">{r.s_lead_time}</td>
                    <td className="mono-sm">{r.needed_in_customer?.slice(0,10)}</td>
                    <td className="mono-sm">{r.plant_delivery_plan?.slice(0,10)}</td>
                    <td>
                      <StatusSelect
                        value={status}
                        onChange={v => setStatusOverrides(prev => ({ ...prev, [r.id]: v }))}
                      />
                    </td>
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
                    <td>
                      <EditableCell
                        value={responsables[r.id] ?? ''}
                        placeholder="Nom responsable..."
                        onChange={v => setResponsables(prev => ({ ...prev, [r.id]: v }))}
                        width={140}
                      />
                    </td>
                    <td>
                      <EditableCell
                        value={getComment(r)}
                        placeholder="Justifier l'absence du composant..."
                        onChange={v => setCommentaires(prev => ({ ...prev, [r.id]: v }))}
                        width={190}
                      />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={22} style={{ textAlign: 'center', color: '#82a3dc', padding: '32px' }}>Aucune commande trouvée</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
