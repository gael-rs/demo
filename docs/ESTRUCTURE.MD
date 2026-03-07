# Roadmap del Proyecto Homested

*Desarrollo Consolidado — Flujo Completo*

**Alcance General**

Desarrollar un sistema completo de reservas que cubra identidad, pago, acceso y operación administrativa, con un flujo claro, trazable y listo para producción.

## Módulo 1 — Flujo Completo + Términos y Condiciones

### Objetivo
Definir y ejecutar el flujo completo de reserva bajo reglas claras y aceptación legal obligatoria.
### Incluye
- Flujo de reserva end-to-end
- Validación de estados entre pasos del flujo
- Página dedicada de Términos y Condiciones (constantes)
- Aceptación obligatoria antes de completar el flujo
- Registro de aceptación asociado a:
    - Usuario
    - Reserva
    - Fecha y hora
    - Bloqueo del avance si no se aceptan los términos

Precio: 100
Tiempo: 1.5 semana

## Módulo 2 — Validación Biométrica (Servicio Externo)
Objetivo
Validar la identidad del usuario de forma automática.
Incluye
Validación biométrica
Lo único que se valida es:
Que hay una persona real frente a la cámara
Selfie en tiempo real 
Valor entregado
Mayor seguridad y reducción de riesgos sin intervención manual.

Precio: 200
Tiempo: 1.5 semana

## Módulo 3 — Pasarela de Pagos (Servicio Externo)
### Objetivo
Permitir el pago de reservas dentro del sistema.
### Incluye
Integración con pasarela de pagos externa
Inicio de pago desde el flujo de reserva
Confirmación automática del estado del pago
Actualización del estado de la reserva
Manejo básico de errores
Valor entregado
Cobros reales con trazabilidad y control del estado financiero.

Precio: 200
Tiempo: 1.5 semana

## Módulo 4 — Llave Electrónica
Objetivo
Proporcionar acceso digital a la unidad reservada.
Incluye
Generación de código de acceso
Asociación del código a:
Usuario
Unidad
Fechas de reserva
Visualización del código al usuario
Control de vigencia del código
Valor entregado
Acceso digital funcional sin dependencia directa de hardware complejo.

Precio: 200
Tiempo: 1.5 semana

# Módulo 5 — Dashboard Administrativo Completo
Objetivo
Gestionar el sistema sin acceso directo a la base de datos.
Incluye
Gestión de departamentos
Visualización de reservas por estado
Visualización de pagos
Visualización de validaciones biométricas
Cambio manual de estados
Vista general del sistema

Precio: 100
Tiempo: 1.5 semana

Los entregables son por fases, las fases las revisa el cliente, en caso de que este todo acorde, se procede a avanzar la siguiente fase. En caso se ocupe alguna correción, se atenderá en el tiempo estipulado por la empresa según la complejidad de la observación. 

Los pagos se realizan por fases. Al inicio de cada fase se debe de entregar el dinero del precio indicado en este documento a la empresa.

En caso de que el desarrollo de alguna fase concluya antes de lo previsto y el cliente haya autorizado previamente un pago anticipado para la siguiente fase, el avance podrá entregarse con antelación, según lo acordado.

En caso de que algún servicio externo, hosting o dominio requiera un pago adicional, dicho costo no estará incluido dentro del pago correspondiente a las fases del proyecto. El cliente deberá asumir y autorizar estos pagos adicionales según lo requiera el desarrollo. En caso de no aceptar dichos costos, se evaluará y definirá una alternativa al requerimiento afectado, con el fin de encontrar una solución más económica y viable.
