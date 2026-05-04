import Link from 'next/link';

const navigation = [
  { label: 'Modelo educativo', href: '#modelo-educativo' },
  { label: 'Ventajas', href: '#ventajas' },
  { label: 'Experiencia institucional', href: '#experiencia' },
  { label: 'Admisiones', href: '#admisiones' },
];

const highlights = [
  {
    value: '360°',
    label: 'Seguimiento integral',
    description: 'Académico, convivencia, familias y operación en una sola experiencia institucional.',
  },
  {
    value: '3 niveles',
    label: 'Trayectoria continua',
    description: 'Inicial, primaria y secundaria con una propuesta coherente de largo plazo.',
  },
  {
    value: '1 acceso',
    label: 'Sistema protegido',
    description: 'El entorno interno permanece separado de la portada pública y del proceso comercial.',
  },
];

const benefits = [
  {
    title: 'Relación institucional más clara',
    description:
      'La información esencial, el proceso de contacto y el acceso interno conviven con jerarquía y sin fricciones visuales.',
  },
  {
    title: 'Presencia premium y confiable',
    description:
      'La marca se presenta con sobriedad, mejor ritmo editorial y un lenguaje visual que inspira orden y seriedad.',
  },
  {
    title: 'Decisiones académicas mejor comunicadas',
    description:
      'Oferta, enfoque, acompañamiento y vida escolar se explican con estructura, contexto y foco en valor institucional.',
  },
];

const pillars = [
  {
    title: 'Proyecto educativo con criterio',
    description:
      'Una narrativa pública que resalta exigencia académica, acompañamiento cercano y formación con visión de futuro.',
  },
  {
    title: 'Canales visibles para familias',
    description:
      'Los llamados a la acción priorizan orientación, admisiones y contacto, sin mezclar procesos internos con la fachada pública.',
  },
  {
    title: 'Operación interna resguardada',
    description:
      'El botón de inicio de sesión permanece visible para el equipo autorizado, pero el sistema ya no domina la primera impresión.',
  },
];

