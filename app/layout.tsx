import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from './components/RootLayoutClient';

export const metadata: Metadata = {
  title: 'Versigent Components Dashboard',
  description: 'Dashboard industriel pour composants, disponibilité et alternatives',
  icons: {
    icon: '/logos/www.versigent.avif',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/logos/www.versigent.avif" type="image/avif" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
