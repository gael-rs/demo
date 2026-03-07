'use client';

import { useState } from 'react';
import { useBooking } from '@/app/context';
import Header from '@/app/shared/components/Header';
import Footer from '@/app/shared/components/Footer';
import PropertyShowcase from '@/app/features/properties/components/PropertyShowcase';

export default function Landing() {
  const { goToStep, currency, convertPrice } = useBooking();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCtaClick = () => goToStep('unit-selection');

  return (
    <div className="min-h-screen bg-slate-900">
      <Header onCtaClick={handleCtaClick} />

      {/* Hero Section */}
      <section className="overflow-hidden bg-slate-900">

        {/* ── MOBILE: full-screen con gradiente desde abajo ── */}
        <div className="md:hidden relative h-screen min-h-[600px]">
          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/fondo_hero_3.jpg')" }}
          />
          {/* Overlay uniforme para legibilidad en todo el hero */}
          <div className="absolute inset-0 bg-slate-900/60" />
          {/* Gradiente lateral izquierdo para reforzar el texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
          {/* Fade superior para el header */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-transparent pointer-events-none" />

          {/* Contenido centrado */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 pt-20 pb-8">
            <h1 className="text-4xl font-bold text-white leading-[1.1] mb-5">
              Entra a vivir<br />
              en minutos.<br />
              <span className="text-emerald-400">Quédate el tiempo</span><br />
              que necesites.
            </h1>
            <p className="text-slate-200 text-base mb-1 leading-relaxed">
              Sin papeleo, sin intermediarios, sin fricción.
            </p>
            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Un hogar que se adapta a tu etapa, no al revés.
            </p>
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
            style={{ backgroundImage: "url('/img/fondo_hero_3.jpg')" }}
          />
          {/* Gradient: opaco izquierda → transparente derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          {/* Fade superior para el header */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-transparent" />

          {/* Contenido centrado verticalmente */}
          <div className="relative z-10 flex items-center h-full w-full max-w-7xl mx-auto px-16 lg:px-20 pt-20">
            <div className="max-w-xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Entra a vivir<br />
                en minutos.<br />
                <span className="text-emerald-400">Quédate el tiempo</span><br />
                que necesites.
              </h1>
              <p className="text-slate-300 text-lg mb-1 leading-relaxed">
                Sin papeleo, sin intermediarios, sin fricción.
              </p>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Un hogar que se adapta a tu etapa, no al revés.
              </p>
              <button
                onClick={handleCtaClick}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-colors active:scale-[0.98] shadow-lg shadow-emerald-500/25"
              >
                Entrar a vivir
              </button>
              <p className="mt-10 text-slate-400 text-xs tracking-widest uppercase">
                Housing as a Living — Una nueva forma de habitar.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-slate-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">3 min</p>
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
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">+100%</p>
            <p className="text-slate-400 text-sm mt-1">Ahorro por día en estadías largas</p>
          </div>
        </div>
      </section>

      {/* Property Showcase */}
      <section className="py-20 px-6 bg-slate-900">
        <PropertyShowcase />
      </section>

      {/* How it Works Section — fondo continuo con PropertyShowcase */}
      <section id="como-funciona" className="py-24 px-6 bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-3">El proceso</p>
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
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-3">Por qué elegirnos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Una nueva forma de habitar</h2>
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
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-3">Tarifas</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Precio por día decreciente</h2>
            <p className="text-slate-400 text-base">Mientras más te quedes, más ahorras</p>
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
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Preguntas frecuentes</h2>
          </div>

          <div className="space-y-2">
            {[
              {
                q: '¿Necesito comprobante de ingresos?',
                a: 'No. Solo necesitas una identificación oficial y completar la verificación digital. Sin papeles, sin burocracia.'
              },
              {
                q: '¿Cómo funciona el acceso digital?',
                a: 'Recibes un código único que ingresarás en la cerradura inteligente del inmueble. Es personal e intransferible.'
              },
              {
                q: '¿Puedo extender mi estadía?',
                a: 'Sí. Puedes extender tu estadía en cualquier momento y el precio total se recalcula según la nueva duración, aplicando la tarifa correspondiente.'
              },
              {
                q: '¿Qué pasa si quiero irme antes?',
                a: 'Puedes irte cuando quieras. Tu acceso se desactiva automáticamente al terminar tu período contratado.'
              },
              {
                q: '¿Por qué el precio baja si me quedo más tiempo?',
                a: 'Premiamos el compromiso. Las estadías más largas reducen nuestros costos operativos, y trasladamos ese ahorro a ti.'
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
        </div>
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
          <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-4">Comienza hoy</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            ¿Listo para entrar a vivir?
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            Únete al nuevo paradigma habitacional. Sin complicaciones, sin esperas.
          </p>
          <button
            onClick={handleCtaClick}
            className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50"
          >
            Entrar a vivir ahora
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
