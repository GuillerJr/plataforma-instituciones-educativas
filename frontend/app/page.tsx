import Link from 'next/link';

const navigation = [
  { label: 'Propuesta', href: '#propuesta' },
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Comunidad', href: '#comunidad' },
  { label: 'Admisiones', href: '#admisiones' },
];

const trustSignals = [
  'Proyecto pedagógico visible y bien argumentado.',
  'Admisiones claras para familias y aspirantes.',
  'Acceso privado para la operación institucional.',
];

const impactMetrics = [
  { value: '360°', label: 'seguimiento formativo, académico y familiar' },
  { value: '3 etapas', label: 'integradas en una sola narrativa educativa' },
  { value: '24/7', label: 'acceso protegido para el equipo institucional' },
  { value: '1 ruta', label: 'de contacto, orientación e ingreso' },
];

const proposalBlocks = [
  {
    title: 'Formación exigente con acompañamiento cercano',
    description:
      'La institución se presenta con rigor, calidez y expectativas altas desde el primer recorrido visual.',
  },
  {
    title: 'Comunicación sobria que sí orienta decisiones',
    description:
      'Cada sección responde preguntas reales de una familia: proyecto, ambiente, oferta, proceso y siguiente paso.',
  },
  {
    title: 'Separación clara entre presencia pública y gestión interna',
    description:
      'La plataforma protege la operación académica sin convertir el landing en una pantalla técnica.',
  },
];

const experienceColumns = [
  {
    eyebrow: 'Vida escolar',
    title: 'Una institución que comunica cultura, no solo servicios.',
    description:
      'La composición prioriza escenas de acompañamiento, convivencia, proyecto y pertenencia para que la visita se sienta humana y sólida.',
  },
  {
    eyebrow: 'Continuidad pedagógica',
    title: 'Inicial, primaria y secundaria articuladas con sentido de trayectoria.',
    description:
      'La oferta se entiende como un recorrido completo en el que cada etapa prepara la siguiente con coherencia visible.',
  },
  {
    eyebrow: 'Confianza operativa',
    title: 'El equipo encuentra acceso directo sin interferir con la narrativa pública.',
    description:
      'El sistema interno sigue disponible, pero queda encuadrado como un acceso reservado y profesional.',
  },
];

const academicOffer = [
  {
    stage: 'Educación inicial',
    focus: 'Exploración, lenguaje, autonomía y desarrollo socioemocional con acompañamiento cercano.',
    accent: 'Descubrir',
  },
  {
    stage: 'Educación primaria',
    focus: 'Fundamentos sólidos en lectura, pensamiento lógico, convivencia y hábitos de estudio.',
    accent: 'Consolidar',
  },
  {
    stage: 'Educación secundaria',
    focus: 'Profundización académica, criterio personal y preparación para el siguiente nivel.',
    accent: 'Proyectar',
  },
];

const communityHighlights = [
  'Acompañamiento a familias con lenguaje claro y puntos de contacto visibles.',
  'Bloques de confianza que transmiten orden, criterio y continuidad institucional.',
  'Secciones más ricas en contenido para evitar la sensación de plantilla genérica.',
  'Cierre de conversión con oferta, proceso y acceso interno bien diferenciados.',
];

const admissionsJourney = [
  {
    step: '01',
    title: 'Descubrir la propuesta',
    description:
      'La familia entiende rápido qué distingue a la institución y cómo se vive su proyecto educativo.',
  },
  {
    step: '02',
    title: 'Solicitar orientación',
    description:
      'Los llamados a la acción priorizan acompañamiento, información y una conversación concreta.',
  },
  {
    step: '03',
    title: 'Continuar el proceso',
    description:
      'La experiencia conecta presencia pública, gestión de interés y acceso protegido sin perder sobriedad.',
  },
];

const institutionalNotes = [
  'Narrativa editorial para admisiones y posicionamiento institucional.',
  'Composición más original con superposiciones, paneles y ritmo vertical real.',
  'Responsive revisado para evitar bloques pesados y textos sobredimensionados en móvil.',
];

