'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = { children: React.ReactNode };

const NAV_LINKS = [
  { href: '/',            label: 'After-Sales' },
  { href: '/fils',        label: 'Wire Cutting Specs' },
  { href: '/torsades',    label: 'Cutting Data' },
  { href: '/splices',     label: 'QC & Traceability' },
  { href: '/production',  label: 'Order Planning' },
  { href: '/inventaire',  label: 'Crimping Dies' },
  { href: '/contacts',    label: 'Contacts' },
];

const SYSTEM_LINKS = [
  { label: 'ERP', icon: '⊞' },
  { label: 'PLM', icon: '⊟' },
  { label: 'MES', icon: '⊠' },
  { label: 'QMS', icon: '⊡' },
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
          <div className="footer-minimal">
            <div className="footer-minimal-brand">
              <img src={logo} alt="Versigent" className="footer-logo" />
              <p className="footer-tagline">
                Tableau de bord industriel After-Sales — suivi des fils, torsades, splices et production.
              </p>
            </div>
            <div className="footer-badges">
              <div className="footer-badge"><span className="footer-badge-label">Client</span><span className="footer-badge-value">JLR — L550</span></div>
              <div className="footer-badge"><span className="footer-badge-label">Produit</span><span className="footer-badge-value">Passenger Door</span></div>
              <div className="footer-badge"><span className="footer-badge-label">Config</span><span className="footer-badge-value">RHD / LHD</span></div>
              <div className="footer-badge"><span className="footer-badge-label">Plateforme</span><span className="footer-badge-value">Next.js 14</span></div>
            </div>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom-content">
            <span>© {new Date().getFullYear()} Versigent. Tous droits réservés.</span>
            <a href="https://portfolio-adnane-megrini.netlify.app/" target="_blank" rel="noopener noreferrer" className="footer-dev-credit">
              Développé par <strong>Adnane Megrini</strong>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function RootLayoutClient({ children }: Props) {
  return <AppShell>{children}</AppShell>;
}
