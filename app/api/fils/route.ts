import { NextRequest, NextResponse } from 'next/server';
import { getFils, updateTableRow } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const famille = req.nextUrl.searchParams.get('famille') || undefined;
  const data = await getFils(famille);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as { id: number } & Record<string, string>;
    const { id, ...fields } = body;
    const ok = await updateTableRow('Fils', id, fields);
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
