import Link from 'next/link';

const navigation = [
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Programas', href: '#programas' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Modelo pedagógico', href: '#modelo' },
  { label: 'Admisiones', href: '#admisiones' },
  { label: 'Contacto', href: '#contacto' },
];

const heroHighlights = [
  'Portal institucional con narrativa seria para familias, aspirantes y aliados.',
  'Ingreso al sistema siempre visible para directivos, docentes y personal autorizado.',
  'Ruta de admisión clara desde la primera visita hasta el seguimiento interno.',
];

const metrics = [
  { value: '+18', label: 'años de trayectoria institucional y acompañamiento continuo' },
  { value: '94%', label: 'de permanencia por confianza en seguimiento y comunicación' },
  { value: '3 niveles', label: 'articulados con continuidad curricular y convivencia' },
  { value: '1 plataforma', label: 'para admisiones, gestión y acceso operativo seguro' },
];

const benefits = [
  {
    title: 'Imagen institucional consistente',
    description: 'La estructura prioriza jerarquía visual, sobriedad y lectura clara para proyectar una institución confiable.',
  },
  {
    title: 'Información útil antes del contacto',
    description: 'Las familias entienden propuesta, niveles, enfoque, instalaciones y admisiones sin recorrer una portada vacía.',
  },
  {
    title: 'Integración real con el sistema',
    description: 'El acceso al login convive con el landing sin romper la experiencia pública ni esconder la operación interna.',
  },
];

const programs = [
  {
    stage: 'Educación inicial',
    age: '3 a 5 años',
    title: 'Exploración, lenguaje y desarrollo socioemocional.',
    description:
      'Juego guiado, hábitos tempranos y ambientes seguros para iniciar la vida escolar con autonomía y confianza.',
  },
  {
    stage: 'Educación primaria',
    age: '6 a 11 años',
    title: 'Fundamentos académicos con seguimiento cercano.',
    description:
      'Lectura, pensamiento lógico, ciencias y ciudadanía con evaluación formativa y acompañamiento continuo.',
  },
  {
    stage: 'Educación secundaria',
    age: '12 a 17 años',
    title: 'Profundización, criterio y proyección futura.',
    description:
      'Rigor académico, liderazgo, orientación vocacional y preparación para trayectorias universitarias o técnicas.',
  },
];

const aboutCards = [
  {
    eyebrow: 'Quiénes somos',
    title: 'Una comunidad educativa con gobierno claro, cultura formativa y exigencia académica.',
    description:
      'Educa reúne dirección institucional, acompañamiento cercano y procesos consistentes para estudiantes, familias y equipo interno.',
  },
  {
    eyebrow: 'Propósito',
    title: 'Formar estudiantes con pensamiento sólido, criterio humano y hábitos de trabajo duraderos.',
    description:
      'Cada decisión académica y organizacional responde a continuidad, convivencia respetuosa y preparación para el siguiente nivel.',
  },
];

const stats = [
  { value: '12:1', label: 'relación promedio en tutoría y refuerzo académico' },
  { value: '87%', label: 'participación familiar en reuniones y seguimiento' },
  { value: '100%', label: 'de procesos trazables para el equipo dentro de Educa' },
  { value: '5 rutas', label: 'claras para informar, orientar, admitir, operar y acompañar' },
];

const pedagogicalModel = [
  {
    title: 'Aprendizaje con intención',
    description: 'Metas observables, secuencias claras y evaluación útil para mejorar el proceso de cada estudiante.',
  },
  {
    title: 'Acompañamiento personalizado',
    description: 'Tutoría por etapas y comunicación oportuna con familias cuando hace falta refuerzo o proyección adicional.',
  },
  {
    title: 'Convivencia que educa',
    description: 'Normas consistentes, formación del carácter y vida escolar pensada como parte del aprendizaje.',
  },
  {
    title: 'Tecnología al servicio del colegio',
    description: 'La plataforma apoya gestión, comunicación y trazabilidad sin reemplazar el criterio pedagógico.',
  },
];

