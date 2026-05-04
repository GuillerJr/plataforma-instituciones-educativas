'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Programas', href: '#programas' },
  { label: 'Modelo', href: '#modelo' },
  { label: 'Campus', href: '#instalaciones' },
  { label: 'Admisiones', href: '#admisiones' },
  { label: 'Contacto', href: '#contacto' },
];

const benefits = [
  {
    icon: '📚',
    bg: 'bg-eduSky',
    title: 'Excelencia académica',
    description:
      'Currículo actualizado, seguimiento continuo y una experiencia formativa que combina exigencia, orden y cercanía.',
  },
  {
    icon: '👩‍🏫',
    bg: 'bg-amber-50',
    title: 'Docentes expertos',
    description:
      'Equipo preparado en metodologías activas, uso responsable de tecnología educativa y acompañamiento institucional.',
  },
  {
    icon: '🧠',
    bg: 'bg-eduMint',
    title: 'Acompañamiento real',
    description:
      'Tutorías, seguimiento por etapas y comunicación clara con las familias durante todo el proceso escolar.',
  },
  {
    icon: '🚀',
    bg: 'bg-blue-50',
    title: 'Innovación aplicada',
    description:
      'Proyectos STEAM, laboratorios y herramientas digitales integradas con una operación escolar seria.',
  },
];

const programs = [
  {
    emoji: '🧸',
    gradient: 'from-blue-100 via-white to-sky-100',
    label: 'Educación inicial',
    title: 'Primeros descubrimientos',
    description:
      'Desarrollo socioemocional, lenguaje, creatividad y autonomía en un entorno seguro y cuidadosamente acompañado.',
    tags: ['Juego', 'Creatividad', 'Autonomía'],
  },
  {
    emoji: '📘',
    gradient: 'from-amber-100 via-white to-blue-100',
    label: 'Educación básica',
    title: 'Bases sólidas',
    description:
      'Lectura comprensiva, pensamiento lógico, inglés, hábitos de estudio y formación en valores con seguimiento continuo.',
    tags: ['Lectura', 'Inglés', 'Valores'],
  },
  {
    emoji: '🎓',
    gradient: 'from-green-100 via-white to-blue-100',
    label: 'Bachillerato',
    title: 'Preparación futura',
    description:
      'Liderazgo, investigación, orientación vocacional y preparación rigurosa para universidad y proyectos de vida.',
    tags: ['Liderazgo', 'STEAM', 'Universidad'],
  },
];

const testimonials = [
  {
    quote:
      'Desde el primer contacto se nota organización, seriedad y una propuesta académica que transmite confianza a las familias.',
    initial: 'M',
    badge: 'bg-eduBlue',
    name: 'María Fernanda',
    role: 'Madre de familia',
  },
  {
    quote:
      'Me gusta que aquí el aprendizaje se conecta con proyectos, tecnología y una preparación real para el siguiente nivel.',
    initial: 'D',
    badge: 'bg-eduGreen',
    name: 'Daniel Ortega',
    role: 'Estudiante',
  },
  {
    quote:
      'Educa combina instalaciones modernas, trato cercano y una estructura institucional que se siente bien pensada.',
    initial: 'A',
    badge: 'bg-eduGold text-eduNavy',
    name: 'Andrés Salazar',
    role: 'Padre de familia',
  },
];

const facilities = [
  {
    emoji: '💻',
    className: 'dark-panel text-white shadow-premium',
    title: 'Aulas digitales',
    description: 'Pantallas interactivas, plataformas educativas y recursos multimedia al servicio de la clase.',
  },
  {
    emoji: '🔬',
    className: 'bg-blue-50 shadow-soft',
    title: 'Laboratorios',
    description: 'Ciencia, robótica, experimentación e innovación con espacios preparados para práctica real.',
  },
  {
    emoji: '🌿',
    className: 'bg-green-50 shadow-soft',
    title: 'Áreas verdes',
    description: 'Espacios de bienestar, recreación y convivencia estudiantil dentro de una jornada equilibrada.',
  },
  {
    emoji: '🏀',
    className: 'bg-amber-50 shadow-soft',
    title: 'Deporte y cultura',
    description: 'Clubes, canchas, talleres y actividades extracurriculares para formación integral.',
  },
];

