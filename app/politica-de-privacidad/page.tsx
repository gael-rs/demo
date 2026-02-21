'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Política de Privacidad y Protección de Datos
          </h1>
          <p className="text-sm text-slate-400 mb-2">
            Última actualización: 7 de Febrero de 2026 | Versión 1.0
          </p>
          <p className="text-sm text-slate-300 mb-8">
            Homested SpA - Conforme a la Ley N°19.628 sobre Protección de la Vida Privada
          </p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Introducción
              </h2>
              <p className="text-slate-300 leading-relaxed">
                En Homested, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta
                Política de Privacidad describe cómo recopilamos, usamos, almacenamos y
                protegemos su información personal cuando utiliza nuestra plataforma de
                alojamiento temporal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Información que Recopilamos
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Recopilamos los siguientes tipos de información:
              </p>

              <h3 className="text-xl font-semibold text-slate-100 mb-3 mt-6">
                2.1 Información de Registro
              </h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono (opcional)</li>
                <li>Contraseña (almacenada de forma encriptada)</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-100 mb-3 mt-6">
                2.2 Documentos de Verificación de Identidad
              </h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Fotografías de documento de identidad (cédula o pasaporte)</li>
                <li>Selfie para verificación biométrica</li>
                <li>Datos contenidos en el documento (nombre, fecha de nacimiento, número de documento)</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-100 mb-3 mt-6">
                2.3 Información de Reservas
              </h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Fechas de check-in y check-out</li>
                <li>Propiedad reservada</li>
                <li>Información de pago (procesada de forma segura por terceros)</li>
                <li>Historial de reservas</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-100 mb-3 mt-6">
                2.4 Información Técnica
              </h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Dirección IP</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Sistema operativo</li>
                <li>Páginas visitadas y acciones realizadas en la plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Cómo Usamos su Información
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong>Verificar su identidad:</strong> Para garantizar la seguridad de todos los usuarios y propietarios</li>
                <li><strong>Procesar reservas:</strong> Para gestionar el alojamiento y acceso a las propiedades</li>
                <li><strong>Comunicación:</strong> Para enviarle confirmaciones de reserva, actualizaciones de estado y notificaciones importantes</li>
                <li><strong>Prevención de fraudes:</strong> Para detectar y prevenir actividades fraudulentas</li>
                <li><strong>Mejora del servicio:</strong> Para analizar el uso de la plataforma y mejorar la experiencia del usuario</li>
                <li><strong>Cumplimiento legal:</strong> Para cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Compartición de Información
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                No vendemos su información personal. Compartimos información únicamente en los siguientes casos:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong>Con propietarios:</strong> Compartimos información básica de contacto y verificación con propietarios de las propiedades que reserva</li>
                <li><strong>Proveedores de servicios:</strong> Con empresas que nos ayudan a operar la plataforma (procesadores de pago, almacenamiento en la nube, etc.)</li>
                <li><strong>Autoridades legales:</strong> Cuando sea requerido por ley o para proteger nuestros derechos legales</li>
                <li><strong>Transferencias comerciales:</strong> En caso de fusión, adquisición o venta de activos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Seguridad de los Datos
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Encriptación de datos sensibles en tránsito (SSL/TLS) y en reposo</li>
                <li>Controles de acceso estrictos al personal autorizado</li>
                <li>Autenticación de múltiples factores para cuentas administrativas</li>
                <li>Auditorías de seguridad regulares</li>
                <li>Almacenamiento seguro de documentos de identidad con acceso limitado</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Sin embargo, ningún método de transmisión por Internet es 100% seguro. Le recomendamos
                proteger sus credenciales de acceso y notificarnos inmediatamente ante cualquier actividad
                sospechosa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Retención de Datos
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Conservamos su información personal solo durante el tiempo necesario para cumplir con
                los propósitos descritos en esta política o según lo requiera la ley:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
                <li><strong>Información de cuenta:</strong> Mientras su cuenta esté activa o según sea necesario para proporcionarle servicios</li>
                <li><strong>Documentos de verificación:</strong> Hasta 5 años después de la última reserva, por razones legales y de seguridad</li>
                <li><strong>Historial de reservas:</strong> Hasta 7 años para cumplimiento fiscal y contable</li>
                <li><strong>Datos de navegación:</strong> Hasta 2 años para análisis y mejora de la plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Sus Derechos
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Usted tiene los siguientes derechos sobre su información personal:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li><strong>Acceso:</strong> Puede solicitar una copia de los datos personales que tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Puede solicitar la corrección de información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Puede solicitar la eliminación de su información (con excepciones legales)</li>
                <li><strong>Portabilidad:</strong> Puede solicitar una copia de sus datos en formato legible por máquina</li>
                <li><strong>Oposición:</strong> Puede oponerse al procesamiento de sus datos en ciertos casos</li>
                <li><strong>Revocación de consentimiento:</strong> Puede retirar su consentimiento en cualquier momento</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Para ejercer cualquiera de estos derechos, contáctenos en{' '}
                <a href="mailto:privacidad@homested.cl" className="text-emerald-400 hover:text-emerald-300 underline">
                  privacidad@homested.cl
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Cookies y Tecnologías de Seguimiento
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Mantener su sesión iniciada</li>
                <li>Recordar sus preferencias</li>
                <li>Analizar el uso de la plataforma</li>
                <li>Mejorar la seguridad</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar
                la funcionalidad de la plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Privacidad de Menores
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos
                conscientemente información de menores de edad. Si descubrimos que hemos recopilado
                información de un menor sin verificación de consentimiento parental, eliminaremos
                esa información de nuestros servidores.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                10. Transferencias Internacionales
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Su información puede ser transferida y almacenada en servidores ubicados fuera de
                su país de residencia. En tales casos, nos aseguramos de que se implementen
                salvaguardas adecuadas para proteger su información de acuerdo con esta Política
                de Privacidad y las leyes aplicables.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                11. Cambios a esta Política
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos
                sobre cambios significativos mediante:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mt-4">
                <li>Correo electrónico a la dirección registrada en su cuenta</li>
                <li>Aviso prominente en nuestra plataforma</li>
                <li>Actualización de la fecha de "Última actualización" en la parte superior</li>
              </ul>
              <p className="text-slate-300 leading-relaxed mt-4">
                Le recomendamos revisar esta política regularmente para mantenerse informado
                sobre cómo protegemos su información.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                12. Contacto
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de
                Privacidad o el tratamiento de sus datos personales, puede contactarnos:
              </p>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 mt-4">
                <p className="text-slate-300 mb-2">
                  <strong>Razón Social:</strong> Homested SpA
                </p>
                <p className="text-slate-300 mb-2">
                  <strong>Email Privacidad:</strong>{' '}
                  <a href="mailto:privacidad@homested.cl" className="text-emerald-400 hover:text-emerald-300 underline">
                    privacidad@homested.cl
                  </a>
                </p>
                <p className="text-slate-300 mb-2">
                  <strong>Soporte general:</strong>{' '}
                  <a href="mailto:soporte@homested.cl" className="text-emerald-400 hover:text-emerald-300 underline">
                    soporte@homested.cl
                  </a>
                </p>
                <p className="text-slate-300">
                  <strong>Tiempo de respuesta:</strong> Nos comprometemos a responder solicitudes relacionadas
                  con privacidad dentro de 30 días hábiles conforme a la Ley N°19.628.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                13. Consentimiento
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Al utilizar nuestra plataforma y aceptar esta Política de Privacidad, usted
                consiente la recopilación, uso y divulgación de su información personal según
                se describe en este documento. Si no está de acuerdo con cualquier parte de
                esta política, no debe utilizar nuestros servicios.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-slate-600">
              <p className="text-sm text-slate-400 mb-4">
                <strong>Cumplimiento Legal:</strong> Esta Política de Privacidad cumple con la Ley N°19.628
                sobre Protección de la Vida Privada de Chile y regulaciones aplicables de protección de datos personales.
              </p>
              <p className="text-sm text-slate-400">
                Esta Política de Privacidad fue actualizada por última vez el 7 de febrero de 2026
                y es efectiva a partir de esa fecha.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
