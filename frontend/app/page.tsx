import Link from 'next/link';

const navigation = [
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Programas', href: '#programas' },
  { label: 'Modelo pedagógico', href: '#modelo' },
  { label: 'Admisiones', href: '#admisiones' },
  { label: 'Contacto', href: '#contacto' },
];

const heroHighlights = [
  'Portal institucional en español con mensaje claro para familias y aspirantes.',
  'Acceso privado del equipo académico y administrativo sin mezclarlo con la narrativa pública.',
  'Proceso de admisión visible, ordenado y consistente con la operación del sistema Educa.',
];

const metrics = [
  { value: '+18', label: 'años consolidando cultura académica, acompañamiento y resultados institucionales' },
  { value: '94%', label: 'de familias renuevan por confianza en el seguimiento formativo y la comunicación' },
  { value: '3 niveles', label: 'integrados con continuidad curricular: inicial, primaria y secundaria' },
  { value: '1 plataforma', label: 'para admisiones, operación académica y acceso seguro del equipo' },
];

const benefits = [
  {
    title: 'Dirección institucional con presencia sólida',
    description:
      'El landing presenta a Educa como una institución seria: mensaje ejecutivo, estructura clara y pruebas visibles de organización académica.',
  },
  {
    title: 'Información útil antes del primer contacto',
    description:
      'Las familias encuentran propuesta de valor, niveles, admisiones, modelo pedagógico e instalaciones sin navegar una portada superficial.',
  },
  {
    title: 'Coherencia entre comunicación y sistema',
    description:
      'El botón de iniciar sesión sigue visible y profesional, alineado con el uso real de la plataforma por parte del personal autorizado.',
  },
];

const programs = [
  {
    stage: 'Educación inicial',
    age: '3 a 5 años',
    title: 'Exploración guiada, lenguaje y desarrollo socioemocional.',
    description:
      'Ambientes seguros, juego intencionado y acompañamiento cercano para construir autonomía, curiosidad y hábitos tempranos de convivencia.',
  },
  {
    stage: 'Educación primaria',
    age: '6 a 11 años',
    title: 'Fundamentos académicos con seguimiento constante.',
    description:
      'Lectura comprensiva, pensamiento lógico, proyecto lector, ciencias y formación en ciudadanía con evaluación formativa permanente.',
  },
  {
    stage: 'Educación secundaria',
    age: '12 a 17 años',
    title: 'Profundización, criterio y proyección de futuro.',
    description:
      'Rigor académico, orientación vocacional, liderazgo estudiantil y preparación para trayectorias universitarias y técnicas.',
  },
];

const differentiators = [
  'Tutoría por etapas y seguimiento de avances individuales.',
  'Comunicación estructurada con familias desde la admisión hasta la continuidad escolar.',
  'Equipo docente acompañado por coordinación académica y trazabilidad operativa en Educa.',
  'Ruta pública y privada claramente separadas para proteger la gestión interna.',
];

const aboutCards = [
  {
    eyebrow: 'Quiénes somos',
    title: 'Una institución que combina exigencia académica, cuidado cotidiano y gobierno escolar ordenado.',
    description:
      'Educa no se presenta solo como un colegio con oferta por niveles. Se posiciona como una comunidad formativa con liderazgo directivo, procesos claros y una experiencia coherente para estudiantes, familias y equipo interno.',
  },
  {
    eyebrow: 'Propósito',
    title: 'Formar estudiantes con base intelectual, criterio humano y capacidad de responder al mundo real.',
    description:
      'Cada decisión pedagógica y organizacional busca sostener continuidad, hábitos de trabajo, convivencia respetuosa y preparación para el siguiente nivel.',
  },
];

const stats = [
  { value: '12:1', label: 'relación promedio de acompañamiento en espacios de tutoría y refuerzo' },
  { value: '87%', label: 'de participación familiar en reuniones, orientación y seguimiento institucional' },
  { value: '100%', label: 'de procesos académicos trazables para el equipo desde el acceso al sistema' },
  { value: '5 rutas', label: 'claras para informar, orientar, admitir, operar y dar continuidad escolar' },
];

const pedagogicalModel = [
  {
    title: 'Aprendizaje con intención',
    description:
      'Secuencias didácticas claras, metas observables y evaluación útil para mejorar, no solo para cerrar periodos.',
  },
  {
    title: 'Acompañamiento personalizado',
    description:
      'Seguimiento por etapas, tutoría y comunicación con familias cuando el estudiante necesita refuerzo o proyección adicional.',
  },
  {
    title: 'Convivencia que educa',
    description:
      'Normas consistentes, formación del carácter y trabajo socioemocional integrado a la vida diaria del colegio.',
  },
  {
    title: 'Uso pertinente de tecnología',
    description:
      'La plataforma Educa ordena la operación y la comunicación sin reemplazar el criterio pedagógico ni la cercanía humana.',
  },
];

