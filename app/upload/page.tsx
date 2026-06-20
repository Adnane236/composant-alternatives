'use client';

import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

const TABLE_OPTIONS = [
  { value: 'ProductionTracking',   label: 'Order Planning (ProductionTracking)' },
  { value: 'Fils',                 label: 'Wire Cutting Specs (Fils)' },
  { value: 'Torsades',             label: 'Cutting Data (Torsades)' },
  { value: 'Splices',              label: 'QC & Traceability (Splices)' },
  { value: 'SpliceFils',           label: 'Splice Detail UCAB (SpliceFils)' },
  { value: 'Inventaire',           label: 'Crimping Dies (Inventaire)' },
  { value: 'Recap',                label: 'Récap Expéditions (Recap)' },
  { value: 'RMAlternativeMateriel',label: 'RM Alternatives' },
];

const TABLE_DB_COLUMNS: Record<string, string[]> = {
  ProductionTracking: [
    'feuille','plant','oem','jlr_pn','cpn','apn','famille','criticity_vor_bo',
    'received_order_date','s_lead_time','needed_in_customer','plant_delivery_plan',
    'plant_status','qty','shipped','net','comment','me_d','drawing','prg',
    'process_of','raw_material','wires','production','validation','packaging',
    'shipment','is_shipment_plan_ok',
  ],
  Fils: [
    'famille','zone','num_drwn','num_fil','long','cable','section_fil','coml',
    'type_isol','union_tors_a','connect_a','dpn_connect_a','acces','voie_a',
    'terminal_a','seal_a','connect_b','dpn_connect_b','voie_b','terminal_b',
    'seal_b','options',
  ],
  Torsades: [
    'famille','zone','num_torsade','lead_code_torsade','num_fil','lead_code_fil',
    'couleur','section','bobine','longueur_torsade','longueur_initiale',
    'longueur_finale','longueur_libre_1','seal_1','terminal_1','longueur_libre_2',
    'seal_2','terminal_2','pas_de_torsade','ksk_module','dpn_ksk_module',
  ],
  Splices: [
    'famille','zone','splice','us_location','groupe','n_file','couleur','section',
    'type_iso','long','cout','to_item','to_cavity','union_torsade','option',
  ],
  SpliceFils: [
    'famille','splice','us','num_wire','num_wire_coupe','color','size',
    'type_isol','cote','alpha_code','module','fna_code','dpn_isolot',
    'section_total','configuration_clip','heatshrink',
  ],
  Inventaire: [
    'type_outil','n_outil','alphab','inventory_no','localisation','terminal',
    'type_corp','commentaire',
  ],
  Recap: [
    'feuille','oem','jlr_pn','famille','original_build_date','customer_po',
    'bl_number','dn_number','shipment_date','qty_shipped','destination','notes',
  ],
  RMAlternativeMateriel: [
    'original_apn','original_material','original_code','original_code2','me_proposal','apn',
    'description','pe_code','ba','serial_or_ni','comment','afm_build',
    'date_requested','drawing','requestor',
  ],
};

// ALIASES checked BEFORE direct DB column match — allows overriding default mapping
const ALIASES: Record<string, string> = {
  // PE proposal: first APN = original part, second APN = PE APN
  apn:   'original_apn',       // first APN → original_apn
  apn_2: 'apn',               // second APN → pe apn
  // DESC: first = original wire spec, second = PE description
  desc:   'original_material',
  desc_2: 'description',
  // code appears 3 times: orig color1, orig color2, PE code
  code:   'original_code',
  code_2: 'original_code2',
  code_3: 'pe_code',
  // common name variants
  request:   'requestor',
  requestors: 'requestor',
  requester:  'requestor',
  serial:     'serial_or_ni',
  afm:        'afm_build',
  drwn:       'drawing',
  part_number: 'apn',
};

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function autoMap(excelHeaders: string[], dbColumns: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const dbNormMap = Object.fromEntries(dbColumns.map(c => [normalize(c), c]));
  const usedDbCols = new Set<string>();

  for (const h of excelHeaders) {
    const n = normalize(h);
    let matched = '';
    // ALIASES take priority over direct column name match
    if (ALIASES[n] && dbColumns.includes(ALIASES[n]) && !usedDbCols.has(ALIASES[n])) {
      matched = ALIASES[n];
    } else if (dbNormMap[n] && !usedDbCols.has(dbNormMap[n])) {
      matched = dbNormMap[n];
    }
    mapping[h] = matched;
    if (matched) usedDbCols.add(matched);
  }
  return mapping;
}