export default function HomePage() {
  return (
    <main className="landing-root min-h-screen overflow-x-hidden text-slate-950">
      <div className="landing-noise" />

      <header className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="landing-topbar">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="landing-brand-mark">EH</span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-sky-700 sm:text-[11px]">
                Plataforma institucional
              </span>
              <span className="block truncate text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
                Entorno Horizonte
              </span>
            </span>
          </Link>

          <nav className="landing-nav hidden xl:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link border-transparent bg-transparent">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link href="/registro" className="secondary-button hidden sm:inline-flex">
              Solicitar información
            </Link>
            <Link href="/login" className="primary-button">
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="landing-mobile-nav xl:hidden">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="landing-mobile-nav-link">
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pb-24">
        <div className="landing-hero-grid">
          <div className="relative z-10">
            <div className="landing-kicker">
              Admisiones visibles, confianza institucional y acceso privado bien resuelto
            </div>

            <h1 className="landing-display mt-6 max-w-4xl">
              Un sitio institucional que proyecta excelencia antes de pedir el primer contacto.
            </h1>

            <p className="landing-lead mt-5 max-w-2xl">
              La presencia pública deja de sentirse como una plantilla genérica y pasa a comunicar criterio pedagógico,
              cultura escolar y una ruta de admisión clara con carácter propio.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/registro" className="primary-button w-full sm:w-auto">
                Solicitar acompañamiento de admisiones
              </Link>
              <Link href="#propuesta" className="secondary-button w-full sm:w-auto">
                Ver propuesta institucional
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {trustSignals.map((item) => (
                <article key={item} className="landing-trust-card">
                  <span className="landing-trust-dot" />
                  <p>{item}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
              <article className="landing-editorial-card">
                <p className="eyebrow">Lectura institucional</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">
                  La primera impresión transmite orden, visión pedagógica y una cultura académica mejor narrada.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                  El hero ya no funciona como una portada plana. Ahora combina capas, información útil y ritmo visual para
                  que la institución se perciba premium, contemporánea y confiable desde móvil hasta escritorio amplio.
                </p>
              </article>

              <article className="landing-aside-card">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Acceso del equipo</p>
                <p className="mt-4 text-xl font-semibold tracking-tight text-white">
                  El sistema interno sigue presente, pero ubicado donde corresponde.
                </p>
                <div className="mt-5 space-y-3 text-sm leading-6 text-white/78">
                  <p className="rounded-[20px] border border-white/12 bg-white/10 px-4 py-3">Presencia pública hacia afuera.</p>
                  <p className="rounded-[20px] border border-white/12 bg-white/10 px-4 py-3">Operación académica hacia adentro.</p>
                </div>
              </article>
            </div>
          </div>

          <div className="landing-hero-stage">
            <div className="landing-stage-shell">
              <div className="landing-stage-header">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/90">Fachada institucional</p>
                  <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight text-white sm:text-[2.3rem] sm:leading-tight">
                    Más editorial, más memorable y mucho mejor adaptada a cada pantalla.
                  </h2>
                </div>
                <span className="landing-stage-chip">Premium educativo</span>
              </div>

              <div className="landing-stage-composition">
                <article className="landing-stage-feature landing-stage-feature-primary">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Dirección visual</p>
                  <p className="mt-4 text-2xl font-semibold leading-tight text-white">
                    Paneles con aire, contrastes medidos, superposición controlada y bloques que sí construyen relato.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    El visitante reconoce propuesta, comunidad, niveles formativos y próximo paso sin saturación ni ruido.
                  </p>
                </article>

                <article className="landing-stage-feature landing-stage-feature-secondary">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Señales de confianza</p>
                  <div className="mt-4 space-y-3">
                    {institutionalNotes.map((item) => (
                      <div key={item} className="landing-note-pill">
                        {item}
                      </div>
                    ))}
                  </div>
                </article>

                <article className="landing-stage-feature landing-stage-feature-wide">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {impactMetrics.map((metric) => (
                      <div key={metric.label} className="landing-metric-tile">
                        <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{metric.value}</p>
                        <p className="mt-2 text-xs leading-5 text-white/72 sm:text-[13px] sm:leading-6">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="landing-band-grid">
          <article className="landing-band-primary">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">Confianza institucional</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Una presencia pública preparada para posicionar mejor la institución y convertir con más claridad.
            </h2>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {communityHighlights.map((item, index) => (
              <article key={item} className="landing-band-card">
                <p className="text-sm font-semibold text-sky-700">0{index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="propuesta" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="landing-section-grid">
          <article className="landing-large-surface">
            <p className="eyebrow">Propuesta institucional</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.8rem] lg:leading-tight">
              La institución gana profundidad cuando el contenido se organiza como proyecto, recorrido y promesa verificable.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-600 sm:text-base">
              La sección combina jerarquía tipográfica, densidad controlada y bloques de distinto peso visual para explicar
              propuesta educativa, criterio institucional y forma de acompañar a cada familia.
            </p>
          </article>

          <div className="grid gap-4">
            {proposalBlocks.map((item) => (
              <article key={item.title} className="landing-soft-card">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-[1.35rem]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia" className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 lg:py-4">
        <div className="landing-experience-shell">
          <div>
            <p className="eyebrow">Experiencia institucional</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Más carácter visual para comunicar comunidad educativa, continuidad formativa y un entorno bien gobernado.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
            <div className="grid gap-4 md:grid-cols-3">
              {experienceColumns.map((item) => (
                <article key={item.title} className="landing-soft-card landing-soft-card-tall">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">{item.eyebrow}</p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">{item.description}</p>
                </article>
              ))}
            </div>

            <article className="landing-dark-rail">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Lectura rápida</p>
              <div className="mt-6 space-y-4">
                {impactMetrics.map((metric) => (
                  <div key={metric.label} className="landing-rail-item">
                    <p className="text-3xl font-semibold tracking-tight text-white">{metric.value}</p>
                    <p className="mt-2 text-sm leading-6 text-white/72">{metric.label}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="landing-offer-shell">
          <div>
            <p className="eyebrow">Oferta educativa</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Una secuencia formativa presentada con más contexto, continuidad y presencia premium.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-600 sm:text-base">
              La oferta deja de sentirse como un bloque aislado y se convierte en una trayectoria entendible desde el primer
              vistazo, con etapas claras y foco pedagógico concreto.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {academicOffer.map((item) => (
              <article key={item.stage} className="landing-offer-card">
                <span className="landing-offer-accent">{item.accent}</span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{item.stage}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-[15px]">{item.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="comunidad" className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 lg:py-4">
        <div className="landing-community-grid">
          <article className="landing-community-panel">
            <p className="eyebrow text-sky-200">Comunidad educativa</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Una comunidad que se percibe acompañada, bien informada y conectada con un proyecto institucional reconocible.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-300 sm:text-base">
              La narrativa pública equilibra calidez y rigor para que las familias identifiquen pertenencia, método y cultura
              institucional antes de iniciar cualquier trámite.
            </p>
          </article>

          <div className="grid gap-4">
            {communityHighlights.slice(0, 3).map((item) => (
              <article key={item} className="landing-community-card">
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="admisiones" className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-10 lg:pt-16">
        <div className="landing-cta-grid">
          <article className="landing-cta-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">CTA institucional</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">
              Un cierre más convincente para familias interesadas y un acceso directo, sobrio y claro para el equipo.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-300 sm:text-base">
              El cierre integra oferta, proceso y confianza institucional en un último bloque con más presencia visual y mejor
              adaptación para móvil, tablet y escritorio.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/registro" className="primary-button w-full bg-white text-slate-950 shadow-none hover:bg-slate-100 sm:w-auto">
                Solicitar información ahora
              </Link>
              <Link
                href="/login"
                className="secondary-button w-full border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 hover:text-white sm:w-auto"
              >
                Iniciar sesión del equipo
              </Link>
            </div>
          </article>

          <div className="grid gap-4">
            {admissionsJourney.map((item) => (
              <article key={item.step} className="landing-journey-card">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-sm font-semibold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-[15px]">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <footer className="landing-footer">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Entorno Horizonte</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                Plataforma institucional con presencia pública renovada, orientación de admisiones y acceso privado para la
                operación académica.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/registro" className="secondary-button w-full sm:w-auto">
                Hablar con admisiones
              </Link>
              <Link href="/login" className="primary-button w-full sm:w-auto">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
