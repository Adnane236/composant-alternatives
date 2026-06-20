import { NextRequest, NextResponse } from 'next/server';
import { getRecap, updateRecapRow } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const feuille = req.nextUrl.searchParams.get('feuille') || undefined;
  const data = await getRecap(feuille);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as { id: number; bl_number?: string; dn_number?: string; notes?: string };
    const ok = await updateRecapRow(body.id, { bl_number: body.bl_number, dn_number: body.dn_number, notes: body.notes });
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
