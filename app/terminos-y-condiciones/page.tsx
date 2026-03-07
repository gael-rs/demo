'use client';

import Header from '@/app/shared/components/Header';
import Footer from '@/app/shared/components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Términos y Condiciones de Arrendamiento
          </h1>
          <p className="text-sm text-slate-400 mb-2">
            Última actualización: 7 de Febrero de 2026 | Versión 1.0
          </p>
          <p className="text-sm text-slate-300 mb-8">
            Homested SpA - Plataforma de Arrendamiento de Inmuebles Amoblados por Tiempos Determinados
          </p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Definiciones y Objeto del Contrato
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Al utilizar la plataforma Homested, usted celebra un contrato de arrendamiento de inmuebles
                amoblados por tiempos determinados, de conformidad con la legislación chilena vigente.
              </p>
              <div className="bg-slate-700/50 border border-slate-600 p-4 rounded-lg mb-4">
                <p className="text-slate-200 leading-relaxed mb-2"><strong>Definiciones:</strong></p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li><strong>Arrendador:</strong> Propietario del inmueble registrado en la plataforma</li>
                  <li><strong>Arrendatario:</strong> Usuario que reserva y ocupa el inmueble</li>
                  <li><strong>Plataforma:</strong> Homested SpA, intermediario tecnológico</li>
                  <li><strong>Inmueble:</strong> Propiedad amoblada disponible para arrendamiento</li>
                  <li><strong>Período de Arrendamiento:</strong> Tiempo determinado desde check-in hasta check-out</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Naturaleza Jurídica del Arrendamiento
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Los arrendamientos celebrados a través de Homested son contratos de arrendamiento de
                inmuebles amoblados por <strong>tiempos determinados</strong>, conforme al Código Civil chileno
                (Título XXVI del Libro IV), y se rigen por las siguientes características:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Duración determinada desde 1 día hasta 12 meses</li>
                <li>Inmuebles completamente amoblados y equipados para uso inmediato</li>
                <li>No aplica la Ley de Arrendamiento Urbano (DFL N°2 de 1959) cuando la duración es inferior a 11 meses</li>
                <li>Finalización automática al vencimiento del plazo sin necesidad de desahucio</li>
                <li>Uso exclusivamente habitacional, quedando prohibido el uso comercial o subarrendamiento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Requisitos para Arrendar
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Para celebrar un contrato de arrendamiento a través de Homested, el arrendatario debe:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Ser mayor de 18 años y tener plena capacidad legal para contratar</li>
                <li>Registrarse con información veraz y completa (nombre, email, teléfono)</li>
                <li>Completar la verificación de identidad mediante documento oficial vigente</li>
                <li>Aceptar expresamente estos Términos y Condiciones</li>
                <li>Realizar el pago total del período de arrendamiento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Proceso de Verificación de Identidad
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                La verificación de identidad es <strong>obligatoria y condición esencial</strong> para
                la celebración del contrato de arrendamiento:
              </p>
              <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 mb-4">
                <p className="text-amber-200 font-semibold mb-2">Documentación Requerida:</p>
                <ul className="list-disc list-inside text-amber-200 space-y-2 ml-4">
                  <li>Fotografía frontal nítida de cédula de identidad chilena o pasaporte vigente</li>
                  <li>Fotografía del reverso del documento (si aplica)</li>
                  <li>Selfie sosteniendo el documento junto al rostro</li>
                  <li>Los documentos deben ser legibles y sin alteraciones</li>
                </ul>
              </div>
              <p className="text-slate-300 leading-relaxed mb-2">
                <strong>Proceso de revisión:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Revisión manual por equipo de Homested en un plazo de 2-24 horas</li>
                <li>Confirmación o rechazo notificado por email y en la plataforma</li>
                <li>Derecho a solicitar aclaraciones o documentación adicional</li>
                <li>Reembolso automático si la verificación es rechazada sin culpa del usuario</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Tarifas, Pagos y Política de Precios
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>5.1. Estructura de Precios:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
                <li>Precio por día/semana/mes según duración del arrendamiento</li>
                <li>Descuentos automáticos por estadías prolongadas (según política de cada propiedad)</li>
                <li>Kit de inicio único de $25.000 CLP (incluye limpieza, insumos básicos, ropa de cama)</li>
                <li>Precios en pesos chilenos (CLP) con conversión estimada a USD</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>5.2. Condiciones de Pago:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
                <li>Pago <strong>100% por adelantado</strong> antes del check-in</li>
                <li>Métodos aceptados: tarjetas de crédito/débito, transferencia bancaria</li>
                <li>No se permite el ingreso sin pago confirmado</li>
                <li>Los precios incluyen IVA cuando corresponda</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>5.3. Servicios Incluidos:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Uso de la propiedad y todo el mobiliario incluido</li>
                <li>Servicios básicos (agua, luz, gas) según consumo normal</li>
                <li>Internet WiFi cuando esté disponible</li>
                <li>Limpieza inicial y final (limpiezas intermedias bajo solicitud con costo adicional)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Política de Cancelación y Reembolsos
              </h2>
              <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-200 font-semibold mb-2">Política Estricta de Cancelación:</p>
                <ul className="list-disc list-inside text-red-200 space-y-2 ml-4">
                  <li><strong>Más de 7 días antes del check-in:</strong> Reembolso del 90% (se retiene 10% por gastos administrativos)</li>
                  <li><strong>Entre 48-168 horas antes:</strong> Reembolso del 50%</li>
                  <li><strong>Menos de 48 horas:</strong> Sin reembolso</li>
                  <li><strong>No-show (no presentarse):</strong> Sin reembolso</li>
                </ul>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>Excepciones (requieren documentación):</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Emergencia médica grave (certificado médico)</li>
                <li>Fallecimiento de familiar directo (certificado de defunción)</li>
                <li>Caso fortuito o fuerza mayor debidamente acreditado</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Los reembolsos se procesan en 5-10 días hábiles al método de pago original.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Check-In, Check-Out y Códigos de Acceso
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>7.1. Check-In:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
                <li>Horario: 15:00 hrs (salvo acuerdo contrario)</li>
                <li>Código de acceso digital enviado tras verificación de identidad aprobada</li>
                <li>El código es personal e intransferible</li>
                <li>Check-in anticipado sujeto a disponibilidad (puede tener costo adicional)</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>7.2. Check-Out:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
                <li>Horario: 11:00 hrs (salvo acuerdo contrario)</li>
                <li>El código de acceso se desactiva automáticamente a la hora de check-out</li>
                <li>Dejar la propiedad en condiciones similares a las recibidas</li>
                <li>Check-out tardío sujeto a disponibilidad (puede tener costo adicional)</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>7.3. Códigos de Acceso:</strong>
              </p>
              <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                <ul className="list-disc list-inside text-blue-200 space-y-2 ml-4">
                  <li>Los códigos son únicos por reserva y válidos solo durante el período contratado</li>
                  <li>Está <strong>prohibido compartir</strong> el código con terceros no autorizados</li>
                  <li>La compartición no autorizada puede resultar en cancelación inmediata sin reembolso</li>
                  <li>Homested puede revocar códigos en caso de incumplimiento de términos</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Obligaciones del Arrendatario
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                El arrendatario se obliga a:
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-white mb-2">8.1. Uso Adecuado:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                    <li>Usar el inmueble exclusivamente con fines habitacionales</li>
                    <li>Mantener el orden, higiene y cuidado de la propiedad</li>
                    <li>No alterar la estructura, instalaciones o distribución del inmueble</li>
                    <li>Hacer uso racional de servicios básicos (agua, luz, gas)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">8.2. Prohibiciones:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                    <li>Subarrendar, ceder o traspasar el arrendamiento a terceros</li>
                    <li>Realizar fiestas o eventos sin autorización previa</li>
                    <li>Tener más ocupantes que la capacidad máxima indicada</li>
                    <li>Fumar en propiedades no fumadoras</li>
                    <li>Tener mascotas sin autorización explícita</li>
                    <li>Realizar actividades ilegales o que molesten a vecinos</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">8.3. Daños y Reparaciones:</p>
                  <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                    <li>Notificar inmediatamente cualquier daño o desperfecto</li>
                    <li>Asumir el costo de reparación de daños causados por uso negligente</li>
                    <li>No intentar reparaciones por cuenta propia sin autorización</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Extensión de Estadía
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                El arrendatario puede solicitar extensión de estadía sujeto a:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Disponibilidad de la propiedad para el período solicitado</li>
                <li>Solicitud con al menos 48 horas de anticipación al check-out original</li>
                <li>Pago anticipado del período adicional</li>
                <li>Precios de extensión según tarifa vigente al momento de la solicitud</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                La extensión requiere aprobación expresa y constituye una modificación del contrato original.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                10. Terminación Anticipada y Desalojo
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Homested y/o el arrendador pueden terminar el contrato anticipadamente en los siguientes casos:
              </p>
              <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
                <p className="font-semibold text-red-200 mb-2">Causales de Terminación Inmediata (sin reembolso):</p>
                <ul className="list-disc list-inside text-red-200 space-y-2 ml-4">
                  <li>Incumplimiento grave de obligaciones contractuales</li>
                  <li>Subarrendamiento o cesión no autorizada</li>
                  <li>Actividades ilegales en el inmueble</li>
                  <li>Daños intencionales o negligencia grave</li>
                  <li>Molestias graves a vecinos o comunidad</li>
                  <li>Exceder la capacidad máxima de ocupantes</li>
                  <li>Compartir códigos de acceso con terceros</li>
                </ul>
              </div>
              <p className="text-slate-300 leading-relaxed">
                En caso de terminación anticipada por causales imputables al arrendatario, este debe
                desalojar de inmediato y no tendrá derecho a reembolso alguno.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                11. Protección de Datos Personales
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Homested SpA actúa como responsable del tratamiento de datos personales, conforme a la
                Ley N°19.628 sobre Protección de la Vida Privada:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
                <li><strong>Datos recopilados:</strong> nombre, RUT, email, teléfono, dirección, documento de identidad, selfie, datos de pago</li>
                <li><strong>Finalidad:</strong> verificación de identidad, gestión de reservas, cumplimiento de obligaciones legales</li>
                <li><strong>Almacenamiento:</strong> servidores seguros con encriptación</li>
                <li><strong>Compartición:</strong> solo con arrendadores necesarios para cada reserva y autoridades cuando lo requiera la ley</li>
                <li><strong>Retención:</strong> durante la vigencia del contrato y 5 años posteriores para fines tributarios y legales</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>Derechos del titular:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Acceder a sus datos personales</li>
                <li>Rectificar datos inexactos</li>
                <li>Solicitar eliminación (sujeto a obligaciones legales de retención)</li>
                <li>Oponerse al tratamiento de datos</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Para ejercer estos derechos, contactar a: <strong>privacidad@homested.cl</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                12. Limitación de Responsabilidad
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>12.1. Rol de Homested:</strong>
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                Homested actúa como <strong>plataforma intermediaria</strong> entre arrendadores y arrendatarios.
                No somos propietarios de los inmuebles ni arrendadores directos.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>12.2. Exclusiones de Responsabilidad:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
                <li>Estado y condiciones específicas de cada inmueble (responsabilidad del arrendador)</li>
                <li>Pérdida o robo de pertenencias personales</li>
                <li>Daños indirectos, lucro cesante o daño moral</li>
                <li>Interrupciones de servicios básicos por causas ajenas a nuestro control</li>
                <li>Incompatibilidades o disconformidad con expectativas subjetivas del arrendatario</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>12.3. Responsabilidad Limitada:</strong>
              </p>
              <p className="text-slate-300 leading-relaxed">
                En caso de incumplimiento imputable a Homested, nuestra responsabilidad se limita al
                monto efectivamente pagado por el arrendatario para esa reserva específica.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                13. Resolución de Conflictos
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>13.1. Mediación Previa:</strong>
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                Ante cualquier controversia, las partes acuerdan intentar resolverla de buena fe mediante
                mediación antes de acudir a tribunales. Homested facilitará la comunicación entre arrendador
                y arrendatario.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>13.2. Jurisdicción y Legislación Aplicable:</strong>
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Jurisdicción: Tribunales Ordinarios de Justicia de Santiago, Chile</li>
                <li>Legislación aplicable: Código Civil chileno, Ley del Consumidor (Ley N°19.496), y demás normativa vigente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                14. Modificaciones a los Términos
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Homested se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Las modificaciones serán notificadas por email y publicadas en la plataforma</li>
                <li>Las modificaciones rigen para nuevas reservas realizadas después de la fecha de cambio</li>
                <li>Las reservas existentes se rigen por los términos vigentes al momento de su celebración</li>
                <li>El uso continuado de la plataforma tras las modificaciones constituye aceptación tácita</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                15. Información de Contacto
              </h2>
              <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
                <p className="text-slate-300 leading-relaxed mb-4">
                  <strong>Razón Social:</strong> Homested SpA
                  <br />
                  <strong>RUT:</strong> XX.XXX.XXX-X
                  <br />
                  <strong>Dirección:</strong> Santiago, Chile
                </p>
                <p className="text-slate-300 leading-relaxed mb-2">
                  <strong>Canales de Atención:</strong>
                </p>
                <ul className="list-none text-slate-300 space-y-2">
                  <li><strong>Email general:</strong> contacto@homested.cl</li>
                  <li><strong>Email soporte:</strong> soporte@homested.cl</li>
                  <li><strong>Email privacidad:</strong> privacidad@homested.cl</li>
                  <li><strong>WhatsApp:</strong> +56 9 XXXX XXXX</li>
                  <li><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00 hrs</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                16. Disposiciones Finales
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>16.1. Integridad del Contrato:</strong> Estos Términos y Condiciones, junto con la
                información específica de cada reserva, constituyen el acuerdo completo entre las partes.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong>16.2. Severabilidad:</strong> Si alguna disposición es declarada inválida, las demás
                permanecerán en pleno vigor.
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong>16.3. Idioma:</strong> En caso de traducción, la versión en español prevalece.
              </p>
            </section>
          </div>

          <div className="mt-12 p-6 bg-blue-900/20 rounded-xl border-2 border-blue-600">
            <p className="text-sm text-blue-200 font-semibold mb-2">
              DECLARACIÓN DE ACEPTACIÓN
            </p>
            <p className="text-sm text-blue-200">
              Al marcar la casilla de aceptación y completar su reserva, usted declara bajo juramento que:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-200 space-y-1 mt-2 ml-4">
              <li>Ha leído íntegramente estos Términos y Condiciones</li>
              <li>Comprende y acepta todas las obligaciones y restricciones establecidas</li>
              <li>Es mayor de 18 años y tiene capacidad legal para contratar</li>
              <li>La información proporcionada es veraz y completa</li>
              <li>Acepta la política de cancelación y reembolsos</li>
            </ul>
            <p className="text-xs text-blue-300 mt-4">
              Su aceptación queda registrada electrónicamente con fecha, hora, dirección IP y versión de términos aceptada.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
