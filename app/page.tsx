'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { DashboardStats } from '../lib/db';

const NAV_CARDS = [
  { href: '/fils',        icon: 'wire',   label: 'Wire Cutting Specs', desc: 'Câblage RHD / LHD',         color: '#5ad1e6' },
  { href: '/torsades',    icon: 'twist',  label: 'Cutting Data',       desc: 'Fiches de préparation',     color: '#46c8b0' },
  { href: '/splices',     icon: 'splice', label: 'QC & Traceability',  desc: 'Points de jonction',        color: '#e8b04b' },
  { href: '/production',  icon: 'box',    label: 'Order Planning',     desc: 'Suivi commandes/livraisons',color: '#5bd6a0' },
  { href: '/inventaire',  icon: 'tool',   label: 'Crimping Dies & Alternatives', desc: 'Outils process M6',  color: '#e8924b' },
  { href: '/recap',       icon: 'doc',    label: 'Récap Expéditions',  desc: 'BL / DN / Customer PO',     color: '#6aa0d8' },
  { href: '/rm-alternative-materiel', icon: 'swap', label: 'RM Alternatives',     desc: 'Matériaux alternatifs RM', color: '#9a8cd0' },
  { href: '/upload',      icon: 'upload', label: 'Upload Data',        desc: 'Import Excel / PPTX → DB',  color: '#5ad1e6' },
];

/* Schematic line-icons — 1.5px stroke, drafted to match the blueprint theme. */
function ModuleIcon({ name }: { name: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'wire':   return <svg viewBox="0 0 24 24"><circle cx="3.5" cy="12" r="1.6" {...p} /><circle cx="20.5" cy="12" r="1.6" {...p} /><path d="M5 12c2 0 2-4 4.5-4s2.5 4 4.5 4 2.5-4 4.5-4" {...p} /></svg>;
    case 'twist':  return <svg viewBox="0 0 24 24"><path d="M5 6c5 4 9 8 14 12M5 18c5-4 9-8 14-12" {...p} /><circle cx="12" cy="12" r="1.3" {...p} /></svg>;
    case 'splice': return <svg viewBox="0 0 24 24"><path d="M3 7h6M3 17h6M9 7c3 0 3 5 6 5M9 17c3 0 3-5 6-5M15 12h6" {...p} /><circle cx="15" cy="12" r="1.5" {...p} /></svg>;
    case 'box':    return <svg viewBox="0 0 24 24"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" {...p} /><path d="M4 7l8 4 8-4M12 11v10" {...p} /></svg>;
    case 'tool':   return <svg viewBox="0 0 24 24"><path d="M6 4v5l3 2v9M18 4v5l-3 2M9 11h6" {...p} /><circle cx="6" cy="3.5" r="1.2" {...p} /><circle cx="18" cy="3.5" r="1.2" {...p} /></svg>;
    case 'doc':    return <svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6V3Z" {...p} /><path d="M14 3v4h4M9 12h6M9 16h6" {...p} /></svg>;
    case 'swap':   return <svg viewBox="0 0 24 24"><path d="M4 9h13l-3-3M20 15H7l3 3" {...p} /></svg>;
    case 'upload': return <svg viewBox="0 0 24 24"><path d="M4 15v4h16v-4M12 16V4M7 9l5-5 5 5" {...p} /></svg>;
    default:       return <svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" {...p} /></svg>;
  }
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const deliveryRate = stats ? Math.round((stats.orders_on_time / Math.max(stats.orders_total, 1)) * 100) : 0;

  return (
    <main className="container">
      {/* Hero */}
      <section className="hero-banner">
        <div className="hero-brand">
          <span className="hero-tag">Versigent · JLR L550</span>
          <h1 className="hero-title">After-Sales<br /><span style={{ color: '#5ad1e6' }}>Dashboard</span></h1>
          <p className="hero-subtitle">
            Tableau de bord industriel After-Sales — Order Planning, BOM, Wire Cutting Specs, Crimping Dies, QC &amp; Traceability.
          </p>
        </div>
        <div className="hero-kpi-row">
          <div className="hero-kpi">
            <strong>{stats?.total_fils ?? '—'}</strong>
            <span>Fils</span>
          </div>
          <div className="hero-kpi">
            <strong>{stats?.total_torsades ?? '—'}</strong>
            <span>Torsades</span>
          </div>
          <div className="hero-kpi">
            <strong>{stats?.total_splices ?? '—'}</strong>
            <span>Splices</span>
          </div>
          <div className="hero-kpi">
            <strong>{stats?.total_outils ?? '—'}</strong>
            <span>Outils</span>
          </div>
        </div>
      </section>

      {/* Delivery status */}
      <section style={{ marginTop: 28 }}>
        <div className="section-heading">
          <div>
            <h2>Order Planning Status</h2>
            <p>Commandes actives par feuille de suivi</p>
          </div>
          <Link href="/production" className="button-secondary" style={{ fontSize: '0.9rem' }}>Voir tout →</Link>
        </div>
        <div className="status-strip">
          <div className="status-card" style={{ borderLeftColor: '#5bd6a0' }}>
            <strong style={{ color: '#5bd6a0' }}>{stats?.orders_on_time ?? '—'}</strong>
            <span>On Time</span>
          </div>
          <div className="status-card" style={{ borderLeftColor: '#f0655a' }}>
            <strong style={{ color: '#f0655a' }}>{stats?.orders_delay ?? '—'}</strong>
            <span>Delay</span>
          </div>
          <div className="status-card" style={{ borderLeftColor: '#5ad1e6' }}>
            <strong style={{ color: '#5ad1e6' }}>{deliveryRate}%</strong>
            <span>Delivery Rate</span>
          </div>
          <div className="status-card" style={{ borderLeftColor: '#6aa0d8' }}>
            <strong>{stats?.orders_total ?? '—'}</strong>
            <span>Total commandes</span>
          </div>
        </div>
      </section>

      {/* Nav cards */}
      <section style={{ marginTop: 28 }}>
        <div className="section-heading">
          <div>
            <h2>Modules</h2>
            <p>Accès rapide aux données du faisceau</p>
          </div>
        </div>
        <div className="nav-card-grid">
          {NAV_CARDS.map(card => (
            <Link key={card.href} href={card.href} className="nav-card">
              <div className="nav-card-icon" style={{ color: card.color }}><ModuleIcon name={card.icon} /></div>
              <div>
                <div className="nav-card-title">{card.label}</div>
                <div className="nav-card-desc">{card.desc}</div>
              </div>
              <span className="nav-card-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Families */}
      {stats?.families && stats.families.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <div className="section-heading">
            <div>
              <h2>Familles de câblage</h2>
              <p>Configurations disponibles dans la base</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {stats.families.map(f => (
              <div key={f} className="family-chip">
                <span style={{ color: '#5ad1e6', marginRight: 8 }}>+</span>{f}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