const admissionSteps = [
  {
    number: '1',
    title: 'Solicita información',
    description: 'Completa el formulario o agenda una llamada con nuestro equipo institucional.',
    badge: 'bg-eduBlue',
  },
  {
    number: '2',
    title: 'Visita el campus',
    description: 'Conoce instalaciones, metodología, niveles académicos y propuesta formativa.',
    badge: 'bg-eduBlue',
  },
  {
    number: '3',
    title: 'Evaluación y entrevista',
    description: 'Revisamos nivel académico, contexto familiar y necesidades de acompañamiento.',
    badge: 'bg-eduBlue',
  },
  {
    number: '4',
    title: 'Formaliza la matrícula',
    description: 'Recibe lineamientos, documentación y acceso al proceso de continuidad institucional.',
    badge: 'bg-eduGreen',
  },
];

const contactDetails = [
  {
    emoji: '📍',
    wrapper: 'bg-eduSky text-eduBlue',
    title: 'Dirección',
    value: 'Campus Educa, corredor académico principal, Guayaquil',
  },
  {
    emoji: '📞',
    wrapper: 'bg-eduMint text-eduGreen',
    title: 'Teléfono',
    value: '+593 99 123 4567',
  },
  {
    emoji: '✉️',
    wrapper: 'bg-amber-50 text-eduNavy',
    title: 'Correo',
    value: 'admisiones@educa.hacktrickstore.com',
  },
];

