import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '../components/app-shell';

export const metadata: Metadata = {
  title: 'Educa | Plataforma institucional educativa',
  description: 'Plataforma institucional para autoridades educativas, equipos operativos y comunidad estudiantil.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