const admissionsSteps = [
  'Conversación inicial para conocer a la familia, el estudiante y sus expectativas.',
  'Presentación de propuesta formativa, recorrido institucional y orientación de admisiones.',
  'Revisión documental, definición de cupo y acompañamiento personalizado en el ingreso.',
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#f8fbff_0%,#eef3f8_34%,#e4ebf3_100%)] text-slate-950">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_36%),radial-gradient(circle_at_left,rgba(15,23,42,0.11),transparent_34%)]" />

        <header className="mx-auto max-w-7xl px-6 pt-6 sm:px-8 lg:px-10 lg:pt-8">
          <div className="topbar-panel flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
                EH
              </span>
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-700">
                  Plataforma institucional
                </span>
                <span className="block text-lg font-semibold tracking-tight text-slate-950">
                  Entorno Horizonte
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 xl:flex">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link border-transparent bg-transparent">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/registro" className="secondary-button hidden sm:inline-flex">
                Solicitar información
              </Link>
              <Link href="/login" className="primary-button">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 pb-14 pt-8 sm:px-8 lg:px-10 lg:pb-20 lg:pt-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center">
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-800 shadow-[0_10px_25px_rgba(15,23,42,0.06)] backdrop-blur">
                Nueva presencia digital para instituciones educativas
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                Una landing pública con presencia premium, orden institucional y foco real en admisiones.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Rediseñada desde cero para comunicar propuesta educativa, transmitir confianza y separar con claridad la experiencia pública del sistema académico interno.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/registro" className="primary-button w-full sm:w-auto">
                  Solicitar una asesoría institucional
                </Link>
                <Link href="#modelo-educativo" className="secondary-button w-full sm:w-auto">
                  Conocer la propuesta
                </Link>
              </div>

              <div className="relative mt-10 rounded-[30px] border border-white/70 bg-white/88 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
                <div className="grid gap-4 md:grid-cols-3">
                  {highlights.map((item) => (
                    <article key={item.label} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
                      <p className="text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative lg:pl-6">
              <div className="relative mx-auto aspect-[0.92] w-full max-w-[34rem] overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(160deg,#0f172a_8%,#152847_42%,#1f4f78_100%)] p-6 shadow-[0_36px_80px_rgba(15,23,42,0.18)] sm:p-8">
                <div className="absolute left-1/2 top-1/2 h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(186,230,253,0.55)_32%,rgba(56,189,248,0.16)_58%,transparent_74%)]" />
                <div className="absolute right-10 top-10 h-20 w-20 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm" />
                <div className="absolute bottom-16 left-8 h-12 w-12 rounded-full border border-white/15 bg-sky-300/20" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4 text-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-100">
                        Experiencia pública
                      </p>
                      <h2 className="mt-3 max-w-xs text-3xl font-semibold tracking-tight">
                        Una fachada digital sobria para una institución que inspira confianza.
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                      Acceso interno protegido
                    </span>
                  </div>

                  <div className="grid gap-4">
                    <div className="ml-auto w-full max-w-sm rounded-[28px] border border-white/15 bg-white/12 p-5 backdrop-blur-md">
                      <p className="text-sm font-medium text-sky-100">Resumen visible</p>
                      <p className="mt-3 text-2xl font-semibold text-white">Admisiones, propuesta y acceso al sistema en una sola composición clara.</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Narrativa</p>
                        <p className="mt-2 text-sm leading-6 text-white/90">
                          Jerarquía editorial, espaciado amplio y mensajes enfocados en valor institucional.
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-white/15 bg-slate-950/25 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Composición</p>
                        <p className="mt-2 text-sm leading-6 text-white/90">
                          Hero dominante, foco visual circular y bloque flotante como pieza de síntesis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-panel absolute -bottom-8 left-4 right-4 mx-auto max-w-md p-5 sm:left-auto sm:right-0 sm:w-[22rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Síntesis institucional</p>
                <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
                  Portada pública renovada para convertir mejor y presentar la institución con mayor categoría.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-[20px] bg-slate-50 px-3 py-3">
                    <p className="text-lg font-semibold text-slate-950">01</p>
                    <p className="mt-1 text-xs text-slate-500">Hero con foco visual</p>
                  </div>
                  <div className="rounded-[20px] bg-slate-50 px-3 py-3">
                    <p className="text-lg font-semibold text-slate-950">02</p>
                    <p className="mt-1 text-xs text-slate-500">CTA claros</p>
                  </div>
                  <div className="rounded-[20px] bg-slate-50 px-3 py-3">
                    <p className="text-lg font-semibold text-slate-950">03</p>
                    <p className="mt-1 text-xs text-slate-500">Sistema separado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="modelo-educativo" className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[32px] border border-slate-200/90 bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="eyebrow">Modelo educativo</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Una institución se presenta mejor cuando comunica con la misma calidad con la que forma.
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-slate-600">
              El nuevo landing abandona el aspecto funcional o genérico y adopta una lectura más editorial: mensaje principal contundente, piezas de apoyo precisas y una experiencia visual que transmite criterio, estabilidad y cuidado por los detalles.
            </p>
          </article>

          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((item, index) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f7fafc_100%)] p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
              >
                <p className="text-sm font-semibold text-sky-700">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ventajas" className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10 lg:py-6">
        <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="rounded-[32px] border border-slate-200/90 bg-slate-950 p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Ventajas del rediseño</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Más claridad para el visitante. Más presencia para la marca. Más orden para la institución.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-300">
              La portada se convierte en una pieza comercial e institucional, mientras que el ecosistema privado conserva su función operativa sin contaminar la experiencia pública.
            </p>
          </div>

          <div className="grid gap-4">
            {pillars.map((item) => (
              <article key={item.title} className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia" className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[32px] border border-slate-200/90 bg-white p-7 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="eyebrow">Experiencia institucional</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Una estructura liviana, elegante y hecha para sostener una primera impresión de alto nivel.
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-slate-600">
              La composición prioriza aire, contraste medido y piezas con bordes suaves para evitar una sensación de demo. El contenido se apoya en bloques concretos, sin ruido, y con una lectura natural en desktop y móvil.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/registro" className="primary-button w-full sm:w-auto">
                Hablar con admisiones
              </Link>
              <Link href="/login" className="secondary-button w-full sm:w-auto">
                Iniciar sesión
              </Link>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fd_100%)] p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)] md:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Jerarquía de contenido</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Hero principal, bloque resumen flotante y secciones posteriores con peso visual controlado.
              </p>
            </article>
            <article className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-500">Lectura pública</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Más intención editorial y menos apariencia de sistema administrativo.</p>
            </article>
            <article className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-semibold text-slate-500">Lenguaje visual</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Sombras suaves, paleta sobria y superficies con profundidad sin perder limpieza.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="admisiones" className="mx-auto max-w-7xl px-6 pb-16 pt-4 sm:px-8 lg:px-10 lg:pb-24 lg:pt-6">
        <div className="rounded-[36px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f3f7fb_100%)] p-7 shadow-[0_24px_60px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="eyebrow">Admisiones</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Un proceso visible, acompañado y alineado con una imagen institucional sólida.
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                La landing pública guía el primer contacto con un recorrido claro y profesional. El equipo interno continúa luego dentro del sistema protegido, sin sacrificar seguridad ni consistencia de marca.
              </p>
            </div>

            <div className="grid gap-4">
              {admissionsSteps.map((step, index) => (
                <article key={step} className="flex gap-4 rounded-[28px] border border-slate-200/90 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    0{index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-7 text-slate-700">{step}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row">
            <Link href="/registro" className="primary-button w-full sm:w-auto">
              Solicitar información ahora
            </Link>
            <Link href="/login" className="secondary-button w-full sm:w-auto">
              Iniciar sesión del equipo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
