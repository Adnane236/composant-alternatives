'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { DashboardStats } from '../lib/db';

const NAV_CARDS = [
  { href: '/fils',        icon: '⚡', label: 'Fils Simples',     desc: 'Câblage RHD / LHD',      color: '#3f8cff' },
  { href: '/torsades',    icon: '🔀', label: 'Torsades',         desc: 'Fiches de préparation',   color: '#47d7ff' },
  { href: '/splices',     icon: '🔗', label: 'Splices',          desc: 'Points de jonction',      color: '#f5c86b' },
  { href: '/production',  icon: '📦', label: 'Production',       desc: 'Suivi commandes/livraisons', color: '#4bc292' },
  { href: '/inventaire',  icon: '🔧', label: 'Inventaire',       desc: 'Outils process M6',       color: '#ffa12f' },
  { href: '/contacts',    icon: '📋', label: 'Contacts',         desc: 'PC&L par projet',         color: '#a78bfa' },
];

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
          <h1 className="hero-title">Gestion Faisceaux<br /><span style={{ color: '#f5c86b' }}>Électriques</span></h1>
          <p className="hero-subtitle">
            Tableau de bord industriel pour la gestion des fils, torsades, splices et suivi de production — Passenger Door RHD / LHD.
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
            <h2>Statut Production</h2>
            <p>Commandes actives par feuille de suivi</p>
          </div>
          <Link href="/production" className="button-secondary" style={{ fontSize: '0.9rem' }}>Voir tout →</Link>
        </div>
        <div className="status-strip">
          <div className="status-card" style={{ borderLeft: '3px solid #4bc292' }}>
            <strong style={{ color: '#4bc292' }}>{stats?.orders_on_time ?? '—'}</strong>
            <span>On Time</span>
          </div>
          <div className="status-card" style={{ borderLeft: '3px solid #f87171' }}>
            <strong style={{ color: '#f87171' }}>{stats?.orders_delay ?? '—'}</strong>
            <span>Delay</span>
          </div>
          <div className="status-card" style={{ borderLeft: '3px solid #f5c86b' }}>
            <strong style={{ color: '#f5c86b' }}>{deliveryRate}%</strong>
            <span>Delivery Rate</span>
          </div>
          <div className="status-card" style={{ borderLeft: '3px solid #3f8cff' }}>
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
              <div className="nav-card-icon" style={{ background: `${card.color}22`, color: card.color }}>{card.icon}</div>
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
                <span style={{ color: '#47d7ff', marginRight: 8 }}>■</span>{f}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