const fadeUpSections = [
  'landing-hero-copy',
  'landing-hero-visual',
  'landing-benefits-head',
  'landing-programs-head',
  'landing-about-visual',
  'landing-about-copy',
  'landing-stats-grid',
  'landing-model-head',
  'landing-testimonials-head',
  'landing-installations-head',
  'landing-admissions-copy',
  'landing-admissions-card',
  'landing-contact-copy',
  'landing-contact-form',
  'landing-final-cta-block',
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.fade-up'));

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute('data-fade-key');
            if (key) {
              setVisibleSections((prev) => (prev.includes(key) ? prev : [...prev, key]));
            }
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const isVisible = (key: string) => visibleSections.includes(key);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-eduText">
      <header className="fixed left-0 right-0 top-0 z-50 header-glass">
        <div className="container-page">
          <div className="flex h-20 items-center justify-between gap-6">
            <Link href="#inicio" className="flex shrink-0 items-center gap-3" aria-label="Ir al inicio">
              <div className="dark-panel flex h-12 w-12 items-center justify-center rounded-2xl shadow-glow">
                <span className="text-xl font-black text-white">E</span>
              </div>
              <div>
                <h1 className="text-xl font-black leading-none text-eduNavy">Educa</h1>
                <p className="mt-1 text-xs font-bold text-slate-500">Excelencia académica con dirección institucional</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-bold lg:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link href="/registro?requestType=informacion&context=header" className="btn-secondary px-5 py-3 text-sm">
                Solicitar información
              </Link>
              <Link href="/login" className="btn-primary px-6 py-3 text-sm">
                Iniciar sesión
              </Link>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-eduSky text-eduBlue lg:hidden"
              aria-label="Abrir menú"
              onClick={() => setMobileMenuOpen((value) => !value)}
            >
              <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className={`mobile-menu lg:hidden ${mobileMenuOpen ? 'active' : ''}`}>
            <nav className="flex flex-col gap-4 pb-6 text-sm font-bold text-slate-700">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href="/login" className="btn-secondary px-6 py-3" onClick={() => setMobileMenuOpen(false)}>
                Iniciar sesión
              </Link>
              <Link
                href="/registro?requestType=admision&context=mobile-menu"
                className="btn-primary mt-2 px-6 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inscríbete ahora
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section id="inicio" className="hero-bg pb-20 pt-32 lg:pb-28 lg:pt-40">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className={`fade-up ${isVisible(fadeUpSections[0]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[0]}
          >
            <div className="section-label mb-7">
              <span className="h-2.5 w-2.5 rounded-full bg-eduGreen"></span>
              Matrículas abiertas · Periodo académico 2026
            </div>

            <h2 className="text-4xl font-black leading-[1.03] tracking-tight text-eduNavy md:text-6xl lg:text-7xl">
              Educación moderna para formar líderes con propósito.
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              En Educa impulsamos el talento de cada estudiante mediante excelencia académica, tecnología educativa,
              valores, acompañamiento cercano a las familias y acceso institucional ordenado al sistema.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/registro?requestType=admision&context=hero" className="btn-primary px-8 py-4">
                Inscríbete ahora
              </Link>
              <Link href="#contacto" className="btn-secondary px-8 py-4">
                Agenda una visita
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-soft">
                <p className="text-3xl font-black text-eduBlue">25+</p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Años de experiencia</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-soft">
                <p className="text-3xl font-black text-eduBlue">1.800+</p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Estudiantes activos</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-soft">
                <p className="text-3xl font-black text-eduBlue">96%</p>
                <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">Satisfacción familiar</p>
              </div>
            </div>
          </div>

          <div
            className={`fade-up ${isVisible(fadeUpSections[1]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[1]}
          >
            <div className="floating relative hero-visual-card rounded-5xl border border-white bg-white p-4 shadow-premium sm:p-6">
              <div className="dark-panel flex h-full min-h-[500px] flex-col justify-between overflow-hidden rounded-4xl p-6 sm:p-8 lg:min-h-[520px]">
                <div className="relative z-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-white/65">Campus inteligente</p>
                      <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">Aprendizaje integral</h3>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/12">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4L21 9L12 14L3 9L12 4Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M6 11.5V16C6 17.7 8.7 19.2 12 19.2C15.3 19.2 18 17.7 18 16V11.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {[
                      ['🎓', 'Excelencia', 'Alto rendimiento académico'],
                      ['💡', 'Innovación', 'Tecnología y proyectos STEAM'],
                      ['🤝', 'Cercanía', 'Acompañamiento personalizado'],
                      ['🌎', 'Visión global', 'Idiomas, valores y liderazgo'],
                    ].map(([icon, title, copy]) => (
                      <div key={title} className="rounded-3xl border border-white/15 bg-white/12 p-5">
                        <div className="mb-4 text-4xl">{icon}</div>
                        <h4 className="font-black text-white">{title}</h4>
                        <p className="mt-1 text-sm text-white/65">{copy}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-7 rounded-3xl bg-white p-5 shadow-soft">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-sm font-black text-slate-500">Indicador institucional</p>
                      <p className="mt-1 text-2xl font-black text-eduNavy">96% satisfacción</p>
                      <p className="mt-1 text-sm text-slate-500">Familias recomiendan nuestra propuesta.</p>
                    </div>
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-eduSky">
                      <span className="text-xl font-black text-eduBlue">96</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="bg-white py-20">
        <div className="container-page">
          <div
            className={`fade-up mx-auto mb-14 max-w-3xl text-center ${isVisible(fadeUpSections[2]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[2]}
          >
            <span className="section-label">⭐ ¿Por qué elegirnos?</span>
            <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">
              Una educación pensada para desarrollar potencial real
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Combinamos formación académica, tecnología, habilidades humanas y seguimiento personalizado para que cada
              estudiante avance con seguridad.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <article key={item.title} className="card fade-up rounded-4xl p-7 show">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-4xl ${item.bg}`}>{item.icon}</div>
                <h3 className="text-xl font-black text-eduNavy">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programas" className="decor-grid bg-eduSoft py-20">
        <div className="container-page">
          <div
            className={`fade-up mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${isVisible(fadeUpSections[3]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[3]}
          >
            <div className="max-w-3xl">
              <span className="section-label">🎒 Programas académicos</span>
              <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">
                Formación integral para cada etapa de crecimiento
              </h2>
            </div>

            <Link href="#contacto" className="btn-primary px-7 py-4">
              Solicitar información
            </Link>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {programs.map((program) => (
              <article key={program.label} className="card fade-up overflow-hidden rounded-5xl show">
                <div className={`flex h-52 items-center justify-center bg-gradient-to-br ${program.gradient}`}>
                  <span className="text-8xl">{program.emoji}</span>
                </div>
                <div className="p-8">
                  <p className="text-sm font-black uppercase tracking-wider text-eduBlue">{program.label}</p>
                  <h3 className="mt-2 text-2xl font-black text-eduNavy">{program.title}</h3>
                  <p className="mt-4 leading-relaxed text-slate-600">{program.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {program.tags.map((tag, index) => (
                      <span
                        key={tag}
                        className={[
                          'rounded-full px-3 py-2 text-xs font-black',
                          index === 0 && 'bg-blue-50 text-eduBlue',
                          index === 1 && 'bg-green-50 text-eduGreen',
                          index === 2 && 'bg-amber-50 text-amber-600',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className={`fade-up ${isVisible(fadeUpSections[4]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[4]}
          >
            <div className="grid grid-cols-2 gap-5">
              <div className="dark-panel flex min-h-[230px] flex-col justify-between rounded-4xl p-7 text-white shadow-premium">
                <p className="text-6xl">🏫</p>
                <div>
                  <h3 className="text-2xl font-black">Campus seguro</h3>
                  <p className="mt-2 text-white/65">Ambientes diseñados para aprender y convivir.</p>
                </div>
              </div>
              <div className="flex min-h-[230px] flex-col justify-between rounded-4xl bg-blue-50 p-7 shadow-soft">
                <p className="text-6xl">🔬</p>
                <div>
                  <h3 className="text-2xl font-black text-eduNavy">Laboratorios</h3>
                  <p className="mt-2 text-slate-600">Ciencia, robótica y tecnología aplicada.</p>
                </div>
              </div>
              <div className="flex min-h-[230px] flex-col justify-between rounded-4xl bg-amber-50 p-7 shadow-soft">
                <p className="text-6xl">🎨</p>
                <div>
                  <h3 className="text-2xl font-black text-eduNavy">Arte y cultura</h3>
                  <p className="mt-2 text-slate-600">Creatividad, expresión y sensibilidad social.</p>
                </div>
              </div>
              <div className="flex min-h-[230px] flex-col justify-between rounded-4xl bg-green-50 p-7 shadow-soft">
                <p className="text-6xl">⚽</p>
                <div>
                  <h3 className="text-2xl font-black text-eduNavy">Deporte</h3>
                  <p className="mt-2 text-slate-600">Disciplina, bienestar y trabajo en equipo.</p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="nosotros"
            className={`fade-up ${isVisible(fadeUpSections[5]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[5]}
          >
            <span className="section-label">💙 Sobre nosotros</span>
            <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">
              Educamos con excelencia, humanidad e innovación
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Educa forma estudiantes íntegros, creativos y seguros de sí mismos. Nuestro enfoque combina conocimiento,
              valores, pensamiento crítico, trazabilidad institucional y herramientas digitales para acompañar a cada familia.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-4xl border border-slate-100 bg-eduSoft p-6">
                <h3 className="text-xl font-black text-eduNavy">Misión</h3>
                <p className="mt-3 text-slate-600">
                  Formar estudiantes autónomos, responsables y capaces de aprender durante toda la vida.
                </p>
              </div>
              <div className="rounded-4xl border border-slate-100 bg-eduSoft p-6">
                <h3 className="text-xl font-black text-eduNavy">Visión</h3>
                <p className="mt-3 text-slate-600">
                  Ser una institución referente por calidad académica, innovación y formación humana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dark-panel py-16">
        <div className="container-page">
          <div
            className={`fade-up grid grid-cols-2 gap-5 lg:grid-cols-4 ${isVisible(fadeUpSections[6]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[6]}
          >
            {[
              ['1.800+', 'Estudiantes activos'],
              ['120+', 'Docentes capacitados'],
              ['25', 'Años de experiencia'],
              ['96%', 'Satisfacción familiar'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-4xl border border-white/15 bg-white/10 p-7 text-center">
                <p className="text-4xl font-black text-white md:text-5xl">{value}</p>
                <p className="mt-2 font-bold text-white/65">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modelo" className="bg-white py-20">
        <div className="container-page">
          <div
            className={`fade-up mx-auto mb-14 max-w-3xl text-center ${isVisible(fadeUpSections[7]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[7]}
          >
            <span className="section-label">🧩 Modelo pedagógico</span>
            <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">Aprender haciendo, pensando y creando</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Nuestro modelo combina aprendizaje basado en proyectos, tecnología, pensamiento crítico, comunicación y
              retroalimentación continua.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['🔎', 'Explorar', 'Los estudiantes investigan problemas reales y formulan preguntas significativas.', 'bg-blue-50'],
              ['🛠️', 'Crear', 'Diseñan soluciones, prototipos, proyectos colaborativos y experiencias prácticas.', 'bg-amber-50'],
              ['💬', 'Comunicar', 'Presentan ideas con seguridad, claridad, criterio y argumentación.', 'bg-green-50'],
              ['📈', 'Mejorar', 'Reciben retroalimentación constante para fortalecer su aprendizaje.', 'bg-sky-50'],
            ].map(([icon, title, copy, bg]) => (
              <article key={title} className="card fade-up rounded-4xl p-7 show">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-4xl ${bg}`}>{icon}</div>
                <h3 className="text-xl font-black text-eduNavy">{title}</h3>
                <p className="mt-3 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="decor-grid bg-eduSoft py-20">
        <div className="container-page">
          <div
            className={`fade-up mx-auto mb-14 max-w-3xl text-center ${isVisible(fadeUpSections[8]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[8]}
          >
            <span className="section-label bg-white">💬 Testimonios</span>
            <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">
              Familias que confían en nuestra propuesta educativa
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="card fade-up rounded-4xl p-8 show">
                <div className="mb-5 text-xl text-eduGold">★★★★★</div>
                <p className="leading-relaxed text-slate-600">“{testimonial.quote}”</p>
                <div className="mt-7 flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full font-black text-white ${testimonial.badge}`}>
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-black text-eduNavy">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="instalaciones" className="bg-white py-20">
        <div className="container-page">
          <div
            className={`fade-up mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${isVisible(fadeUpSections[9]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[9]}
          >
            <div className="max-w-3xl">
              <span className="section-label">🏛️ Campus e instalaciones</span>
              <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">Espacios diseñados para aprender mejor</h2>
            </div>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              Ambientes seguros, modernos y equipados para ciencia, tecnología, arte, deporte y convivencia.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility) => (
              <article
                key={facility.title}
                className={`fade-up flex min-h-[260px] flex-col justify-between rounded-4xl p-7 show ${facility.className}`}
              >
                <p className="text-6xl">{facility.emoji}</p>
                <div>
                  <h3 className={`text-2xl font-black ${facility.className.includes('text-white') ? 'text-white' : 'text-eduNavy'}`}>
                    {facility.title}
                  </h3>
                  <p className={`mt-3 ${facility.className.includes('text-white') ? 'text-white/65' : 'text-slate-600'}`}>
                    {facility.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="admisiones" className="bg-eduSoft py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className={`fade-up ${isVisible(fadeUpSections[10]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[10]}
          >
            <span className="section-label">📝 Admisiones</span>
            <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">Un proceso claro, humano y acompañado</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Nuestro equipo de admisiones te acompaña en cada paso para que conozcas la institución, resuelvas tus dudas y
              tomes una decisión segura para tu familia.
            </p>

            <div className="mt-8 space-y-5">
              {admissionSteps.map((step) => (
                <div key={step.number} className="flex gap-5 rounded-4xl bg-white p-5 shadow-soft">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-white ${step.badge}`}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-eduNavy">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`fade-up dark-panel rounded-5xl p-8 text-white shadow-premium lg:p-10 ${isVisible(fadeUpSections[11]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[11]}
          >
            <p className="font-black text-white/65">Cupos limitados</p>
            <h3 className="mt-3 text-3xl font-black md:text-4xl">Admisiones abiertas para el nuevo periodo académico</h3>
            <p className="mt-5 leading-relaxed text-white/70">
              Agenda una visita personalizada y descubre cómo podemos acompañar el crecimiento académico y humano de tu hijo.
            </p>

            <div className="mt-8 rounded-4xl border border-white/15 bg-white/10 p-6">
              <h4 className="text-xl font-black">Tu visita incluye:</h4>
              <ul className="mt-5 space-y-3 text-white/75">
                <li>✅ Recorrido por el campus</li>
                <li>✅ Entrevista con admisiones</li>
                <li>✅ Información de costos y continuidad</li>
                <li>✅ Revisión del programa académico</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link href="/registro?requestType=admision&context=admisiones" className="btn-gold w-full px-8 py-4">
                Solicitar admisión
              </Link>
              <Link href="/login" className="btn-secondary w-full border-white/15 bg-white/10 px-8 py-4 text-white hover:text-white">
                Iniciar sesión al sistema
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="bg-white py-20">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            className={`fade-up ${isVisible(fadeUpSections[12]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[12]}
          >
            <span className="section-label">📩 Contacto</span>
            <h2 className="mt-5 text-3xl font-black text-eduNavy md:text-5xl">Da el primer paso hacia una mejor educación</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Completa el formulario y nuestro equipo institucional se comunicará contigo para brindarte información
              personalizada sobre admisiones, visitas y continuidad.
            </p>

            <div className="mt-9 space-y-5">
              {contactDetails.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${item.wrapper}`}>
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="font-black text-eduNavy">{item.title}</h3>
                    <p className="text-slate-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            className={`fade-up rounded-5xl border border-slate-100 bg-eduSoft p-6 shadow-soft md:p-8 ${isVisible(fadeUpSections[13]) ? 'show' : ''}`}
            data-fade-key={fadeUpSections[13]}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-eduNavy">Nombre completo</label>
                <input type="text" className="input-field" placeholder="Ej. Carlos Andrade" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-black text-eduNavy">Correo electrónico</label>
                <input type="email" className="input-field" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-black text-eduNavy">Teléfono</label>
                <input type="tel" className="input-field" placeholder="+593 99 000 0000" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-black text-eduNavy">Programa de interés</label>
                <select className="input-field" defaultValue="">
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  <option>Educación Inicial</option>
                  <option>Educación Básica</option>
                  <option>Bachillerato</option>
                  <option>Visita al campus</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-black text-eduNavy">Mensaje</label>
              <textarea rows={5} className="input-field resize-none" placeholder="Cuéntanos qué información necesitas..." />
            </div>

            <Link href="/registro?requestType=contacto&context=formulario" className="btn-primary mt-6 w-full px-8 py-4">
              Enviar solicitud
            </Link>

            <p className="mt-4 text-center text-xs text-slate-500">
              Al continuar, nuestro equipo podrá orientarte y darte seguimiento institucional.
            </p>
          </form>
        </div>
      </section>

      <section className="dark-panel py-16">
        <div
          className={`container-page fade-up text-center ${isVisible(fadeUpSections[14]) ? 'show' : ''}`}
          data-fade-key={fadeUpSections[14]}
        >
          <h2 className="text-3xl font-black text-white md:text-5xl">El futuro de tu hijo empieza con una gran decisión</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
            Forma parte de una comunidad educativa que inspira, acompaña y prepara estudiantes para liderar con propósito.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/registro?requestType=informacion&context=cta-final" className="btn-gold px-8 py-4">
              Solicita información
            </Link>
            <Link href="/login" className="btn-secondary px-8 py-4">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#061326] pb-8 pt-16 text-white">
        <div className="container-page">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="blue-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black">E</div>
                <div>
                  <h3 className="text-xl font-black">Educa</h3>
                  <p className="text-sm font-bold text-white/45">Excelencia académica con proyección institucional</p>
                </div>
              </div>

              <p className="mt-5 leading-relaxed text-white/55">
                Institución educativa moderna enfocada en excelencia académica, innovación, seguimiento y operación escolar
                conectada con su sistema interno.
              </p>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-black">Enlaces rápidos</h4>
              <ul className="space-y-3 text-white/55">
                <li><Link href="#inicio" className="transition hover:text-white">Inicio</Link></li>
                <li><Link href="#beneficios" className="transition hover:text-white">Beneficios</Link></li>
                <li><Link href="#programas" className="transition hover:text-white">Programas</Link></li>
                <li><Link href="#modelo" className="transition hover:text-white">Modelo pedagógico</Link></li>
                <li><Link href="#contacto" className="transition hover:text-white">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-black">Programas</h4>
              <ul className="space-y-3 text-white/55">
                <li>Educación Inicial</li>
                <li>Educación Básica</li>
                <li>Bachillerato</li>
                <li>Clubes extracurriculares</li>
                <li>Orientación vocacional</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-black">Acceso y contacto</h4>
              <ul className="space-y-3 text-white/55">
                <li>📍 Campus Educa, Guayaquil</li>
                <li>📞 +593 99 123 4567</li>
                <li>✉️ admisiones@educa.hacktrickstore.com</li>
              </ul>

              <div className="mt-6 flex gap-3">
                <Link href="/login" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-black transition hover:bg-eduBlue">in</Link>
                <Link href="/registro?requestType=informacion&context=footer" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-black transition hover:bg-eduBlue">i</Link>
                <Link href="#contacto" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-black transition hover:bg-eduBlue">c</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 md:flex-row">
            <p>© {currentYear} Educa. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="#" className="transition hover:text-white">Política de privacidad</Link>
              <Link href="#" className="transition hover:text-white">Términos y condiciones</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
