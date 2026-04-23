'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ComposantsPage() {
  useEffect(() => { window.location.replace('/fils'); }, []);
  return null;
}
