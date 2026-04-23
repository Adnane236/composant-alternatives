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
    </div>
  );
}

export function RootLayoutClient({ children }: Props) {
  return <AppShell>{children}</AppShell>;
}
