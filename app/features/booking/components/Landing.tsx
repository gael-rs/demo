'use client';

import { useState } from 'react';
import { useBooking } from '@/app/context';
import PropertyShowcase from '@/app/features/properties/components/PropertyShowcase';
import ShinyText from '@/app/shared/components/ShinyText';
import FadeContent from '@/app/shared/components/FadeContent';
import CountUp from '@/app/shared/components/CountUp';
import SplitText from '@/app/shared/components/SplitText';
import ScrollVelocity from '@/app/shared/components/ScrollVelocity';

export default function Landing() {
  const { goToStep, currency, convertPrice } = useBooking();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [simDays, setSimDays] = useState(30);

  const PRICING_TIERS = [
    { min: 1,  max: 7,   multiplier: 0.10,   label: '1–7 días'    },
    { min: 8,  max: 15,  multiplier: 0.08,   label: '8–15 días'   },
    { min: 16, max: 30,  multiplier: 0.06,   label: '16–30 días'  },
    { min: 31, max: 60,  multiplier: 0.033,  label: '31–60 días'  },
    { min: 61, max: 90,  multiplier: 0.0315, label: '61–90 días'  },
    { min: 91, max: 365, multiplier: 0.03,   label: '91–365 días' },
  ];
  const BASE_PRICE = 360000;
  const simTier = PRICING_TIERS.find(t => simDays >= t.min && simDays <= t.max) ?? PRICING_TIERS[PRICING_TIERS.length - 1];
  const simPricePerDayClp = Math.round(BASE_PRICE * simTier.multiplier);
  const simTotalClp = simPricePerDayClp * simDays;
  const simPriceDisplay = convertPrice(simPricePerDayClp);
  const simTotalDisplay = convertPrice(simTotalClp);

  const handleCtaClick = () => goToStep('unit-selection');

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="overflow-hidden bg-slate-900">

        {/* ── MOBILE: full-screen con gradiente desde abajo ── */}
        <div className="md:hidden relative h-screen min-h-[600px]">
          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/hero.png')" }}
          />
          {/* Overlay uniforme para legibilidad en todo el hero */}
          <div className="absolute inset-0 bg-slate-900/60" />
          {/* Gradiente lateral izquierdo para reforzar el texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
          {/* Fade superior para el header */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-transparent pointer-events-none" />

          {/* Contenido centrado */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 pt-20 pb-8">
            <div className="mb-6">
              <p className="text-4xl font-bold text-white leading-[1.05] mb-2">
                Entra a vivir en minutos.
              </p>
              <ShinyText
                text="Sin papeleo, sin intermediarios, sin fricción."
                className="text-base leading-snug"
                color="#94a3b8" shineColor="#e8f0fe"
                speed={3} delay={9} spread={90} initialOffset={0}
              />
            </div>
            <div className="mb-8">
              <p className="text-4xl font-bold text-emerald-400 leading-[1.05] mb-2">
                Quédate el tiempo que quieras.
              </p>
              <ShinyText
                text="Un hogar que se adapta a tu etapa, no al revés."
                className="text-base leading-snug"
                color="#94a3b8" shineColor="#e8f0fe"
                speed={3} delay={9} spread={90} initialOffset={9}
              />
            </div>
            <button
              onClick={handleCtaClick}
              className="w-full px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-colors active:scale-[0.98] shadow-lg shadow-emerald-500/25"
            >
              Entrar a vivir
            </button>
            <p className="mt-6 text-slate-400 text-xs tracking-widest uppercase">
              Housing as a Living — Una nueva forma de habitar.
            </p>
          </div>
        </div>

        {/* ── DESKTOP: hero full-screen con gradiente ── */}
        <div className="hidden md:block relative h-screen min-h-[640px]">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/hero.png')" }}
          />
          {/* Gradient: opaco izquierda → transparente derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          {/* Fade superior para el header */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-transparent" />

          {/* Contenido centrado verticalmente */}
          <div className="relative z-10 flex items-center h-full w-full max-w-7xl mx-auto px-16 lg:px-20 pt-20">
            <div>
              <div className="mb-14">
                <SplitText
                  text="Entra a vivir en minutos"
                  tag="p"
                  className="text-4xl lg:text-5xl font-bold text-white leading-[1.05] mb-2"
                  splitType="words"
                  duration={0.7}
                  delay={80}
                  from={{ opacity: 0, y: 24 }}
                  to={{ opacity: 1, y: 0 }}
                />
                <ShinyText
                  text="Sin papeleo, sin intermediarios, sin fricción"
                  className="text-4xl lg:text-2xl font-medium leading-[1.35]"
                  color="#94a3b8" shineColor="#e8f0fe"
                  speed={3} delay={9} spread={90} initialOffset={0}
                />
              </div>
              <div className="mb-10">
                <SplitText
                  text="Quédate el tiempo que quieras"
                  tag="p"
                  className="text-4xl lg:text-5xl font-bold text-emerald-400 leading-[1.05] mb-2"
                  splitType="words"
                  duration={0.7}
                  delay={80}
                  from={{ opacity: 0, y: 24 }}
                  to={{ opacity: 1, y: 0 }}
                />
                <ShinyText
                  text="Un hogar que se adapta a tu etapa, no al revés"
                  className="text-4xl lg:text-2xl font-medium leading-[1.35]"
                  color="#94a3b8" shineColor="#e8f0fe"
                  speed={3} delay={9} spread={90} initialOffset={9}
                />
              </div>
              <button
                onClick={handleCtaClick}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-colors active:scale-[0.98] shadow-lg shadow-emerald-500/25"
              >
                Entrar a vivir
              </button>
              <p className="mt-8 text-slate-300 text-sm tracking-wider">
                Housing as a Living | Una nueva forma de habitar
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Marquee strip */}
      <div className="py-5 bg-slate-800 border-y border-slate-700/40 overflow-hidden">
        <ScrollVelocity
          baseVelocity={4}
          className="text-slate-500 text-xs font-semibold tracking-widest uppercase"
        >
          Sin papeleo&nbsp;&nbsp;·&nbsp;&nbsp;Sin intermediarios&nbsp;&nbsp;·&nbsp;&nbsp;Sin fricción&nbsp;&nbsp;·&nbsp;&nbsp;Housing as a Living&nbsp;&nbsp;·&nbsp;&nbsp;Acceso digital&nbsp;&nbsp;·&nbsp;&nbsp;Sin garantías&nbsp;&nbsp;·&nbsp;&nbsp;
        </ScrollVelocity>
      </div>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-slate-800/50">
        <FadeContent duration={800} className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">
              <CountUp to={3} duration={2} />
              <span> min</span>
            </p>
            <p className="text-slate-400 text-sm mt-1">Regístrate y activa tu acceso</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">0</p>
            <p className="text-slate-400 text-sm mt-1">Documentación sin intermediarios</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">24/7</p>
            <p className="text-slate-400 text-sm mt-1">Acceso digital</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">
              <CountUp to={100} duration={2.5} />
              <span>%</span>
            </p>
            <p className="text-slate-400 text-sm mt-1">Ahorro por día en estadías largas</p>
          </div>
        </FadeContent>
      </section>

      {/* Property Showcase */}
      <section className="py-20 px-6 bg-slate-900">
        <FadeContent duration={900} blur>
          <PropertyShowcase />
        </FadeContent>
      </section>

      {/* How it Works Section — fondo continuo con PropertyShowcase */}
      <section id="como-funciona" className="py-24 px-6 bg-slate-800/50">
        <FadeContent duration={800} className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">¿Cómo funciona Homested?</h2>
            <p className="text-slate-500 text-base">Cuatro pasos simples para empezar tu próxima etapa</p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Elige tu espacio',
                desc: 'Explora las opciones disponibles y encuentra el ideal para ti.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Define tu estadía',
                desc: 'Elige cuánto tiempo quieres quedarte. Mientras más tiempo te quedes, más ahorras.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Confirma tu estadía',
                desc: 'Acepta los términos y realiza el pago. Todo 100% digital.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                step: '04',
                title: 'Entra a vivir',
                desc: 'Recibe código de acceso en tu correo y entra cuando quieras.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="group relative bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/40 hover:bg-slate-800 transition-all duration-300">
                {/* Step badge + icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider">
                    {item.step}
                  </span>
                  <span className="text-slate-600 group-hover:text-emerald-500/60 transition-colors">
                    {item.icon}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>

                {/* Emerald bottom accent on hover */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-emerald-500/0 group-hover:bg-emerald-500/30 transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </FadeContent>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 px-6 bg-slate-900">
        <FadeContent duration={800} className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">¿Por qué Homested?</h2>
            <p className="text-slate-500 text-base">Una nueva forma de habitar</p>
          </div>

          {/* Grid 3 cols */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Sin papeleo',
                desc: 'Olvídate de los trámites, documentación o avales. Empieza en minutos.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                ),
                title: 'Acceso digital',
                desc: 'Recibe un código único para entrar a tu espacio. Sin llaves físicas.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'Directo y transparente',
                desc: 'Sin intermediarios ni negociaciones. Todo claro desde el principio.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: 'Pago único',
                desc: 'Espacios amoblados con servicios básicos incluidos. Llegas y te instalas.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: 'Flexible',
                desc: 'Extiende tu estadía cuando quieras. Tu tiempo, tus reglas.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: 'Mientras más tiempo, menos pagas',
                desc: 'Cuanto más tiempo te quedes, menor es el costo por día.',
                featured: true,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl p-6 border transition-all duration-300 ${
                  item.featured
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/15'
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${
                  item.featured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/60 text-slate-400 group-hover:text-slate-300'
                }`}>
                  {item.icon}
                </div>
                <h3 className={`font-semibold text-sm mb-1.5 ${item.featured ? 'text-emerald-300' : 'text-white'}`}>
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeContent>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 px-6 bg-slate-800/50">
        <FadeContent duration={800} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Así funciona nuestro sistema de precios</h2>
            <p className="text-slate-400 text-base">Mientras más te quedes, más ahorras</p>
          </div>

          {/* Simulador */}
          <div className="mb-6 bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">Simulador de precio</p>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Input días */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-semibold text-sm">¿Cuántos días te quedas?</label>
                  <span className="text-emerald-400 font-bold text-lg">{simDays} días</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={365}
                  value={simDays}
                  onChange={(e) => setSimDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-slate-500 text-xs mt-1">
                  <span>1 día</span>
                  <span>365 días</span>
                </div>
              </div>

              {/* Resultado */}
              <div className="flex items-center gap-6 md:border-l md:border-slate-700 md:pl-6">
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">{simTier.label} · precio/día</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-emerald-400 font-black text-3xl">
                      ${simPriceDisplay.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}
                    </span>
                    <span className="text-slate-400 text-sm">{currency}/día</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Total estimado</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-xl">
                      ${simTotalDisplay.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}
                    </span>
                    <span className="text-slate-400 text-xs">{currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { range: '1–7 días',     multiplier: 0.10   },
                { range: '8–15 días',    multiplier: 0.08   },
                { range: '16–30 días',   multiplier: 0.06   },
                { range: '31–60 días',   multiplier: 0.033  },
                { range: '61–90 días',   multiplier: 0.0315 },
                { range: '91–365 días',  multiplier: 0.03,  best: true },
              ].map((tier, index) => {
                const priceClp = Math.round(360000 * tier.multiplier);
                const displayPrice = convertPrice(priceClp);
                return (
                  <div
                    key={index}
                    className={`relative p-4 rounded-xl text-center ${
                      tier.best
                        ? 'bg-emerald-500/10 border-2 border-emerald-500/60'
                        : 'bg-slate-700/50 border border-slate-700'
                    }`}
                  >
                    {tier.best && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                        Mejor precio
                      </span>
                    )}
                    <p className="text-slate-400 text-sm mb-1">{tier.range}</p>
                    <p className={`text-2xl font-bold ${tier.best ? 'text-emerald-400' : 'text-white'}`}>
                      ${displayPrice.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}
                    </p>
                    <p className="text-slate-500 text-xs">{currency}/día</p>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeContent>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-slate-900">
        <FadeContent duration={800} className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Preguntas frecuentes</h2>
            <p className="text-slate-400 text-base">Resolvemos las dudas más comunes antes de empezar.</p>
          </div>

          <div className="space-y-2">
            {[
              {
                q: '¿Necesito comprobante de ingresos?',
                a: 'No. Solo necesitas tu cédula de identidad y completar la verificación digital. Sin papeleos ni trámites.'
              },
              {
                q: '¿Cómo funciona el acceso digital?',
                a: 'Una vez confirmada tu reserva recibes un código único en tu correo. Ese código se ingresa en la cerradura inteligente del espacio. Es personal e intransferible.'
              },
              {
                q: '¿Qué incluye el pago?',
                a: 'Incluye el espacio amoblado y servicios básicos como luz, agua, gas e internet. No hay gastos extras ni gastos comunes: llegas y empiezas a vivir.'
              },
              {
                q: '¿Puedo extender mi estadía?',
                a: 'Sí. Puedes extender tu estadía en cualquier momento. El sistema recalcula automáticamente el precio según la nueva duración.'
              },
              {
                q: '¿Qué pasa si quiero irme antes?',
                a: 'Puedes irte cuando quieras. Tu acceso se desactiva al finalizar el período contratado. Si decides irte antes, el 50% del valor de los días no utilizados queda como crédito para futuras estadías en Homested.'
              },
              {
                q: '¿Por qué el precio baja si me quedo más tiempo?',
                a: 'Las estadías más largas nos permiten operar de forma más eficiente. Ese ahorro se refleja en un menor precio por día.'
              },
            ].map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                    isOpen ? 'bg-slate-800 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? 'text-emerald-400' : 'text-white'}`}>
                      {item.q}
                    </span>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeContent>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden min-h-[480px] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/fondo_ca.jpg')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/70" />
        {/* Gradient edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent to-slate-900/60" />

        <div className="relative z-10 w-full max-w-2xl mx-auto text-center px-6 py-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            ¿Listo para entrar a vivir?
          </h2>
          <p className="text-slate-300 text-lg mb-2">
            Únete a quienes ya eligieron una forma más simple de habitar.
          </p>
          <p className="text-slate-300 text-base mb-10">
            Sin papeleo, sin garantías, sin intermediarios.
          </p>
          <button
            onClick={handleCtaClick}
            className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50"
          >
            Entra a vivir hoy
          </button>
        </div>
      </section>

    </div>
  );
}
