'use client';

import { Fragment, useEffect, useState } from 'react';

export type Column = { key: string; label: string; mono?: boolean };

type Row = { id: number } & Record<string, unknown>;

export function EditableTable({
  rows,
  columns,
  apiPath,
  onChange,
  emptyLabel = 'Aucune donnée',
}: {
  rows: Row[];
  columns: Column[];
  apiPath: string;
  onChange: (id: number, key: string, value: string) => void;
  emptyLabel?: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  async function save(id: number, key: string, value: string) {
    onChange(id, key, value);
    await fetch(apiPath, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [key]: value }),
    }).catch(() => {});
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid rgba(150,188,218,0.12)', borderRadius: 2, background: '#0a1018' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
        <thead>
          <tr style={{ background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(150,188,218,0.22)' }}>
            {columns.map(c => <th key={c.key} style={th}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const isOpen = expanded === r.id;
            return (
              <Fragment key={r.id}>
                <tr
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  style={{
                    borderBottom: '1px solid rgba(150,188,218,0.09)',
                    cursor: 'pointer',
                    background: isOpen ? 'rgba(90,209,230,0.06)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  {columns.map((c, ci) => {
                    const raw = r[c.key];
                    const val = raw === null || raw === undefined || raw === '' ? '' : String(raw);
                    return (
                      <td key={c.key} style={{ ...td, maxWidth: 200 }}>
                        <span style={{
                          color: ci === 0 ? '#5ad1e6' : '#a7b7c6',
                          fontWeight: ci === 0 ? 600 : 400,
                          fontSize: '0.78rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                        }}>
                          {val || <span style={{ color: '#485768' }}>—</span>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                {isOpen && (
                  <tr style={{ background: 'rgba(90,209,230,0.03)' }}>
                    <td colSpan={columns.length} style={{ padding: '20px 24px', borderBottom: '1px solid rgba(90,209,230,0.25)' }}
                        onClick={e => e.stopPropagation()}>
                      <div style={{ fontSize: '0.7rem', color: '#5ad1e6', fontWeight: 500, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        ◇ Modifier les champs — cliquer hors du champ pour sauvegarder
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                        {columns.map(c => (
                          <EditField
                            key={c.key}
                            label={c.label}
                            value={r[c.key] === null || r[c.key] === undefined ? '' : String(r[c.key])}
                            mono={c.mono}
                            onSave={v => save(r.id, c.key, v)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: '#6f8090', padding: '32px', fontFamily: "'IBM Plex Mono', ui-monospace, monospace", letterSpacing: '0.06em' }}>{emptyLabel}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function EditField({ label, value, mono, onSave }: { label: string; value: string; mono?: boolean; onSave: (v: string) => void }) {
  const [localVal, setLocalVal] = useState(value ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLocalVal(value ?? ''); }, [value]);

  function handleBlur() {
    if (localVal !== (value ?? '')) {
      onSave(localVal);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  const dirty = localVal !== (value ?? '');

  return (
    <div>
      <div style={{ fontSize: '0.68rem', color: '#6f8090', marginBottom: 4, display: 'flex', gap: 6, alignItems: 'center', fontFamily: "'IBM Plex Mono', ui-monospace, monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
        {saved && <span style={{ color: '#5bd6a0', fontSize: '0.66rem' }}>✓ sauvegardé</span>}
      </div>
      <input
        value={localVal}
        onChange={e => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        placeholder={`Entrer ${label.toLowerCase()}...`}
        style={{
          width: '100%',
          background: '#0a1018',
          border: `1px solid ${dirty ? '#5ad1e6' : 'rgba(150,188,218,0.12)'}`,
          borderRadius: 2,
          color: '#d8e3ee',
          padding: '7px 10px',
          fontSize: '0.8rem',
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '9px 12px',
  textAlign: 'left',
  color: '#6f8090',
  fontWeight: 500,
  fontSize: '0.66rem',
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '8px 12px',
  verticalAlign: 'middle',
};
