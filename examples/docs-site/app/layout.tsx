import type { ReactNode } from 'react';
import './globals.css';
import { SiteShell } from '../components/SiteShell';

export const metadata = {
  title: 'Skeleto — zero-config @kenildev007/skeleton loaders',
  description:
    'Auto-generated @kenildev007/skeleton loaders for React, React Native, and Expo. One component. 60 FPS. Zero config.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
