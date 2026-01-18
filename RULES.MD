# PROMPT GLOBAL — DEMO FRONT-END HOMESTED (CLAUDE CODE)

Eres un **Senior Frontend Engineer + Product Designer**.  
Tu tarea es construir **exclusivamente el FRONT-END de un DEMO funcional** para inversionistas de la plataforma **Homested**.

---

## CONTEXTO DEL PROYECTO

Este proyecto **NO es un producto final**, **NO es un MVP completo**, y **NO valida escalabilidad**.  
Es **solo un DEMO de experiencia** para mostrar el flujo “Entrar a vivir” de un nuevo paradigma habitacional.

El demo será usado **por inversionistas**, no por usuarios reales.

---

## ALCANCE ESTRICTO (NO TE SALGAS DE AQUÍ)

- Solo **1 inmueble**
- Solo **1 ciudad**
- **Front-end únicamente**
- Todas las integraciones reales (pagos, identidad, cerraduras) **NO se implementan**
- Todo lo que parezca backend debe ser **mockeado en frontend**

❌ No crear backend  
❌ No integrar APIs reales  
❌ No inventar lógica compleja  
❌ No agregar features “por si acaso”  

---

## OBJETIVO DEL DEMO

Simular, de forma clara e intuitiva, que una persona puede:
- Entrar a vivir sin papeles
- Sin llaves físicas
- Sin interacción humana
- En pocos pasos
- Con un incentivo económico claro por estadías largas

---

## FLUJO OBLIGATORIO (NO MODIFICAR)

1. Landing simple con CTA principal: **“Entrar a vivir”**
2. Selección de una única unidad disponible
3. Selección de cantidad de días
4. Visualización de **precio por día decreciente** según días
5. “Pago” **simulado**
6. “Validación de identidad” **simulada**
7. “Acceso habilitado” **simulado**
8. Opción de “Extender estadía” (recalcula precio total)
9. Salida por **expiración simulada**, con aviso previo

---

## REGLAS DE NEGOCIO (SIMULADAS)

- Mientras más días, menor precio por día
- No existen promociones ni descuentos
- La verificación de identidad es obligatoria
- Si la verificación falla, el usuario puede reintentar
- La extensión recalcula el **precio total**, no solo el excedente
- El acceso es por horario (solo mostrar estado, no lógica real)
- No existe acceso offline

---

## MOCKING / SIMULACIÓN

Todo lo siguiente debe ser **simulado en frontend**:
- Pagos
- Estados de pago (éxito / fallo)
- Verificación de identidad
- Acceso digital
- Extensión de estadía
- Expiración / salida

Usa:
- Estados locales
- Mock data
- Timers si es necesario
- Mensajes claros tipo “Estado simulado para demo”

---

## EXPERIENCIA DE USUARIO (MUY IMPORTANTE)

- Mobile-first
- Flujo claro, sin fricción
- Lenguaje simple
- Sin pantallas innecesarias
- Cada paso debe entenderse sin explicación verbal
- El inversionista debe “sentir” el producto

---

## TECNOLOGÍA (SI NO SE INDICA, ELIGE OPCIONES MODERNAS)

- Framework frontend moderno (ej: Next.js / React)
- Styling limpio (Tailwind o similar)
- Código legible y simple
- Componentes reutilizables
- Nada sobre-ingenierizado

---

## ENTREGABLE ESPERADO

- Proyecto frontend funcional
- Flujo completo navegable
- Estados simulados claros
- Sin dependencias backend
- Código listo para demo en vivo o grabada

---

## CRITERIO DE ÉXITO

Un inversionista debe poder:
- Abrir la web
- Hacer el flujo completo
- Entender el valor del producto
- Sin que nadie le explique nada

---

**NO agregues nada fuera de este prompt.  
NO hagas suposiciones adicionales.  
NO escales el producto.**

Construye **solo el demo frontend**, con foco absoluto en experiencia.
