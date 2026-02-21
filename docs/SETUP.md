# HOMESTED DEMO - GUÍA DE CONFIGURACIÓN

## ✅ LO QUE YA ESTÁ IMPLEMENTADO

### 1. Base de Datos (Migraciones creadas)
- ✅ Tabla `users` con campo `role` (user/admin)
- ✅ Tabla `properties` (propiedades/unidades)
- ✅ Tabla `bookings` (reservas)
- ✅ Tabla `identity_verifications` (verificaciones de identidad)
- ✅ Tabla `access_codes` (códigos de acceso)
- ✅ Tabla `terms_acceptances` (aceptación de términos)
- ✅ Storage buckets configurados (property-images, verification-documents)

### 2. Servicios Backend
- ✅ `property.service.ts` - Gestión de propiedades
- ✅ `booking.service.ts` - Gestión de reservas
- ✅ `verification.service.ts` - Verificación de identidad
- ✅ `accessCode.service.ts` - Códigos de acceso
- ✅ `terms.service.ts` - Términos y condiciones
- ✅ `tuya.service.ts` - Stub para integración Tuya (futuro)

### 3. Flujo de Usuario
- ✅ Registro y autenticación con Supabase
- ✅ Selección de propiedad
- ✅ Cálculo de pricing dinámico
- ✅ Aceptación de términos y condiciones (checkbox)
- ✅ Pago simulado que crea reserva en DB
- ✅ Upload de documentos (frontal, reverso opcional, selfie)
- ✅ Creación de registro de verificación en DB

### 4. Panel de Administración
- ✅ Layout con protección por rol
- ✅ Dashboard con métricas
- ✅ Gestión de reservas (ver, filtrar, cancelar)
- ✅ Panel de verificaciones (aprobar/rechazar)
  - Al aprobar: genera código de acceso automáticamente
- ✅ Página de términos y condiciones pública

### 5. Funcionalidades Pendientes (Simples de agregar)
- 🔨 Gestión de propiedades (CRUD completo) - Página estructurada, falta completar
- 🔨 Gestión de códigos de acceso - Página básica por agregar
- 🔨 Página `/admin/propiedades/page.tsx` completa
- 🔨 Página `/admin/codigos-acceso/page.tsx` completa

---

## 📋 PASOS PARA COMPLETAR LA CONFIGURACIÓN

### PASO 1: Aplicar Migraciones a Supabase

Las migraciones están en `supabase/migrations/`. Debes aplicarlas en el siguiente orden:

**Opción A: Usando Supabase CLI (Recomendado)**
```bash
# Inicializar Supabase (si no lo has hecho)
supabase init

# Linkear con tu proyecto
supabase link --project-ref TU_PROJECT_REF

# Aplicar migraciones
supabase db push
```

**Opción B: Manualmente en Supabase Dashboard**
1. Ve a Supabase Dashboard → SQL Editor
2. Copia y pega el contenido de cada archivo de migración EN ORDEN:
   - `20260127000001_create_helper_functions.sql`
   - `20260127000002_add_role_to_users.sql`
   - `20260127000003_create_properties_table.sql`
   - `20260127000004_create_bookings_table.sql`
   - `20260127000005_create_identity_verifications_table.sql`
   - `20260127000006_create_access_codes_table.sql`
   - `20260127000007_create_terms_acceptances_table.sql`
   - `20260127000008_configure_storage_buckets.sql`
3. Ejecuta cada migración

### PASO 2: Crear Storage Buckets

En Supabase Dashboard → Storage, crea los siguientes buckets:

1. **`property-images`** (Público)
   - Name: `property-images`
   - Public: ✅ SÍ

2. **`verification-documents`** (Privado)
   - Name: `verification-documents`
   - Public: ❌ NO

Luego aplica las políticas de storage ejecutando el archivo:
`supabase/migrations/20260127000008_configure_storage_buckets.sql`

### PASO 3: Crear Usuario Admin

**Opción A: Desde la aplicación**
1. Regístrate normalmente en la app con tu email
2. Ve a Supabase Dashboard → SQL Editor
3. Ejecuta:
```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'tu-email@example.com';
```

**Opción B: Directamente en Supabase**
1. Ve a Supabase Dashboard → Authentication → Users
2. Crea un nuevo usuario manualmente
3. Luego en SQL Editor:
```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'tu-email@example.com';
```

### PASO 4: Acceder al Panel Admin

1. Inicia sesión con tu cuenta admin
2. Ve a `/admin/dashboard`
3. Deberías ver el panel de administración

### PASO 5: Agregar tu Propiedad Real de Viña del Mar

**Temporalmente (hasta que esté listo el CRUD):**
Ejecuta este SQL en Supabase Dashboard → SQL Editor:

