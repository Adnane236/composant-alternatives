import { NextResponse } from 'next/server';
import { getDashboardStats } from '../../../lib/db';

export async function GET() {
  const data = await getDashboardStats();
  return NextResponse.json(data);
}
