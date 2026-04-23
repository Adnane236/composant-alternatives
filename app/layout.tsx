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
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
