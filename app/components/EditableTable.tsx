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
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ background: 'rgba(63,140,255,0.1)', borderBottom: '2px solid rgba(63,140,255,0.3)' }}>
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
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    background: isOpen ? 'rgba(63,140,255,0.07)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  {columns.map((c, ci) => {
                    const raw = r[c.key];
                    const val = raw === null || raw === undefined || raw === '' ? '' : String(raw);
                    return (
                      <td key={c.key} style={{ ...td, maxWidth: 200 }}>
                        <span style={{
                          color: ci === 0 ? '#e5ecff' : '#b8c5d6',
                          fontFamily: c.mono ? 'monospace' : undefined,
                          fontWeight: ci === 0 ? 600 : 400,
                          fontSize: c.mono ? '0.78rem' : undefined,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                        }}>
                          {val || <span style={{ color: '#4a6080' }}>—</span>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                {isOpen && (
                  <tr style={{ background: 'rgba(63,140,255,0.04)' }}>
                    <td colSpan={columns.length} style={{ padding: '20px 24px', borderBottom: '2px solid rgba(63,140,255,0.25)' }}
                        onClick={e => e.stopPropagation()}>
                      <div style={{ fontSize: '0.75rem', color: '#3f8cff', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Modifier les champs — cliquer hors du champ pour sauvegarder
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
            <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: '#82a3dc', padding: '32px' }}>{emptyLabel}</td></tr>
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
          border: `1px solid ${dirty ? 'rgba(63,140,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 6,
          color: '#e5ecff',
          padding: '6px 10px',
          fontSize: '0.82rem',
          fontFamily: mono ? 'monospace' : undefined,
          outline: 'none',
          boxSizing: 'border-box',
        }}
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
