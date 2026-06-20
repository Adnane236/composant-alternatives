'use client';

import { useEffect, useState } from 'react';
import type { RMAlternative } from '../../lib/db';
import { rowMatches } from '../../lib/search';

async function saveRM(id: number, fields: Record<string, string>) {
  await fetch('/api/rm-alternatives', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...fields }),
  });
}

export default function RMAlternativeMaterielPage() {
  const [rows, setRows] = useState<RMAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/rm-alternatives')
      .then(r => r.json())
      .then(d => { setRows(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function updateLocal(id: number, field: string, value: string) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  const filtered = rows.filter(r => rowMatches(r as unknown as Record<string, unknown>, search));

  const serialYes = rows.filter(r => r.serial_or_ni?.toUpperCase() === 'YES').length;

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>RM Alternatives</h2>
          <p>PE Proposals — Engineering Change Requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="status-strip" style={{ marginBottom: 24 }}>
        <div className="status-card">
          <strong style={{ color: '#e5ecff' }}>{rows.length}</strong>
          <span>Total Proposals</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#47d7ff' }}>{filtered.length}</strong>
          <span>Résultats</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#4bc292' }}>{serialYes}</strong>
          <span>Serial</span>
        </div>
        <div className="status-card">
          <strong style={{ color: '#f5c86b' }}>{Array.from(new Set(rows.map(r => r.requestor).filter(Boolean))).length}</strong>
          <span>Requestors</span>
        </div>
      </div>

      {/* Search */}
      <div className="filter-bar" style={{ marginBottom: 16 }}>
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher material, APN, ME proposal, comment, drawing..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: 380 }}
        />
      </div>

      {loading && <div className="loading-state">Chargement...</div>}

      {!loading && rows.length === 0 && (
        <div className="loading-state">
          Aucune donnée. Importez votre fichier PE Proposal via <strong>Upload Data</strong> → <em>RM Alternatives</em>.
          <div style={{ marginTop: 12, fontSize: '0.82rem', color: '#82a3dc' }}>
            Colonnes attendues dans votre Excel :<br />
            <code style={{ fontSize: '0.78rem' }}>original_material, original_code, original_code2, me_proposal, apn, description, pe_code, ba, serial_or_ni, comment, afm_build, date_requested, drawing, requestor</code>
          </div>
        </div>
      )}

      {!loading && filtered.length === 0 && rows.length > 0 && (
        <div className="loading-state">Aucun résultat pour cette recherche.</div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(63,140,255,0.1)', borderBottom: '2px solid rgba(63,140,255,0.3)' }}>
                <th style={th}>Original APN</th>
                <th style={th}>Original Material</th>
                <th style={th}>Code</th>
                <th style={th}>ME Proposal</th>
                <th style={th}>PE APN</th>
                <th style={th}>Description PE</th>
                <th style={th}>Serial</th>
                <th style={th}>AFM Build</th>
                <th style={th}>Drawing</th>
                <th style={th}>Date</th>
                <th style={th}>Requestor</th>
                <th style={th}>Comment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <>
                  <tr
                    key={r.id}
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      cursor: 'pointer',
                      background: expanded === r.id ? 'rgba(63,140,255,0.07)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={td}>
                      <span style={{ fontFamily: 'monospace', color: '#f5c86b', fontSize: '0.8rem' }}>{r.original_apn || '—'}</span>
                    </td>
                    <td style={{ ...td, maxWidth: 200 }}>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {r.original_code && (
                          <span style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.08)', color: '#b8c5d6', flexShrink: 0 }}>
                            {r.original_code}{r.original_code2 ? `/${r.original_code2}` : ''}
                          </span>
                        )}
                        <span style={{ color: '#e5ecff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', fontSize: '0.78rem' }}>
                          {r.original_material || '—'}
                        </span>
                      </div>
                    </td>
                    <td style={td}>
                      {r.pe_code ? <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: 3, background: 'rgba(71,215,255,0.12)', color: '#47d7ff' }}>{r.pe_code}</span> : <span style={{ color: '#4a6080' }}>—</span>}
                    </td>
                    <td style={td}>
                      <span style={{ fontFamily: 'monospace', color: '#47d7ff', fontSize: '0.8rem', fontWeight: 600 }}>{r.me_proposal || '—'}</span>
                    </td>
                    <td style={td}>
                      <span style={{ fontFamily: 'monospace', color: '#82a3dc', fontSize: '0.8rem' }}>{r.apn || '—'}</span>
                    </td>
                    <td style={{ ...td, maxWidth: 220 }}>
                      <span style={{ color: '#b8c5d6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', fontSize: '0.78rem' }}>
                        {r.description || '—'}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      {r.serial_or_ni?.toUpperCase() === 'YES'
                        ? <span style={{ color: '#4bc292', fontWeight: 700 }}>YES</span>
                        : r.serial_or_ni
                          ? <span style={{ color: '#82a3dc' }}>{r.serial_or_ni}</span>
                          : '—'}
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: '0.78rem', color: '#82a3dc', fontFamily: 'monospace' }}>{r.afm_build || '—'}</span>
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: '0.78rem', color: '#a78bfa', fontFamily: 'monospace' }}>{r.drawing || '—'}</span>
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap', fontSize: '0.76rem', color: '#82a3dc' }}>
                      {r.date_requested || '—'}
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: '0.8rem', color: '#f472b6' }}>{r.requestor || '—'}</span>
                    </td>
                    <td style={{ ...td, maxWidth: 260 }}>
                      <span style={{ color: '#b8c5d6', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {r.comment || '—'}
                      </span>
                    </td>
                  </tr>

                  {/* Expanded edit panel */}
                  {expanded === r.id && (
                    <tr key={`${r.id}-exp`} style={{ background: 'rgba(63,140,255,0.04)' }}>
                      <td colSpan={12} style={{ padding: '20px 24px', borderBottom: '2px solid rgba(63,140,255,0.25)' }}
                          onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '0.75rem', color: '#3f8cff', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Modifier les champs — cliquer hors du champ pour sauvegarder
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                          <EditField label="Original APN" field="original_apn" value={r.original_apn} id={r.id} onChange={updateLocal} onSave={saveRM} mono />
                          <EditField label="Original Material (DESC)" field="original_material" value={r.original_material} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="Original Code 1" field="original_code" value={r.original_code} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="Original Code 2" field="original_code2" value={r.original_code2} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="ME Proposal" field="me_proposal" value={r.me_proposal} id={r.id} onChange={updateLocal} onSave={saveRM} mono />
                          <EditField label="APN" field="apn" value={r.apn} id={r.id} onChange={updateLocal} onSave={saveRM} mono />
                          <EditField label="Description" field="description" value={r.description} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="PE Code" field="pe_code" value={r.pe_code} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="BA" field="ba" value={r.ba} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="Serial or NI" field="serial_or_ni" value={r.serial_or_ni} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="AFM Build" field="afm_build" value={r.afm_build} id={r.id} onChange={updateLocal} onSave={saveRM} mono />
                          <EditField label="Drawing" field="drawing" value={r.drawing} id={r.id} onChange={updateLocal} onSave={saveRM} mono />
                          <EditField label="Date Requested" field="date_requested" value={r.date_requested} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="Requestor" field="requestor" value={r.requestor} id={r.id} onChange={updateLocal} onSave={saveRM} />
                          <EditField label="Comment" field="comment" value={r.comment} id={r.id} onChange={updateLocal} onSave={saveRM} wide />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

type EditFieldProps = {
  label: string;
  field: string;
  value: string;
  id: number;
  onChange: (id: number, field: string, value: string) => void;
  onSave: (id: number, fields: Record<string, string>) => void;
  mono?: boolean;
  wide?: boolean;
};

function EditField({ label, field, value, id, onChange, onSave, mono, wide }: EditFieldProps) {
  const [localVal, setLocalVal] = useState(value ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLocalVal(value ?? ''); }, [value]);

  function handleBlur() {
    if (localVal !== (value ?? '')) {
      onChange(id, field, localVal);
      onSave(id, { [field]: localVal });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  return (
    <div style={{ gridColumn: wide ? '1 / -1' : undefined }}>
      <div style={{ fontSize: '0.72rem', color: '#82a3dc', marginBottom: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
        {label}
        {saved && <span style={{ color: '#4bc292', fontSize: '0.68rem' }}>✓ sauvegardé</span>}
      </div>
      <input
        value={localVal}
        onChange={e => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        placeholder={`Entrer ${label.toLowerCase()}...`}
        style={{
          width: '100%',
          background: 'rgba(11,21,44,0.8)',
          border: `1px solid ${localVal !== (value ?? '') ? 'rgba(63,140,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 6,
          color: '#e5ecff',
          padding: '6px 10px',
          fontSize: '0.82rem',
          fontFamily: mono ? 'monospace' : undefined,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => (e.target.style.borderColor = 'rgba(63,140,255,0.6)')}
      />
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  color: '#82a3dc',
  fontWeight: 600,
  fontSize: '0.78rem',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '9px 12px',
  verticalAlign: 'middle',
};