// Score a row as a header row: count cells that match known DB columns or aliases
function scoreHeaderRow(row: unknown[], dbColumns: string[]): number {
  const dbNormSet = new Set([...dbColumns.map(normalize), ...Object.keys(ALIASES)]);
  return (row as unknown[]).filter(cell => {
    if (!cell || String(cell).trim() === '') return false;
    return dbNormSet.has(normalize(String(cell)));
  }).length;
}

// Auto-detect best header row index (0-based) by scoring first 5 rows
function detectHeaderRow(rawRows: unknown[][], dbColumns: string[]): number {
  let best = 0, bestScore = -1;
  for (let i = 0; i < Math.min(5, rawRows.length); i++) {
    const score = scoreHeaderRow(rawRows[i] as unknown[], dbColumns);
    if (score > bestScore) { bestScore = score; best = i; }
  }
  return best;
}

// Build parsed sheet from raw 2D data with custom header row (0-based index)
function buildParsedSheet(name: string, rawRows: unknown[][], headerRowIdx: number) {
  if (rawRows.length <= headerRowIdx) return { name, rows: [], headers: [] };

  const rawHeader = (rawRows[headerRowIdx] as unknown[]).map(h =>
    h && String(h).trim() ? String(h).trim() : ''
  );

  // Deduplicate: "APN" → "APN", second "APN" → "APN_2", third → "APN_3"
  const seen: Record<string, number> = {};
  const headerRow = rawHeader.map((h, i) => {
    if (!h) return `__COL_${i}`;
    seen[h] = (seen[h] || 0) + 1;
    return seen[h] === 1 ? h : `${h}_${seen[h]}`;
  });

  const dataRows = rawRows.slice(headerRowIdx + 1);
  const rows: Record<string, unknown>[] = dataRows
    .filter(row => (row as unknown[]).some(cell => cell !== '' && cell !== null && cell !== undefined))
    .map(row => {
      const r = row as unknown[];
      const obj: Record<string, unknown> = {};
      headerRow.forEach((h, i) => { obj[h] = r[i] ?? ''; });
      return obj;
    });

  return { name, rows, headers: headerRow };
}

type RawSheet = { name: string; rawRows: unknown[][] };