const testimonials = [
  {
    quote:
      'Desde la primera visita se percibe orden institucional. El proceso de admisión fue claro y la comunicación siempre fue precisa.',
    name: 'Mariana Torres',
    role: 'Madre de familia, primaria',
  },
  {
    quote:
      'El colegio proyecta seriedad y luego la confirma en su seguimiento académico. Eso genera mucha tranquilidad como familia.',
    name: 'Felipe Rojas',
    role: 'Padre de familia, secundaria',
  },
  {
    quote:
      'La propuesta pedagógica y la operación interna están alineadas. Se nota un trabajo directivo sostenido y bien cuidado.',
    name: 'Laura Medina',
    role: 'Orientadora educativa',
  },
];

const facilities = [
  {
    title: 'Aulas y circulación diseñadas para concentración',
    description: 'Espacios iluminados, seguros y preparados para sostener estudio, convivencia y ritmo académico diario.',
  },
  {
    title: 'Biblioteca, laboratorio y zonas de proyecto',
    description: 'Infraestructura pensada para lectura, investigación guiada, experimentación y trabajo colaborativo.',
  },
  {
    title: 'Áreas deportivas y de bienestar',
    description: 'Escenarios para actividad física, recreación y construcción de comunidad con acompañamiento responsable.',
  },
];

const admissionsSteps = [
  {
    step: '01',
    title: 'Explorar la propuesta institucional',
    description: 'La familia revisa niveles, enfoque pedagógico, instalaciones y diferenciales de Educa.',
  },
  {
    step: '02',
    title: 'Solicitar orientación',
    description: 'El formulario centraliza interés, visitas y entrevistas con una entrada única y ordenada.',
  },
  {
    step: '03',
    title: 'Continuar admisión y matrícula',
    description: 'La información pública conecta con la gestión interna para dar seguimiento formal a cada caso.',
  },
];

const contactItems = [
  { label: 'Admisiones', value: 'admisiones@educa.edu', note: 'Respuesta en horario institucional' },
  { label: 'Atención telefónica', value: '+57 (601) 555 0148', note: 'Lunes a viernes, 7:00 a.m. a 4:00 p.m.' },
  { label: 'Ubicación', value: 'Sede principal, corredor académico y deportivo', note: 'Visitas guiadas con agenda previa' },
];

const differentiators = [
  'Tutoría por etapas con lectura individual de avances.',
  'Comunicación estructurada con familias desde admisión hasta continuidad escolar.',
  'Coordinación académica con trazabilidad operativa dentro de Educa.',
  'Separación clara entre experiencia pública y acceso privado del equipo.',
];

