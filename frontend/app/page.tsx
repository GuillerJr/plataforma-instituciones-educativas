import Link from 'next/link';

const navigation = [
  { label: 'Propuesta educativa', href: '#propuesta' },
  { label: 'Vida institucional', href: '#vida-institucional' },
  { label: 'Oferta académica', href: '#oferta-academica' },
  { label: 'Admisiones', href: '#admisiones' },
];

const trustSignals = [
  'Acompañamiento académico, formativo y familiar en un mismo recorrido.',
  'Comunicación clara para familias y acceso protegido para el equipo interno.',
  'Una presencia pública sobria, actual y pensada para instituciones serias.',
];

const heroMetrics = [
  { value: '360°', label: 'acompañamiento del estudiante' },
  { value: '3 niveles', label: 'integrados en una sola visión pedagógica' },
  { value: '24/7', label: 'acceso institucional protegido para el equipo' },
  { value: '1 ruta', label: 'de admisión clara, visible y profesional' },
];

const pillars = [
  {
    title: 'Formación exigente con acompañamiento cercano',
    description:
      'La propuesta comunica rigor académico, seguimiento humano y expectativas altas desde el primer vistazo.',
  },
  {
    title: 'Comunicación institucional con criterio',
    description:
      'Cada bloque ordena la información clave para que familias y aspirantes entiendan qué distingue a la institución.',
  },
  {
    title: 'Operación interna visible solo cuando corresponde',
    description:
      'El acceso al sistema permanece presente, pero sin interferir con la narrativa pública ni con la experiencia de admisiones.',
  },
];

const educationalExperience = [
  {
    eyebrow: 'Trayectoria escolar',
    title: 'Inicial, primaria y secundaria articuladas con continuidad pedagógica.',
    description:
      'La landing presenta un recorrido formativo coherente para que la familia perciba proyecto, no solo oferta.',
  },
  {
    eyebrow: 'Relación con las familias',
    title: 'Información accesible, tono profesional y orientación clara en cada punto de contacto.',
    description:
      'La fachada pública prioriza confianza, cercanía y claridad antes de llevar al siguiente paso del proceso.',
  },
  {
    eyebrow: 'Gobernanza institucional',
    title: 'Vida académica y operación protegida detrás de un acceso reservado para el equipo autorizado.',
    description:
      'Se separa de forma explícita la experiencia comercial e institucional del entorno operativo interno.',
  },
];

const academicOffer = [
  {
    stage: 'Educación inicial',
    focus: 'Primeros vínculos, autonomía, lenguaje y desarrollo socioemocional.',
  },
  {
    stage: 'Educación primaria',
    focus: 'Bases sólidas en lectura, pensamiento lógico, convivencia y hábitos de estudio.',
  },
  {
    stage: 'Educación secundaria',
    focus: 'Profundización académica, criterio personal y proyección hacia estudios superiores.',
  },
];

const differentiators = [
  'Jerarquía visual más madura y menos apariencia de producto demo.',
  'Mayor ritmo editorial con bloques amplios, aire y contraste medido.',
  'CTA mejor ubicados para admisiones, orientación y acceso institucional.',
  'Secciones posteriores con más sustancia: propuesta, métricas, oferta y proceso.',
];