type UploadState =
  | { phase: 'idle' }
  | { phase: 'parsed'; filename: string; type: 'excel'; rawSheets: RawSheet[] }
  | { phase: 'parsed'; filename: string; type: 'pptx'; size: number }
  | { phase: 'importing' }
  | { phase: 'done'; inserted: number; demo?: boolean }
  | { phase: 'error'; message: string };

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({ phase: 'idle' });
  const [dragOver, setDragOver] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [selectedTable, setSelectedTable] = useState('');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [headerRow, setHeaderRow] = useState(1); // 1-based for display

  // Compute parsed sheets from raw data
  const parsedSheets = state.phase === 'parsed' && state.type === 'excel'
    ? state.rawSheets.map(rs => buildParsedSheet(rs.name, rs.rawRows, headerRow - 1))
    : [];

  const currentSheet = parsedSheets[selectedSheet] ?? null;
  const visibleHeaders = currentSheet?.headers.filter(h => !h.startsWith('__COL_')) ?? [];
  const previewRows = currentSheet?.rows.slice(0, 5) ?? [];
  const dbCols = TABLE_DB_COLUMNS[selectedTable] ?? [];
  const mappedCount = visibleHeaders.filter(h => columnMapping[h]).length;
  const unmappedCount = visibleHeaders.filter(h => !columnMapping[h]).length;

  // When table changes: auto-detect best header row then recompute mapping
  useEffect(() => {
    if (state.phase !== 'parsed' || state.type !== 'excel') return;
    const rawSheet = state.rawSheets[selectedSheet];
    if (!rawSheet || !selectedTable) return;
    const dbCols = TABLE_DB_COLUMNS[selectedTable] ?? [];
    // Auto-detect best header row for this table
    const detected = detectHeaderRow(rawSheet.rawRows, dbCols);
    setHeaderRow(detected + 1); // convert to 1-based
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable, selectedSheet, state.phase]);

  // Recompute mapping when headers or table change
  useEffect(() => {
    if (!currentSheet || visibleHeaders.length === 0) return;
    setColumnMapping(autoMap(visibleHeaders, dbCols));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSheet, selectedTable, headerRow, state.phase]);

  function parseFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'pptx') {
      setState({ phase: 'parsed', filename: file.name, type: 'pptx', size: file.size });
      return;
    }

    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const wb = XLSX.read(data, { type: 'array', cellDates: true });
          const rawSheets: RawSheet[] = wb.SheetNames.map(name => {
            const rawRows = XLSX.utils.sheet_to_json<unknown[]>(
              wb.Sheets[name],
              { header: 1, defval: '' }
            );
            return { name, rawRows };
          });
          setState({ phase: 'parsed', filename: file.name, type: 'excel', rawSheets });
          setSelectedSheet(0);
          setHeaderRow(1);
        } catch {
          setState({ phase: 'error', message: 'Impossible de lire le fichier. Vérifiez le format.' });
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    setState({ phase: 'error', message: `Format non supporté : .${ext}. Utilisez .xlsx, .xls, .csv ou .pptx` });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  }

  async function handleImport() {
    if (!currentSheet || currentSheet.rows.length === 0 || !selectedTable) return;

    const mappedRows = currentSheet.rows.map(row => {
      const out: Record<string, unknown> = {};
      for (const [excelCol, dbCol] of Object.entries(columnMapping)) {
        if (dbCol && row[excelCol] !== undefined && row[excelCol] !== null && row[excelCol] !== '') {
          out[dbCol] = row[excelCol];
        }
      }
      return out;
    });

    setState({ phase: 'importing' });
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: selectedTable, rows: mappedRows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de l\'import');
      setState({ phase: 'done', inserted: json.inserted, demo: json.demo });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setState({ phase: 'error', message: msg });
    }
  }

  function reset() {
    setState({ phase: 'idle' });
    setColumnMapping({});
    setHeaderRow(1);
    if (inputRef.current) inputRef.current.value = '';
  }

  const rawSheetCount = state.phase === 'parsed' && state.type === 'excel' ? state.rawSheets.length : 0;
  const totalRawRows = state.phase === 'parsed' && state.type === 'excel'
    ? state.rawSheets.reduce((s, rs) => s + Math.max(0, rs.rawRows.length - headerRow), 0)
    : 0;

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Upload Data</h2>
          <p>Importer des fichiers Excel (.xlsx, .xls, .csv) ou PPTX vers la base de données</p>
        </div>
        {state.phase !== 'idle' && (
          <button className="button-secondary" onClick={reset} style={{ fontSize: '0.88rem' }}>
            ← Nouveau fichier
          </button>
        )}
      </div>

      {/* ── Drop zone ── */}
      {state.phase === 'idle' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#f5c86b' : 'rgba(130,163,220,0.3)'}`,
            borderRadius: 24,
            padding: '60px 40px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(245,200,107,0.05)' : 'rgba(11,21,44,0.6)',
            transition: 'all 0.2s',
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⬆</div>
          <div style={{ fontSize: '1.1rem', color: '#c3d4ee', fontWeight: 600, marginBottom: 8 }}>
            Glisser-déposer votre fichier ici
          </div>
          <div style={{ color: '#4a6080', fontSize: '0.88rem' }}>
            ou cliquer pour sélectionner · Formats acceptés : .xlsx, .xls, .csv, .pptx
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.pptx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* ── Error ── */}
      {state.phase === 'error' && (
        <div className="card" style={{ borderColor: 'rgba(248,113,113,0.35)', marginBottom: 24 }}>
          <div style={{ color: '#f87171', fontWeight: 600, marginBottom: 8 }}>Erreur</div>
          <p style={{ color: '#c3d4ee', margin: 0 }}>{state.message}</p>
          <button className="button-secondary" onClick={reset} style={{ marginTop: 16, fontSize: '0.88rem' }}>
            Réessayer
          </button>
        </div>
      )}

      {/* ── PPTX info ── */}
      {state.phase === 'parsed' && state.type === 'pptx' && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: 'rgba(244,114,182,0.15)',
              color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem',
            }}>📊</div>
            <div>
              <div style={{ fontWeight: 700, color: '#e5ecff', fontSize: '1rem' }}>{state.filename}</div>
              <div style={{ color: '#4a6080', fontSize: '0.82rem' }}>PowerPoint · {(state.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
          <div style={{ color: '#4bc292', fontWeight: 600 }}>✓ Fichier enregistré — {state.filename}</div>
        </div>
      )}

      {/* ── Excel parsed ── */}
      {state.phase === 'parsed' && state.type === 'excel' && (
        <>
          {/* File info + config */}
          <div className="card" style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: 'rgba(75,194,146,0.15)',
                color: '#4bc292', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}>📗</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#e5ecff', fontSize: '1rem' }}>
                  {state.filename}
                </div>
                <div style={{ color: '#4a6080', fontSize: '0.82rem' }}>
                  Excel · {rawSheetCount} feuille{rawSheetCount > 1 ? 's' : ''} · {totalRawRows} lignes de données
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {/* Sheet selector */}
              {rawSheetCount > 1 && (
                <div>
                  <label style={{ display: 'block', color: '#82a3dc', fontSize: '0.8rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Feuille Excel
                  </label>
                  <select
                    value={selectedSheet}
                    onChange={e => setSelectedSheet(Number(e.target.value))}
                    className="search-input"
                    style={{ width: '100%' }}
                  >
                    {state.rawSheets.map((s, i) => (
                      <option key={i} value={i}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Header row selector */}
              <div>
                <label style={{ display: 'block', color: '#82a3dc', fontSize: '0.8rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Ligne d'en-tête
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={headerRow}
                    onChange={e => setHeaderRow(Number(e.target.value))}
                    className="search-input"
                    style={{ width: '100%' }}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>Ligne {n}</option>
                    ))}
                  </select>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4a6080', marginTop: 4 }}>
                  Si votre fichier a plusieurs lignes de titre, choisissez celle qui contient les vrais noms de colonnes
                </div>
              </div>

              {/* Table target */}
              <div>
                <label style={{ display: 'block', color: '#82a3dc', fontSize: '0.8rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Table cible (base de données)
                </label>
                <select
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', borderColor: !selectedTable ? 'rgba(248,113,113,0.5)' : undefined }}
                >
                  <option value="">-- Choisir une table --</option>
                  {TABLE_OPTIONS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {!selectedTable && (
                  <div style={{ color: '#f87171', fontSize: '0.72rem', marginTop: 4 }}>
                    Obligatoire avant d'importer
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="status-strip" style={{ marginBottom: 18 }}>
            <div className="status-card">
              <strong style={{ color: '#4bc292' }}>{currentSheet?.rows.length ?? 0}</strong>
              <span>Lignes à importer</span>
            </div>
            <div className="status-card">
              <strong style={{ color: '#3f8cff' }}>{visibleHeaders.length}</strong>
              <span>Colonnes Excel</span>
            </div>
            <div className="status-card">
              <strong style={{ color: mappedCount > 0 ? '#4bc292' : '#f87171' }}>{mappedCount}</strong>
              <span>Colonnes mappées</span>
            </div>
            <div className="status-card">
              <strong style={{ color: unmappedCount > 0 ? '#f5c86b' : '#4bc292' }}>{unmappedCount}</strong>
              <span>Ignorées</span>
            </div>
          </div>

          {/* ── Column Mapping ── */}
          {visibleHeaders.length > 0 && selectedTable && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#e5ecff', marginBottom: 2 }}>Mapping des colonnes</div>
                  <div style={{ fontSize: '0.78rem', color: '#4a6080' }}>
                    Colonne Excel → colonne <strong style={{ color: '#82a3dc' }}>{selectedTable}</strong>
                  </div>
                </div>
                <button
                  className="button-secondary"
                  style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                  onClick={() => setColumnMapping(autoMap(visibleHeaders, dbCols))}
                >
                  Auto-détecter
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 10 }}>
                {visibleHeaders.map(h => {
                  const mapped = columnMapping[h] || '';
                  return (
                    <div key={h} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      background: mapped ? 'rgba(75,194,146,0.06)' : 'rgba(255,255,255,0.02)',
                      borderRadius: 8,
                      border: `1px solid ${mapped ? 'rgba(75,194,146,0.18)' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                      <span style={{
                        flex: 1,
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        color: '#b8c5d6',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }} title={h}>{h}</span>
                      <span style={{ color: mapped ? '#4bc292' : '#4a6080', fontSize: '0.9rem', flexShrink: 0 }}>
                        {mapped ? '→' : '·'}
                      </span>
                      <select
                        value={mapped}
                        onChange={e => setColumnMapping(prev => ({ ...prev, [h]: e.target.value }))}
                        style={{
                          background: 'rgba(11,21,44,0.8)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: 6,
                          color: mapped ? '#e5ecff' : '#4a6080',
                          fontSize: '0.78rem',
                          padding: '4px 6px',
                          width: 160,
                          flexShrink: 0,
                        }}
                      >
                        <option value="">-- ignorer --</option>
                        {dbCols.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {visibleHeaders.length > 0 && !selectedTable && (
            <div className="card" style={{ marginBottom: 18, borderColor: 'rgba(248,113,113,0.2)' }}>
              <div style={{ color: '#f87171', fontSize: '0.88rem' }}>
                Sélectionnez une table cible pour afficher le mapping des colonnes.
              </div>
            </div>
          )}

          {/* Preview table */}
          {previewRows.length > 0 && currentSheet && visibleHeaders.length > 0 && (
            <section className="card table-wrapper" style={{ marginBottom: 24 }}>
              <div style={{ color: '#82a3dc', fontSize: '0.82rem', marginBottom: 8 }}>
                Aperçu — {Math.min(5, currentSheet.rows.length)} premières lignes (en-tête ligne {headerRow})
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-dense">
                  <thead>
                    <tr>
                      {visibleHeaders.map(h => (
                        <th key={h} style={{ whiteSpace: 'nowrap', color: columnMapping[h] ? '#4bc292' : '#82a3dc', fontSize: '0.75rem' }}>
                          {h}
                          {columnMapping[h] && (
                            <div style={{ color: '#4a6080', fontWeight: 400, fontSize: '0.68rem' }}>→ {columnMapping[h]}</div>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr key={i}>
                        {visibleHeaders.map(h => (
                          <td key={h} style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                            {String(row[h] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Import button */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              className="button-primary"
              onClick={handleImport}
              disabled={mappedCount === 0 || !selectedTable}
              style={{ fontSize: '0.95rem', padding: '12px 28px', opacity: (mappedCount === 0 || !selectedTable) ? 0.45 : 1 }}
            >
              Importer {currentSheet?.rows.length ?? 0} lignes → {selectedTable || '???'}
            </button>
            <button className="button-secondary" onClick={reset} style={{ fontSize: '0.9rem' }}>
              Annuler
            </button>
            {mappedCount > 0 && (
              <span style={{ fontSize: '0.82rem', color: '#4bc292' }}>
                {mappedCount} colonne{mappedCount > 1 ? 's' : ''} mappée{mappedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </>
      )}

      {/* ── Importing ── */}
      {state.phase === 'importing' && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#82a3dc' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Import en cours...</div>
          <div style={{ fontSize: '0.85rem', marginTop: 8, color: '#4a6080' }}>Insertion des données dans la base</div>
        </div>
      )}

      {/* ── Done ── */}
      {state.phase === 'done' && (
        <div className="card" style={{ borderColor: 'rgba(75,194,146,0.35)', textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4bc292', marginBottom: 8 }}>Import réussi</div>
          <div style={{ color: '#c3d4ee', fontSize: '0.95rem', marginBottom: 4 }}>
            <strong style={{ color: '#f5c86b' }}>{state.inserted}</strong> ligne{state.inserted > 1 ? 's' : ''} insérée{state.inserted > 1 ? 's' : ''} dans la base
          </div>
          {state.demo && (
            <div style={{ color: '#82a3dc', fontSize: '0.82rem', marginTop: 4 }}>(Mode démo)</div>
          )}
          <button className="button-secondary" onClick={reset} style={{ marginTop: 24, fontSize: '0.9rem' }}>
            Importer un autre fichier
          </button>
        </div>
      )}

      {/* ── Formats info ── */}
      {state.phase === 'idle' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 8 }}>
          {[
            { icon: '📗', label: '.xlsx / .xls', desc: 'Excel — choix de la ligne d\'en-tête + mapping automatique', color: '#4bc292' },
            { icon: '📊', label: '.pptx', desc: 'PowerPoint — enregistre la référence documentaire', color: '#f472b6' },
            { icon: '📄', label: '.csv', desc: 'CSV — import direct avec mapping de colonnes', color: '#47d7ff' },
          ].map(f => (
            <div key={f.label} style={{
              background: 'rgba(11,21,44,0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}>
              <span style={{ fontSize: '1.6rem' }}>{f.icon}</span>
              <div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: f.color, marginBottom: 4 }}>{f.label}</div>
                <div style={{ color: '#82a3dc', fontSize: '0.82rem', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