export default function HomePage() {
  return (
    <main className="landing-root landing-template-root min-h-screen overflow-x-hidden text-slate-950">
      <div className="landing-noise" />

      <header className="landing-header-fixed">
        <div className="landing-shell landing-header-shell">
          <div className="landing-topbar landing-topbar-premium">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="landing-brand-mark">ED</span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-sky-700 sm:text-[11px]">
                  Institución educativa
                </span>
                <span className="block truncate text-base font-semibold tracking-tight text-slate-950 sm:text-lg">Educa</span>
              </span>
            </Link>

            <nav aria-label="Navegacion principal" className="landing-nav hidden xl:flex">
              <ul className="landing-inline-list">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-link border-transparent bg-transparent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="landing-actions-cluster shrink-0">
              <Link href="/registro?requestType=admision&context=header" className="secondary-button hidden sm:inline-flex">
                Solicitar información
              </Link>
              <Link href="/login" className="primary-button">
                Iniciar sesión
              </Link>
            </div>
          </div>

          <nav aria-label="Navegacion por secciones" className="landing-mobile-nav xl:hidden">
            <ul className="landing-inline-list">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="landing-mobile-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <section className="landing-shell landing-section-hero landing-section-hero-template" aria-labelledby="hero-title">
        <div className="landing-hero-grid landing-hero-grid-template">
          <div className="landing-stack relative z-10">
            <div className="landing-kicker">Header premium, admisiones visibles y acceso interno siempre disponible</div>
            <h1 id="hero-title" className="landing-display max-w-5xl">
              Educa presenta su landing institucional con la jerarquía, ritmo y composición de un template editorial premium.
            </h1>
            <p className="landing-lead max-w-3xl">
              La portada organiza la propuesta institucional en bloques claros: hero en dos columnas, métricas, beneficios,
              programas, sobre nosotros, estadísticas, modelo pedagógico, testimonios, instalaciones, admisiones, contacto y
              cierre de conversión sin perder el acceso al sistema.
            </p>

            <div className="landing-actions-row">
              <Link href="/registro?requestType=admision&context=hero" className="primary-button w-full sm:w-auto">
                Agendar orientación de admisiones
              </Link>
              <Link href="#programas" className="secondary-button w-full sm:w-auto">
                Explorar oferta académica
              </Link>
            </div>

            <ul role="list" className="landing-card-list-sm">
              {heroHighlights.map((item) => (
                <li key={item} className="landing-trust-card">
                  <span className="landing-trust-dot" />
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="landing-hero-stage" aria-label="Resumen institucional de Educa">
            <div className="landing-stage-shell landing-stage-shell-template">
              <div className="landing-stage-header">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/90">Perfil institucional</p>
                  <h2 className="landing-stage-title mt-4 max-w-md text-white">
                    Un bloque visual derecho que resume propuesta, operación y confianza institucional.
                  </h2>
                </div>
                <span className="landing-stage-chip">Login del equipo activo</span>
              </div>

              <div className="landing-stage-composition">
                <article className="landing-stage-feature landing-stage-feature-primary">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Dirección general</p>
                  <p className="landing-panel-title-lg mt-4 text-white">
                    Educa articula admisiones, narrativa institucional y gestión operativa dentro de una misma experiencia.
                  </p>
                  <p className="landing-panel-copy mt-4 text-white/78">
                    La base del landing ya no es un collage genérico: responde a una secuencia editorial definida y reconocible.
                  </p>
                </article>

                <article className="landing-stage-feature landing-stage-feature-secondary">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Ruta visible</p>
                  <ul role="list" className="landing-stack-sm mt-4">
                    {differentiators.slice(0, 3).map((item) => (
                      <li key={item} className="landing-note-pill">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="landing-stage-feature landing-stage-feature-wide">
                  <dl className="landing-metric-grid">
                    {metrics.map((metric) => (
                      <div key={metric.label} className="landing-metric-tile">
                        <dt className="landing-metric-value text-white">{metric.value}</dt>
                        <dd className="landing-metric-label text-white/72">{metric.label}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="landing-shell landing-section-tight" aria-labelledby="metricas-title">
        <div className="landing-metrics-strip">
          {metrics.map((item) => (
            <article key={item.label} className="landing-metrics-strip-card">
              <p className="landing-metric-value text-slate-950">{item.value}</p>
              <p className="landing-panel-copy mt-3 text-slate-700">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="beneficios" className="landing-shell landing-section" aria-labelledby="beneficios-title">
        <div className="landing-template-section-head">
          <p className="eyebrow">Beneficios</p>
          <h2 id="beneficios-title" className="landing-section-title landing-section-title-xl mt-4 max-w-3xl text-slate-950">
            Una base visual más fiel al template para comunicar seriedad, claridad y dirección académica.
          </h2>
        </div>

        <div className="landing-card-list-lg mt-8">
          {benefits.map((item, index) => (
            <article key={item.title} className="landing-soft-card landing-benefit-card">
              <span className="landing-card-index">0{index + 1}</span>
              <h3 className="landing-panel-title mt-5 text-slate-950">{item.title}</h3>
              <p className="landing-panel-copy mt-3">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="programas" className="landing-shell landing-section" aria-labelledby="programas-title">
        <div className="landing-offer-shell landing-template-block">
          <div className="landing-template-section-head">
            <p className="eyebrow">Programas</p>
            <h2 id="programas-title" className="landing-section-title mt-4 max-w-3xl text-slate-950">
              Trayectorias formativas presentadas como un bloque central del landing, no como una lista aislada.
            </h2>
          </div>

          <div className="landing-card-list-lg mt-8">
            {programs.map((item) => (
              <article key={item.stage} className="landing-offer-card landing-program-card">
                <div className="landing-program-card-top">
                  <span className="landing-offer-accent">{item.age}</span>
                  <span className="landing-program-line" />
                </div>
                <h3 className="landing-panel-title-lg mt-5 text-slate-950">{item.stage}</h3>
                <p className="mt-3 text-base font-medium leading-7 text-slate-800">{item.title}</p>
                <p className="landing-panel-copy mt-4">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="landing-shell landing-section-tight" aria-labelledby="nosotros-title">
        <div className="landing-community-grid landing-template-spotlight">
          <article className="landing-community-panel">
            <p className="eyebrow text-sky-200">Sobre nosotros</p>
            <h2 id="nosotros-title" className="landing-section-title mt-4 max-w-3xl text-white">
              Educa se presenta como una institución confiable, bien gobernada y centrada en la formación integral.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl text-slate-300">
              Este bloque conserva el ritmo del template: una pieza editorial dominante a la izquierda y tarjetas de soporte a la
              derecha para profundizar la identidad institucional.
            </p>
          </article>

          <div className="landing-stack-sm">
            {aboutCards.map((item) => (
              <article key={item.title} className="landing-community-card">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">{item.eyebrow}</p>
                <h3 className="landing-panel-title mt-4 text-slate-950">{item.title}</h3>
                <p className="landing-panel-copy mt-3">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" aria-labelledby="estadisticas-title">
        <div className="landing-experience-shell landing-template-block">
          <div className="landing-template-section-head">
            <p className="eyebrow">Estadísticas</p>
            <h2 id="estadisticas-title" className="landing-section-title mt-4 max-w-3xl text-slate-950">
              Datos con lectura ejecutiva para reforzar confianza institucional y capacidad de seguimiento.
            </h2>
          </div>

          <div className="landing-card-list-lg mt-8">
            {stats.map((item) => (
              <article key={item.label} className="landing-soft-card landing-soft-card-tall">
                <p className="landing-metric-value text-slate-950">{item.value}</p>
                <p className="landing-panel-copy mt-3">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modelo" className="landing-shell landing-section" aria-labelledby="modelo-title">
        <div className="landing-section-grid landing-model-grid">
          <article className="landing-large-surface landing-template-block">
            <p className="eyebrow">Modelo pedagógico</p>
            <h2 id="modelo-title" className="landing-section-title landing-section-title-xl mt-4 text-slate-950">
              Un enfoque visible, bien explicado y conectado con la operación real del colegio.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl">
              Educa muestra cómo enseña, acompaña y evalúa. La sección se organiza como en el template: una pieza principal con
              narrativa y un grupo complementario de bloques específicos.
            </p>
            <ul role="list" className="landing-stack-sm mt-8">
              {differentiators.map((item) => (
                <li key={item} className="landing-soft-card">
                  <p className="landing-panel-copy text-slate-700">{item}</p>
                </li>
              ))}
            </ul>
          </article>

          <div className="landing-stack-sm">
            {pedagogicalModel.map((item) => (
              <article key={item.title} className="landing-soft-card">
                <h3 className="landing-panel-title text-slate-950">{item.title}</h3>
                <p className="landing-panel-copy mt-3">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section" aria-labelledby="testimonios-title">
        <div className="landing-template-section-head">
          <p className="eyebrow">Testimonios</p>
          <h2 id="testimonios-title" className="landing-section-title mt-4 max-w-3xl text-slate-950">
            Voces que respaldan la experiencia institucional con un bloque dedicado, visible y reconocible dentro del recorrido.
          </h2>
        </div>

        <div className="landing-card-list-lg mt-8">
          {testimonials.map((item) => (
            <article key={item.name} className="landing-soft-card landing-testimonial-card">
              <p className="landing-testimonial-quote">&quot;{item.quote}&quot;</p>
              <div className="mt-6">
                <h3 className="landing-panel-title text-slate-950">{item.name}</h3>
                <p className="landing-panel-copy mt-2">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-section-tight" aria-labelledby="instalaciones-title">
        <div className="landing-band-grid">
          <header className="landing-band-primary">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">Instalaciones</p>
            <h2 id="instalaciones-title" className="landing-section-title mt-4 max-w-3xl text-white">
              Espacios preparados para estudiar, convivir y sostener una experiencia educativa seria durante toda la jornada.
            </h2>
          </header>

          <div className="landing-stack-sm">
            {facilities.map((item) => (
              <article key={item.title} className="landing-band-card">
                <h3 className="landing-panel-title text-slate-950">{item.title}</h3>
                <p className="landing-panel-copy mt-3 text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="admisiones" className="landing-shell landing-section" aria-labelledby="admisiones-title">
        <div className="landing-cta-grid landing-template-spotlight">
          <article className="landing-cta-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Admisiones</p>
            <h2 id="admisiones-title" className="landing-section-title landing-section-title-xl mt-4 max-w-2xl text-white">
              Un proceso visible para las familias y fácil de operar para el equipo que administra ingresos y continuidad escolar.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl text-slate-300">
              El landing conduce a una acción concreta mientras el sistema conserva un acceso separado para usuarios con
              credenciales. Esa integración permanece visible en todo el recorrido.
            </p>
            <div className="landing-actions-row mt-8">
              <Link
                href="/registro?requestType=admision&context=admisiones"
                className="primary-button w-full bg-white text-slate-950 shadow-none hover:bg-slate-100 sm:w-auto"
              >
                Iniciar proceso de admisión
              </Link>
              <Link
                href="/login"
                className="secondary-button w-full border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 hover:text-white sm:w-auto"
              >
                Iniciar sesión del equipo
              </Link>
            </div>
          </article>

          <ol className="landing-stack-sm" aria-label="Recorrido de admisiones">
            {admissionsSteps.map((item) => (
              <li key={item.step} className="landing-journey-card">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-slate-950 text-sm font-semibold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="landing-panel-title text-slate-950">{item.title}</h3>
                    <p className="landing-panel-copy mt-3">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contacto" className="landing-shell landing-section" aria-labelledby="contacto-title">
        <div className="landing-section-grid landing-contact-grid">
          <article className="landing-large-surface landing-template-block">
            <p className="eyebrow">Contacto</p>
            <h2 id="contacto-title" className="landing-section-title landing-section-title-xl mt-4 text-slate-950">
              Canales visibles para admisiones, visitas y orientación sin perder el tono institucional del sitio.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl">
              Educa deja puntos de contacto concretos para familias interesadas y mantiene una puerta de entrada independiente para
              quienes ya cuentan con acceso al sistema.
            </p>
            <div className="landing-actions-row mt-8">
              <Link href="/registro?requestType=contacto&context=landing" className="primary-button w-full sm:w-auto">
                Solicitar respuesta institucional
              </Link>
              <Link href="/login" className="secondary-button w-full sm:w-auto">
                Acceso para usuarios registrados
              </Link>
            </div>
          </article>

          <div className="landing-stack-sm">
            {contactItems.map((item) => (
              <article key={item.label} className="landing-soft-card">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">{item.label}</p>
                <h3 className="landing-panel-title mt-4 text-slate-950">{item.value}</h3>
                <p className="landing-panel-copy mt-3">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section landing-section-cta" aria-labelledby="cta-final-title">
        <div className="landing-final-cta">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">CTA final</p>
            <h2 id="cta-final-title" className="landing-section-title mt-4 max-w-3xl text-white">
              Educa ahora aterriza el landing con la base estructural del template y mantiene visible la integración con el sistema.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl text-slate-300">
              El recorrido termina con un cierre claro de conversión para admisiones y un acceso inmediato para el equipo interno.
            </p>
          </div>

          <div className="landing-actions-row lg:justify-end">
            <Link href="/registro?requestType=admision&context=cta-final" className="primary-button w-full bg-white text-slate-950 shadow-none hover:bg-slate-100 sm:w-auto">
              Hablar con admisiones
            </Link>
            <Link
              href="/login"
              className="secondary-button w-full border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15 hover:text-white sm:w-auto"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-shell landing-footer-shell">
        <div className="landing-footer">
          <div className="landing-footer-grid">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Educa</p>
              <p className="landing-panel-copy mt-2 max-w-2xl">
                Institución educativa y plataforma de gestión orientadas a excelencia académica, relación con familias y operación
                escolar segura.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3 lg:text-right">
              <Link href="#programas" className="hover:text-slate-950">
                Oferta educativa
              </Link>
              <Link href="#admisiones" className="hover:text-slate-950">
                Admisiones
              </Link>
              <Link href="#contacto" className="hover:text-slate-950">
                Contacto
              </Link>
              <Link href="/registro?requestType=admision&context=footer" className="hover:text-slate-950">
                Solicitar información
              </Link>
              <Link href="/login" className="hover:text-slate-950">
                Iniciar sesión
              </Link>
              <span className="text-slate-500">Landing institucional en español</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