const admissionsJourney = [
  {
    step: '01',
    title: 'Primer contacto y orientación',
    description:
      'La familia encuentra de inmediato cómo solicitar información, agendar conversación o iniciar su acercamiento.',
  },
  {
    step: '02',
    title: 'Presentación institucional',
    description:
      'La propuesta educativa, la vida escolar y la estructura académica se entienden con rapidez y sin saturación.',
  },
  {
    step: '03',
    title: 'Ingreso acompañado',
    description:
      'La continuidad entre landing pública y sistema protegido permite sostener un proceso ordenado y profesional.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f7f8fb_0%,#edf2f7_24%,#f5f8fc_100%)] text-slate-950">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.1),transparent_26%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_24%),linear-gradient(180deg,#f7f8fb_0%,#edf2f7_24%,#f5f8fc_100%)]" />
        <div className="absolute left-[-10rem] top-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute right-[-8rem] top-[-4rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-slate-300/30 blur-3xl" />

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

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-8 lg:px-10 lg:pb-24 lg:pt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] xl:gap-12">
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                Admisiones, confianza institucional y acceso protegido
              </div>

              <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-[5.3rem] xl:leading-[0.96]">
                La primera impresión de una institución también educa.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Un landing público con lenguaje editorial, presencia premium y estructura clara para presentar proyecto educativo, generar confianza en las familias y conducir mejor el proceso de admisiones.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/registro" className="primary-button w-full sm:w-auto">
                  Solicitar acompañamiento de admisiones
                </Link>
                <Link href="#propuesta" className="secondary-button w-full sm:w-auto">
                  Explorar la propuesta institucional
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {trustSignals.map((item) => (
                  <article
                    key={item}
                    className="rounded-[26px] border border-white/80 bg-white/82 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur"
                  >
                    <div className="h-1.5 w-12 rounded-full bg-slate-950" />
                    <p className="mt-4 text-sm leading-7 text-slate-700">{item}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative lg:pt-6">
              <div className="relative overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(155deg,#07111f_0%,#10213c_34%,#163b5b_68%,#1b5c87_100%)] p-6 shadow-[0_36px_100px_rgba(15,23,42,0.22)] sm:p-8">
                <div className="absolute inset-x-8 top-8 h-px bg-white/15" />
                <div className="absolute left-1/2 top-[18%] h-44 w-44 -translate-x-1/2 rounded-full bg-sky-100/20 blur-3xl" />
                <div className="absolute right-[-2rem] top-20 h-40 w-40 rounded-full border border-white/10 bg-white/5" />
                <div className="absolute bottom-10 left-[-2rem] h-36 w-36 rounded-full border border-white/10 bg-sky-300/10" />

                <div className="relative flex h-full flex-col gap-8">
                  <div className="flex items-start justify-between gap-4 text-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/90">
                        Fachada institucional
                      </p>
                      <h2 className="mt-4 max-w-sm text-3xl font-semibold tracking-tight sm:text-[2.15rem] sm:leading-tight">
                        Una presencia pública hecha para inspirar seriedad, orden y futuro.
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                      Login visible
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.08fr_0.92fr]">
                    <article className="rounded-[30px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Propuesta central</p>
                      <p className="mt-4 text-2xl font-semibold leading-tight text-white">
                        Contenido mejor distribuido, más intención editorial y menos sensación de sistema administrativo.
                      </p>
                      <p className="mt-4 text-sm leading-7 text-white/75">
                        El visitante entiende qué ofrece la institución, cómo se vive su proyecto y cuál es el siguiente paso.
                      </p>
                    </article>

                    <article className="rounded-[30px] border border-white/15 bg-slate-950/25 p-5 backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Acceso institucional</p>
                      <p className="mt-4 text-lg font-semibold text-white">Separado, protegido y visible para el equipo.</p>
                      <div className="mt-5 space-y-3 text-sm text-white/78">
                        <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">Admisiones hacia afuera.</p>
                        <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">Gestión académica hacia adentro.</p>
                      </div>
                    </article>
                  </div>

                  <div className="rounded-[30px] border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                    <div className="grid gap-4 sm:grid-cols-4">
                      {heroMetrics.map((metric) => (
                        <div key={metric.label} className="rounded-[24px] border border-white/10 bg-slate-950/20 px-4 py-4">
                          <p className="text-2xl font-semibold tracking-tight text-white">{metric.value}</p>
                          <p className="mt-2 text-xs leading-5 text-white/72">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-panel mt-5 ml-auto max-w-md p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Lectura estratégica</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                  El landing deja de parecer un acceso técnico y pasa a comportarse como una portada institucional de alto nivel.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[34px] border border-slate-200/90 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.15)] lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">Confianza institucional</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Una narrativa pública más madura para una institución que necesita verse tan sólida como opera.
            </h2>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            {differentiators.map((item, index) => (
              <article key={item} className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-semibold text-sky-700">0{index + 1}</p>
                <p className="mt-3 text-base leading-7 text-slate-700">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="propuesta" className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[34px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f7fafe_100%)] p-8 shadow-[0_22px_56px_rgba(15,23,42,0.06)] sm:p-9">
            <p className="eyebrow">Propuesta institucional</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              La institución se explica mejor cuando el contenido se organiza como proyecto y no como listado.
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-slate-600">
              La nueva composición trabaja con bloques de distinto peso, contraste y respiración visual para construir una historia más convincente: qué se propone, cómo acompaña, qué niveles articula y cómo iniciar el contacto.
            </p>
          </article>

          <div className="grid gap-4">
            {pillars.map((item) => (
              <article key={item.title} className="rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_16px_38px_rgba(15,23,42,0.05)] sm:p-7">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="vida-institucional" className="mx-auto max-w-7xl px-6 py-2 sm:px-8 lg:px-10 lg:py-4">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4">
            <article className="rounded-[34px] border border-slate-200/90 bg-white p-7 shadow-[0_18px_46px_rgba(15,23,42,0.05)] sm:p-8">
              <p className="eyebrow">Vida institucional</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Una experiencia pública con mejor ritmo visual, más sustancia y señales claras de confianza.
              </h2>
            </article>

            <div className="grid gap-4 md:grid-cols-3">
              {educationalExperience.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{item.eyebrow}</p>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <article className="overflow-hidden rounded-[34px] border border-slate-200/90 bg-slate-950 p-8 text-white shadow-[0_28px_70px_rgba(15,23,42,0.16)] sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Métricas y lectura</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                  <p className="text-4xl font-semibold tracking-tight text-white">{metric.value}</p>
                  <p className="mt-3 text-sm leading-6 text-white/72">{metric.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-7 text-slate-300">
              Las métricas funcionan como piezas de confianza y síntesis narrativa. No son decoración: condensan foco pedagógico, claridad operativa y separación entre experiencia pública y gestión interna.
            </p>
          </article>
        </div>
      </section>

      <section id="oferta-academica" className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="rounded-[36px] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f3f7fb_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-9 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p className="eyebrow">Oferta educativa</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Una oferta presentada con más jerarquía, contexto y continuidad formativa.
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                En lugar de bloques sueltos, la sección organiza la experiencia por etapas y comunica cómo evoluciona el acompañamiento a lo largo de toda la trayectoria escolar.
              </p>
            </div>

            <div className="grid gap-4">
              {academicOffer.map((item) => (
                <article key={item.stage} className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.05)] sm:p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{item.stage}</h3>
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Tramo formativo
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.focus}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="admisiones" className="mx-auto max-w-7xl px-6 pb-8 pt-2 sm:px-8 lg:px-10 lg:pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <article className="rounded-[36px] border border-slate-200/90 bg-slate-950 p-8 text-white shadow-[0_28px_74px_rgba(15,23,42,0.16)] sm:p-9 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">CTA institucional</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Un cierre claro para familias interesadas y un acceso directo para el equipo institucional.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-300">
              El nuevo landing termina con una llamada a la acción más sólida, coherente con el resto de la narrativa y preparada para convertir sin perder sobriedad.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              <article key={item.step} className="rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_16px_38px_rgba(15,23,42,0.05)] sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
        <footer className="rounded-[32px] border border-slate-200/90 bg-white/88 px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur sm:px-8 sm:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Entorno Horizonte</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Plataforma institucional con presencia pública renovada, orientación de admisiones y acceso privado para la operación académica.
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
