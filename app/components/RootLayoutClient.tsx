'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = { children: React.ReactNode };

const NAV_LINKS = [
  { href: '/',            label: 'Dashboard' },
  { href: '/fils',        label: 'Fils' },
  { href: '/torsades',    label: 'Torsades' },
  { href: '/splices',     label: 'Splices' },
  { href: '/production',  label: 'Production' },
  { href: '/inventaire',  label: 'Inventaire' },
  { href: '/contacts',    label: 'Contacts' },
];

function AppShell({ children }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark-theme');
  }, []);

  const logo = '/logos/2026_versigent_logo_horizontal-removebg-preview.png';

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="site-logo">
            <img src={logo} alt="Versigent" className="site-logo-image" />
          </Link>

          <nav className="site-nav">
            {NAV_LINKS.map(link => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link${active ? ' nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="site-actions">
            <span className="project-badge">JLR · L550</span>
          </div>
        </div>
      </header>
      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-glow" />
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand column */}
            <div className="footer-col footer-brand-col">
              <img src={logo} alt="Versigent" className="footer-logo" />
              <p className="footer-tagline">
                Tableau de bord industriel pour la gestion des faisceaux électriques — suivi des fils, torsades, splices et production.
              </p>
              <div className="footer-social">
                <a href="https://www.versigent.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Website">
                  🌐
                </a>
                <a href="mailto:contact@versigent.com" className="footer-social-link" title="Email">
                  ✉️
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links">
                <li><Link href="/">Dashboard</Link></li>
                <li><Link href="/composants">Composants</Link></li>
                <li><Link href="/alternatives">Alternatives</Link></li>
                <li><Link href="/disponibilite">Disponibilité</Link></li>
                <li><Link href="/import">Import</Link></li>
              </ul>
            </div>

            {/* Modules */}
            <div className="footer-col">
              <h4 className="footer-col-title">Modules</h4>
              <ul className="footer-links">
                <li><Link href="/fils">⚡ Fils Simples</Link></li>
                <li><Link href="/torsades">🔀 Torsades</Link></li>
                <li><Link href="/splices">🔗 Splices</Link></li>
                <li><Link href="/production">📦 Production</Link></li>
                <li><Link href="/inventaire">🔧 Inventaire</Link></li>
                <li><Link href="/contacts">📋 Contacts</Link></li>
              </ul>
            </div>

            {/* Info */}
            <div className="footer-col">
              <h4 className="footer-col-title">Projet</h4>
              <ul className="footer-info-list">
                <li>
                  <span className="footer-info-label">Client</span>
                  <span className="footer-info-value">JLR — L550</span>
                </li>
                <li>
                  <span className="footer-info-label">Produit</span>
                  <span className="footer-info-value">Passenger Door</span>
                </li>
                <li>
                  <span className="footer-info-label">Config</span>
                  <span className="footer-info-value">RHD / LHD</span>
                </li>
                <li>
                  <span className="footer-info-label">Plateforme</span>
                  <span className="footer-info-value">Next.js 14</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-divider" />
            <div className="footer-bottom-content">
              <span>© {new Date().getFullYear()} Versigent. Tous droits réservés.</span>
              <span className="footer-version">v0.1.0 · Composant Alternatives</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function RootLayoutClient({ children }: Props) {
  return <AppShell>{children}</AppShell>;
}
