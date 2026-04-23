import { NextRequest, NextResponse } from 'next/server';
import { getInventaire } from '../../../lib/db';

export async function GET(req: NextRequest) {
  const localisation = req.nextUrl.searchParams.get('localisation') || undefined;
  const data = await getInventaire(localisation);
  return NextResponse.json(data);
}
