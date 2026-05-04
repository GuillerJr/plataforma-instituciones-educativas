import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entorno Horizonte | Presencia institucional y admisiones',
  description: 'Landing pública en español para una institución educativa premium con admisiones visibles y acceso privado al sistema.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
