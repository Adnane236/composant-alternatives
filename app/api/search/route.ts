import { NextResponse } from 'next/server';
import { searchAll } from '../../../lib/db';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = String(body.query ?? '').trim();
  if (!query) return NextResponse.json({ fils: [], torsades: [], splices: [] });

  const terms = query.split(/[,;\n\r]+/).map(s => s.trim()).filter(Boolean);
  const results = await Promise.all(terms.map(term => searchAll(term)));

  return NextResponse.json({
    fils: results.flatMap(r => r.fils),
    torsades: results.flatMap(r => r.torsades),
    splices: results.flatMap(r => r.splices),
  });
}
