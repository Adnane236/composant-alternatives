import { NextRequest, NextResponse } from 'next/server';
import { insertRows } from '../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { table: string; rows: Record<string, unknown>[] };
    const { table, rows } = body;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Aucune ligne à importer' }, { status: 400 });
    }

    // insertRows validates `table` against the column whitelist (throws if unknown)
    // and returns null when no database is configured (demo mode).
    const inserted = await insertRows(table, rows);

    if (inserted === null) {
      return NextResponse.json({ inserted: rows.length, demo: true });
    }
    if (inserted === 0) {
      return NextResponse.json(
        { error: 'Aucune colonne reconnue. Vérifiez les en-têtes de votre fichier.' },
        { status: 400 },
      );
    }
    return NextResponse.json({ inserted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur';
    const status = msg.startsWith('Table inconnue') ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