```sql
INSERT INTO public.properties (
  name,
  description,
  address,
  city,
  region,
  base_price_clp,
  amenities,
  images,
  capacity,
  bedrooms,
  bathrooms,
  is_active
) VALUES (
  'Habitación Moderna - Viña del Mar',
  'Habitación completamente amoblada en el corazón de Viña del Mar. Ideal para estadías cortas, medianas o largas. Incluye todos los servicios básicos.',
  'TU_DIRECCIÓN_REAL',
  'Viña del Mar',
  'Valparaíso',
  35000,
  ARRAY['WiFi', 'Cocina', 'TV', 'Frigorífico', 'Baño privado'],
  ARRAY['/img/placeholder.jpg'], -- Cambiar por URLs reales después de subir a Storage
  2,
  1,
  1,
  true
);
```

**Una vez implementado el CRUD de propiedades:**
1. Ve a `/admin/propiedades`
2. Click en "Nueva Propiedad"
3. Llena el formulario con los datos reales
4. Sube fotos de la habitación
5. Activa la propiedad

---

## 🚀 TESTING DEL FLUJO COMPLETO

### Como Usuario (Flujo de Reserva)

1. **Registro**
   - Ve a la app
   - Crea una cuenta nueva
   - Verifica que llegues al landing

2. **Reserva**
   - Selecciona la propiedad
   - Elige número de días
   - Verifica que el precio dinámico funcione
   - Acepta términos y condiciones
   - Completa "pago" (simulado)
   - Verifica que se cree el booking en DB

3. **Verificación de Identidad**
   - Sube foto frontal del documento
   - Sube selfie con documento
   - Verifica que se cree el registro en `identity_verifications`
   - Deberías ver mensaje "En revisión"

### Como Admin (Flujo de Aprobación)

1. **Login como Admin**
   - Inicia sesión con tu cuenta admin
   - Ve a `/admin/dashboard`
   - Deberías ver las métricas

2. **Aprobar Verificación**
   - Ve a `/admin/verificaciones`
   - Deberías ver 1 verificación pendiente
   - Revisa las imágenes
   - Click en "Aprobar"
   - Verificar que:
     - El código de acceso se generó automáticamente
     - El booking cambió a `status='confirmed'`
     - El campo `identity_verified=true`

3. **Ver Reservas**
   - Ve a `/admin/reservas`
   - Deberías ver la reserva confirmada
   - Puedes ver el código de acceso
   - Puedes cancelar si es necesario

---

## 🔨 TAREAS PENDIENTES (OPCIONALES)

### Prioridad Alta
- [ ] Completar página `/admin/propiedades/page.tsx` (CRUD de propiedades)
- [ ] Completar página `/admin/codigos-acceso/page.tsx` (gestión de códigos)
- [ ] Subir imágenes reales de la propiedad a Storage
- [ ] Actualizar property con URLs de imágenes reales

### Prioridad Media
- [ ] Agregar paginación a las tablas del admin
- [ ] Agregar filtros avanzados en reservas
- [ ] Implementar notificaciones cuando se apruebe verificación
- [ ] Agregar dashboard de usuario (ver mis reservas)

### Prioridad Baja (Futuro)
- [ ] Integración con MercadoPago para pagos reales
- [ ] Integración con Tuya API para chapa electrónica real
- [ ] Envío de emails con Resend
- [ ] Sistema de reviews/calificaciones
- [ ] Chat entre usuario y admin

---

## 🐛 TROUBLESHOOTING

### Error: "No se puede crear booking"
- Verifica que las migraciones se aplicaron correctamente
- Verifica que el usuario esté autenticado
- Verifica que la propiedad existe y está activa

### Error: "No puedo acceder a /admin"
- Verifica que tu usuario tiene `role='admin'` en la tabla `users`
- Ejecuta: `SELECT * FROM users WHERE email = 'tu-email@example.com';`

### Error: "No puedo subir imágenes"
- Verifica que los buckets de Storage existen
- Verifica que las políticas RLS están aplicadas
- Revisa la consola del navegador para errores específicos

### Error al aprobar verificación
- Verifica que el booking existe y tiene `booking_id`
- Verifica que el usuario admin está autenticado
- Revisa la consola para errores de Supabase

---

## 📝 COMANDOS ÚTILES

```bash
# Ver logs de Supabase (local)
supabase start
supabase logs

# Resetear base de datos local
supabase db reset

# Generar tipos de TypeScript
supabase gen types typescript --local > types/supabase.ts

# Deploy a producción
npm run build
vercel deploy --prod
```

---

## 📞 SOPORTE

Si encuentras problemas, revisa:
1. Logs de Supabase Dashboard → Logs
2. Consola del navegador (F12)
3. Network tab para ver requests fallidos
4. Verifica variables de entorno en `.env.local`

---

## ✨ PRÓXIMOS PASOS

1. ✅ Aplicar migraciones
2. ✅ Crear buckets de Storage
3. ✅ Crear usuario admin
4. ✅ Agregar propiedad real
5. ✅ Testear flujo completo
6. 🚀 ¡Lanzar demo!

**¡Tu MVP está casi listo! Solo faltan configuraciones de Supabase y datos iniciales.**
