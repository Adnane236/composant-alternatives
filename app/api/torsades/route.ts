import { NextRequest, NextResponse } from 'next/server';
import { getTorsades } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const famille = req.nextUrl.searchParams.get('famille') || undefined;
  const data = await getTorsades(famille);
  return NextResponse.json(data);
}
