import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Educa Plataforma | Gestión educativa institucional',
  description:
    'Plataforma institucional para gestión educativa con acceso privado, roles diferenciados, estructura académica, matrícula, evaluación y asistencia.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
