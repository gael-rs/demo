'use client';

import { useBooking } from '../context';
import Header from './Header';
import Footer from './Footer';
import PropertyShowcase from './PropertyShowcase';
import { PRICING_TIERS } from '../data';

export default function Landing() {
  const { goToStep, currency, convertPrice } = useBooking();

  const handleCtaClick = () => goToStep('unit-selection');

  return (
    <div className="min-h-screen bg-slate-900">
      <Header onCtaClick={handleCtaClick} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Disponible en todo Chile</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Entra a vivir en
            <span className="text-emerald-400"> minutos</span>,
            <br />no en semanas
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Un nuevo paradigma habitacional. Sin papeles, sin llaves físicas, sin fiadores.
            Solo tú y tu nuevo hogar.
          </p>

          <button
            onClick={handleCtaClick}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
          >
            Entrar a vivir
          </button>

          <p className="mt-4 text-slate-500 text-sm">
            Sin compromiso. Cancela cuando quieras.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-slate-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">3 min</p>
            <p className="text-slate-400 text-sm mt-1">Para entrar a vivir</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">0</p>
            <p className="text-slate-400 text-sm mt-1">Papeles requeridos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">24/7</p>
            <p className="text-slate-400 text-sm mt-1">Acceso digital</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-400">-55%</p>
            <p className="text-slate-400 text-sm mt-1">Ahorro en estadías largas</p>
          </div>
        </div>
      </section>

      {/* Property Showcase */}
      <section className="py-20 px-6 bg-slate-900">
        <PropertyShowcase />
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Cómo funciona?</h2>
            <p className="text-slate-400 text-lg">Cuatro pasos simples para entrar a tu nuevo hogar</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Elige tu espacio', desc: 'Selecciona el inmueble que más te guste de nuestra lista curada.' },
              { step: '02', title: 'Define tu estadía', desc: 'Elige cuántos días quieres quedarte. Más días = mejor precio.' },
              { step: '03', title: 'Paga y verifica', desc: 'Pago seguro y verificación de identidad 100% digital.' },
              { step: '04', title: 'Entra a vivir', desc: 'Recibe tu código de acceso y entra cuando quieras.' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-800 rounded-2xl p-6 h-full border border-slate-700 hover:border-emerald-500/50 transition-colors">
                  <span className="text-5xl font-bold text-slate-700">{item.step}</span>
                  <h3 className="text-white font-semibold mt-4 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Por qué Homested?</h2>
            <p className="text-slate-400 text-lg">Olvídate del proceso tradicional de renta</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: 'Sin papeleos',
                desc: 'Olvídate de comprobantes de ingresos, referencias personales, historial crediticio o fiadores. Todo es digital y automático.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                ),
                title: 'Sin llaves físicas',
                desc: 'Acceso 100% digital. Recibe un código único que funciona en la cerradura inteligente. Sin copias, sin pérdidas.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Sin intermediarios',
                desc: 'No hay agentes inmobiliarios, no hay citas para ver el departamento, no hay negociaciones. Es directo y transparente.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Precio justo',
                desc: 'Mientras más tiempo te quedes, menos pagas por día. Un modelo que te premia por comprometerte.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Inmediato',
                desc: 'En menos de 5 minutos puedes tener acceso a tu nuevo hogar. Sin esperas, sin vueltas.'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: 'Flexible',
                desc: 'Extiende tu estadía cuando quieras, y el precio se recalcula automáticamente a tu favor.'
              },
            ].map((item, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Precio por día decreciente</h2>
            <p className="text-slate-400 text-lg">Mientras más te quedes, más ahorras</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PRICING_TIERS.map((tier, index) => {
                const displayPrice = convertPrice(tier.pricePerDay);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl text-center ${
                      index === PRICING_TIERS.length - 1
                        ? 'bg-emerald-500/20 border-2 border-emerald-500'
                        : 'bg-slate-700/50'
                    }`}
                  >
                    <p className="text-slate-400 text-sm mb-1">
                      {tier.minDays}-{tier.maxDays} días
                    </p>
                    <p className={`text-2xl font-bold ${index === PRICING_TIERS.length - 1 ? 'text-emerald-400' : 'text-white'}`}>
                      {currency === 'USD' ? '$' : '$'}{displayPrice.toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}
                    </p>
                    <p className="text-slate-500 text-xs">{currency}/día</p>
                    {index === PRICING_TIERS.length - 1 && (
                      <span className="inline-block mt-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                        Mejor precio
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 text-center">
              <p className="text-slate-400 mb-4">
                Ejemplo: 30 días a <span className="text-white font-semibold">{currency === 'USD' ? '$' : '$'}{convertPrice(28000).toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')}/{currency}/día</span> = <span className="text-emerald-400 font-bold">{currency === 'USD' ? '$' : '$'}{convertPrice(28000 * 30).toLocaleString(currency === 'USD' ? 'en-US' : 'es-CL')} {currency}</span> total
              </p>
              <p className="text-slate-500 text-sm">
                vs. renta tradicional: depósito + renta + aval + comisión = mucho más caro y complicado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Preguntas frecuentes</h2>
          </div>

          <div className="space-y-4">
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
            ].map((item, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para entrar a vivir?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Únete al nuevo paradigma habitacional. Sin complicaciones, sin esperas.
          </p>
          <button
            onClick={handleCtaClick}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25"
          >
            Entrar a vivir ahora
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