const facilities = [
  {
    title: 'Campus diseñado para estudiar con calma',
    description: 'Aulas iluminadas, circulación segura y ambientes preparados para concentración, trabajo colaborativo y bienestar diario.',
  },
  {
    title: 'Biblioteca, laboratorio y espacios de proyecto',
    description: 'Infraestructura pensada para lectura, experimentación, investigación guiada y desarrollo de habilidades prácticas.',
  },
  {
    title: 'Áreas deportivas y de convivencia',
    description: 'Escenarios para actividad física, recreación y construcción de comunidad con acompañamiento responsable.',
  },
];

const admissionsSteps = [
  {
    step: '01',
    title: 'Conocer la propuesta institucional',
    description: 'La familia revisa niveles, modelo pedagógico, instalaciones y criterios que distinguen a Educa.',
  },
  {
    step: '02',
    title: 'Solicitar orientación o entrevista',
    description: 'El formulario centraliza el interés y permite organizar la atención del proceso con mejor trazabilidad.',
  },
  {
    step: '03',
    title: 'Continuar admisión y matrícula',
    description: 'La experiencia pública y el sistema interno se conectan para dar seguimiento sin perder orden institucional.',
  },
];

const contactItems = [
  { label: 'Admisiones', value: 'admisiones@educa.edu', note: 'Respuesta en horario institucional' },
  { label: 'Atención telefónica', value: '+57 (601) 555 0148', note: 'Lunes a viernes de 7:00 a.m. a 4:00 p.m.' },
  { label: 'Ubicación', value: 'Sede principal, corredor académico y deportivo', note: 'Visitas guiadas con agenda previa' },
];

