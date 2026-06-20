'use client';

import { useEffect, useState } from 'react';
import type { Recap } from '../../lib/db';
import { rowMatches } from '../../lib/search';

const FEUILLES = ['Toutes', 'MFA', 'JLRKSK', 'JLRBL55X', 'JLRBX540', 'JLRDOORServicekits'];

function EditableCell({
  value,
  placeholder,
  onChange,
  onBlur,
  width,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onBlur?: (v: string) => void;
  width?: number;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onBlur={e => onBlur?.(e.target.value)}
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

export default function RecapPage() {
  const [rows, setRows] = useState<Recap[]>([]);
  const [loading, setLoading] = useState(true);
  const [feuille, setFeuille] = useState('Toutes');
  const [search, setSearch] = useState('');

  const [blOverrides, setBlOverrides] = useState<Record<number, string>>({});
  const [dnOverrides, setDnOverrides] = useState<Record<number, string>>({});
  const [notesOverrides, setNotesOverrides] = useState<Record<number, string>>({});

  async function saveRecap(id: number, fields: { bl_number?: string; dn_number?: string; notes?: string }) {
    await fetch('/api/recap', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    }).catch(() => {});
  }

  useEffect(() => {
    setLoading(true);
    const params = feuille !== 'Toutes' ? `?feuille=${encodeURIComponent(feuille)}` : '';
    fetch(`/api/recap${params}`)
      .then(r => r.json())
      .then(d => { setRows(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [feuille]);

  const filtered = rows.filter(r => rowMatches(r, search, [
    blOverrides[r.id] ?? r.bl_number,
    dnOverrides[r.id] ?? r.dn_number,
    notesOverrides[r.id] ?? r.notes,
  ]));

  const totalQty = rows.reduce((sum, r) => sum + (r.qty_shipped ?? 0), 0);
  const byFeuille: Record<string, number> = {};
  for (const r of rows) byFeuille[r.feuille] = (byFeuille[r.feuille] ?? 0) + 1;
  const feuillesCount = Object.keys(byFeuille).length;

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Récapitulatif Expéditions</h2>
          <p>Historique BL / DN / Customer PO — {rows.length} expéditions</p>
        </div>
      </div>

      <div className="status-strip">
        <div className="status-card">
          <strong style={{ color: '#3f8cff' }}>{rows.length}</strong>
          <span>Expéditions</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#4bc292' }}>{totalQty}</strong>
          <span>Qté totale</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#f5c86b' }}>{feuillesCount}</strong>
          <span>Feuilles</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#ffa12f' }}>{filtered.length}</strong>
          <span>Affichées</span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          {FEUILLES.map(f => (
            <button
              key={f}
              className={`filter-btn${feuille === f ? ' active' : ''}`}
              onClick={() => setFeuille(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="JLR PN, OEM, Customer PO, BL, DN..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : (
        <section className="card table-wrapper">
          <table className="table table-dense">
            <thead>
              <tr>
                <th>Feuille</th>
                <th>OEM</th>
                <th>JLR PN</th>
                <th>Famille</th>
                <th>Date construction</th>
                <th>Customer PO</th>
                <th>BL</th>
                <th>DN</th>
                <th>Date expédition</th>
                <th>Qté</th>
                <th>Destination</th>
                <th style={{ minWidth: 200 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <span style={{
                      background: 'rgba(63,140,255,0.15)',
                      color: '#82a3dc',
                      borderRadius: 4,
                      padding: '2px 7px',
                      fontSize: '0.78rem',
                    }}>
                      {r.feuille}
                    </span>
                  </td>
                  <td>{r.oem || '—'}</td>
                  <td><span className="code-chip">{r.jlr_pn}</span></td>
                  <td style={{ maxWidth: 160, fontSize: '0.8rem' }}>{r.famille || '—'}</td>
                  <td className="mono-sm">{r.original_build_date?.slice(0, 10) || '—'}</td>
                  <td className="mono-sm">{r.customer_po || '—'}</td>
                  <td>
                    <EditableCell
                      value={blOverrides[r.id] ?? r.bl_number ?? ''}
                      placeholder="N° BL..."
                      onChange={v => setBlOverrides(prev => ({ ...prev, [r.id]: v }))}
                      onBlur={v => saveRecap(r.id, { bl_number: v })}
                      width={100}
                    />
                  </td>
                  <td>
                    <EditableCell
                      value={dnOverrides[r.id] ?? r.dn_number ?? ''}
                      placeholder="N° DN..."
                      onChange={v => setDnOverrides(prev => ({ ...prev, [r.id]: v }))}
                      onBlur={v => saveRecap(r.id, { dn_number: v })}
                      width={110}
                    />
                  </td>
                  <td className="mono-sm">{r.shipment_date?.slice(0, 10) || '—'}</td>
                  <td className="num-cell">{r.qty_shipped ?? '—'}</td>
                  <td>{r.destination || '—'}</td>
                  <td>
                    <EditableCell
                      value={notesOverrides[r.id] ?? r.notes ?? ''}
                      placeholder="Notes..."
                      onChange={v => setNotesOverrides(prev => ({ ...prev, [r.id]: v }))}
                      onBlur={v => saveRecap(r.id, { notes: v })}
                      width={190}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', color: '#82a3dc', padding: '32px' }}>
                    Aucune expédition trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
