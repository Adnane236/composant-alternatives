import { NextRequest, NextResponse } from 'next/server';
import { getSplices } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const famille = req.nextUrl.searchParams.get('famille') || undefined;
  const data = await getSplices(famille);
  return NextResponse.json(data);
}
