import { NextRequest, NextResponse } from 'next/server';
import { getRMAlternatives, updateRMAlternative } from '../../../lib/db';

export async function GET() {
  const data = await getRMAlternatives();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as { id: number } & Record<string, string>;
    const { id, ...fields } = body;
    const ok = await updateRMAlternative(id, fields);
    return NextResponse.json({ ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
