import { NextRequest, NextResponse } from 'next/server';
import { getProductionTracking } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const feuille = req.nextUrl.searchParams.get('feuille') || undefined;
  const data = await getProductionTracking(feuille);
  return NextResponse.json(data);
}
