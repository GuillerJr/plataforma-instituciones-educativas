import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found-page mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <section className="section-grid-card w-full text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">La página solicitada no existe</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Verifica la ruta o regresa al panel principal para continuar con la gestión educativa.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/" className="primary-button">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
