import { NextResponse } from 'next/server';
import { getContacts } from '../../../lib/db';

export async function GET() {
  const data = await getContacts();
  return NextResponse.json(data);
}
