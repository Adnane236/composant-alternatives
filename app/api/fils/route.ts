import { NextRequest, NextResponse } from 'next/server';
import { getFils } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const famille = req.nextUrl.searchParams.get('famille') || undefined;
  const data = await getFils(famille);
  return NextResponse.json(data);
}
