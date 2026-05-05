import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Educa | Institución educativa, admisiones y acceso al sistema',
  description:
    'Landing institucional en español para Educa con oferta académica, modelo pedagógico, admisiones visibles y acceso privado al sistema.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
