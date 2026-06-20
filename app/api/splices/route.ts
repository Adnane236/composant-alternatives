import { NextRequest, NextResponse } from 'next/server';
import { getSplices, updateTableRow } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const famille = req.nextUrl.searchParams.get('famille') || undefined;
  const data = await getSplices(famille);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as { id: number } & Record<string, string>;
    const { id, ...fields } = body;
    const ok = await updateTableRow('Splices', id, fields);
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
