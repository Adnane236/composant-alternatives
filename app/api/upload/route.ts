import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';
import { TABLE_COLUMNS } from '../../../lib/db';

const getConfig = () => {
  const { SQL_SERVER, SQL_DATABASE, SQL_USER, SQL_PASSWORD, SQL_PORT } = process.env;
  if (!SQL_SERVER || !SQL_DATABASE || !SQL_USER || !SQL_PASSWORD) return null;
  return {
    server: SQL_SERVER,
    database: SQL_DATABASE,
    authentication: { type: 'default' as const, options: { userName: SQL_USER, password: SQL_PASSWORD } },
    options: { encrypt: false, trustServerCertificate: true, port: Number(SQL_PORT || 1433), enableArithAbort: true },
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { table: string; rows: Record<string, unknown>[] };
    const { table, rows } = body;

    const allowed = TABLE_COLUMNS[table];
    if (!allowed) {
      return NextResponse.json({ error: `Table inconnue : ${table}` }, { status: 400 });
    }
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Aucune ligne à importer' }, { status: 400 });
    }

    // Filter only allowed columns present in the data
    const firstRow = rows[0];
    const cols = Object.keys(firstRow).filter(k => allowed.includes(k));
    if (cols.length === 0) {
      return NextResponse.json({ error: 'Aucune colonne reconnue. Vérifiez les en-têtes de votre fichier.' }, { status: 400 });
    }

    const config = getConfig();
    if (!config) {
      // Demo mode: just return success count
      return NextResponse.json({ inserted: rows.length, demo: true });
    }

    const pool = await sql.connect(config);
    let inserted = 0;

    for (const row of rows) {
      const filteredCols = cols.filter(c => row[c] !== undefined && row[c] !== null && row[c] !== '');
      if (filteredCols.length === 0) continue;

      const colList = filteredCols.map(c => `[${c}]`).join(', ');
      const paramList = filteredCols.map((_, i) => `@p${i}`).join(', ');
      const request = pool.request();
      filteredCols.forEach((c, i) => request.input(`p${i}`, String(row[c] ?? '')));

      await request.query(`INSERT INTO ${table} (${colList}) VALUES (${paramList})`);
      inserted++;
    }

    pool.close();
    return NextResponse.json({ inserted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