export default function HomePage() {
  return (
    <main className="landing-root min-h-screen overflow-x-hidden text-slate-950">
      <div className="landing-noise" />

      <header className="landing-shell landing-header-shell">
        <div className="landing-topbar">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="landing-brand-mark">ED</span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-sky-700 sm:text-[11px]">
                Plataforma educativa
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
            <Link href="/registro?requestType=admision&context=landing" className="secondary-button hidden sm:inline-flex">
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
      </header>

      <section className="landing-shell landing-section-hero" aria-labelledby="hero-title">
        <div className="landing-hero-grid">
          <div className="landing-stack relative z-10">
            <div className="landing-kicker">Institución seria, admisiones claras y operación académica protegida</div>

            <h1 id="hero-title" className="landing-display max-w-5xl">
              Un landing institucional a la altura de Educa y del trabajo real de una comunidad educativa exigente.
            </h1>

            <p className="landing-lead max-w-3xl">
              La portada comunica dirección académica, vida escolar, oferta por etapas y una ruta de admisión concreta. Hacia
              adentro, el equipo conserva un acceso limpio al sistema para gestionar la operación diaria con orden y seguridad.
            </p>

            <div className="landing-actions-row">
              <Link href="/registro?requestType=admision&context=hero" className="primary-button w-full sm:w-auto">
                Agendar orientación de admisiones
              </Link>
              <Link href="#programas" className="secondary-button w-full sm:w-auto">
                Explorar la oferta académica
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
            <div className="landing-stage-shell">
              <div className="landing-stage-header">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/90">Perfil institucional</p>
                  <h2 className="landing-stage-title mt-4 max-w-md text-white">
                    Presencia pública rigurosa para proyectar confianza antes del primer contacto.
                  </h2>
                </div>
                <span className="landing-stage-chip">Acceso interno activo</span>
              </div>

              <div className="landing-stage-composition">
                <article className="landing-stage-feature landing-stage-feature-primary">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Dirección general</p>
                  <p className="landing-panel-title-lg mt-4 text-white">
                    Educa articula comunicación institucional, captación de interesados y operación académica sin perder sobriedad.
                  </p>
                  <p className="landing-panel-copy mt-4 text-white/78">
                    La estructura del landing ya no depende de bloques genéricos: ahora organiza información clave con jerarquía,
                    profundidad y mejores cierres de conversión.
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
        <div className="landing-band-grid">
          <header className="landing-band-primary">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-200">Métricas institucionales</p>
            <h2 id="metricas-title" className="landing-section-title mt-4 max-w-3xl text-white">
              Indicadores que refuerzan trayectoria, continuidad escolar y capacidad operativa.
            </h2>
          </header>

          <div className="landing-card-list-sm">
            {metrics.map((item) => (
              <article key={item.label} className="landing-band-card">
                <p className="landing-metric-value text-slate-950">{item.value}</p>
                <p className="landing-panel-copy mt-3 text-slate-700">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="landing-shell landing-section" aria-labelledby="beneficios-title">
        <div className="landing-section-grid">
          <article className="landing-large-surface">
            <p className="eyebrow">Beneficios clave</p>
            <h2 id="beneficios-title" className="landing-section-title landing-section-title-xl mt-4 text-slate-950">
              Una estructura potente para presentar a Educa con el nivel de seriedad que esperan las familias y el equipo directivo.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl">
              El landing se organiza como una experiencia institucional completa: explica, orienta, da contexto y conduce a la
              acción sin sacrificar claridad ni identidad educativa.
            </p>
          </article>

          <div className="landing-stack-sm">
            {benefits.map((item) => (
              <article key={item.title} className="landing-soft-card">
                <h3 className="landing-panel-title text-slate-950">{item.title}</h3>
                <p className="landing-panel-copy mt-3">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programas" className="landing-shell landing-section" aria-labelledby="programas-title">
        <div className="landing-offer-shell">
          <header>
            <p className="eyebrow">Programas y oferta</p>
            <h2 id="programas-title" className="landing-section-title mt-4 max-w-3xl text-slate-950">
              Trayectorias formativas articuladas para que cada etapa tenga continuidad, propósito y exigencia propia.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl">
              La oferta académica aparece como un recorrido integral, no como una lista suelta. Cada nivel comunica enfoque,
              edad de referencia y promesa formativa con lenguaje institucional concreto.
            </p>
          </header>

          <div className="landing-card-list-lg mt-8">
            {programs.map((item) => (
              <article key={item.stage} className="landing-offer-card">
                <span className="landing-offer-accent">{item.age}</span>
                <h3 className="landing-panel-title-lg mt-5 text-slate-950">{item.stage}</h3>
                <p className="mt-3 text-base font-medium leading-7 text-slate-800">{item.title}</p>
                <p className="landing-panel-copy mt-4">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-shell landing-section-tight" aria-labelledby="nosotros-title">
        <div className="landing-community-grid">
          <article className="landing-community-panel">
            <p className="eyebrow text-sky-200">Sobre nosotros</p>
            <h2 id="nosotros-title" className="landing-section-title mt-4 max-w-3xl text-white">
              Educa se presenta como una institución confiable, bien gobernada y centrada en la formación integral.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl text-slate-300">
              La combinación entre cultura escolar, rigor pedagógico y procesos consistentes permite proyectar una identidad más
              madura que la de un landing genérico de colegio o software.
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
        <div className="landing-experience-shell">
          <header>
            <p className="eyebrow">Estadísticas de gestión</p>
            <h2 id="estadisticas-title" className="landing-section-title mt-4 max-w-3xl text-slate-950">
              Datos presentados con lectura ejecutiva para respaldar confianza institucional y capacidad de seguimiento.
            </h2>
          </header>

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
        <div className="landing-section-grid">
          <article className="landing-large-surface">
            <p className="eyebrow">Modelo pedagógico</p>
            <h2 id="modelo-title" className="landing-section-title landing-section-title-xl mt-4 text-slate-950">
              Un enfoque pedagógico visible, bien explicado y conectado con la operación real del colegio.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl">
              Educa muestra cómo enseña, acompaña y evalúa. Esto ayuda a familias y aspirantes a entender el proyecto antes de
              iniciar admisión y permite que la plataforma tenga sentido dentro de la propuesta institucional.
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
        <div className="landing-cta-grid">
          <article className="landing-cta-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Admisiones</p>
            <h2 id="admisiones-title" className="landing-section-title landing-section-title-xl mt-4 max-w-2xl text-white">
              Un proceso visible para las familias y fácil de operar para el equipo que administra ingresos y continuidad escolar.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl text-slate-300">
              La portada conduce a una acción concreta, mientras el formulario y el acceso al sistema sostienen una experiencia
              ordenada desde la primera consulta hasta la gestión interna del caso.
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
        <div className="landing-section-grid">
          <article className="landing-large-surface">
            <p className="eyebrow">Contacto institucional</p>
            <h2 id="contacto-title" className="landing-section-title landing-section-title-xl mt-4 text-slate-950">
              Canales visibles para admisiones, visitas y orientación, sin perder el tono profesional del sitio.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl">
              Educa deja preparados puntos de contacto concretos para familias interesadas y mantiene una puerta de entrada
              independiente para quienes ya cuentan con credenciales de acceso al sistema.
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Cierre institucional</p>
            <h2 id="cta-final-title" className="landing-section-title mt-4 max-w-3xl text-white">
              Educa ahora comunica mejor lo que es hacia afuera y conserva una entrada clara al sistema hacia adentro.
            </h2>
            <p className="landing-section-copy mt-5 max-w-2xl text-slate-300">
              La nueva portada eleva el estándar visual y estructural del proyecto: más profundidad, mejor jerarquía y una
              experiencia coherente con una institución educativa seria.
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
                Plataforma e institución educativa orientadas a la excelencia académica, la relación con familias y la gestión
                segura de la operación escolar.
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
              <span className="text-slate-500">Sitio institucional en español</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
