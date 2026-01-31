# 🧪 Sistema de Testing Multi-Rol

## 🎯 Problema Resuelto

**Antes**: Necesitabas 3 navegadores/sesiones diferentes para probar un flujo completo:
- Navegador 1: Cliente creando request
- Navegador 2: Provider respondiendo
- Navegador 3: Admin gestionando

**Ahora**: Un solo navegador, cambias de rol con un click.

---

## 🚀 Cómo Funciona

### 1. **Role Switcher**

Sistema que te permite "impersonar" diferentes roles sin cerrar sesión:

```
Admin (tú) → Click en "Cliente" → Ves la plataforma como cliente
```

**Características:**
- ✅ Cambio instantáneo de rol
- ✅ Mantiene tu sesión de admin
- ✅ Recarga automática de la página
- ✅ Banner visual para recordarte que estás en modo testing
- ✅ Volver a admin con un click

### 2. **Personas de Prueba**

3 personas predefinidas para testing:

#### 👩‍💼 María Cliente
- **Rol**: Cliente
- **Escenario**: Necesita remodelar su cocina
- **Email**: maria.cliente@test.com
- **Usa para**: Crear requests, aceptar quotes, aprobar trabajos

#### 👷 Carlos Proveedor
- **Rol**: Provider
- **Escenario**: Ofrece servicios de construcción
- **Email**: carlos.proveedor@test.com
- **Usa para**: Responder requests, crear quotes, completar trabajos

#### 🛡️ Admin Sistema
- **Rol**: Admin
- **Escenario**: Gestiona la plataforma
- **Email**: admin@test.com
- **Usa para**: Resolver disputas, ver dashboard, gestionar usuarios

---

## 📍 Cómo Acceder

### Opción 1: Página de Testing (Recomendado)

```
http://localhost:3000/es/admin/testing
```

Esta página incluye:
- Role Switcher
- Escenarios de prueba recomendados
- Scripts para generar datos
- Tips de testing

### Opción 2: Agregar al Navbar

Podés agregar un link en tu navbar para admins:

```tsx
{user?.role === 'admin' && (
  <Link href="/es/admin/testing">
    🧪 Testing
  </Link>
)}
```

---

## 🎬 Flujo de Uso

### Ejemplo: Probar Flujo Completo de Request

1. **Ir a página de testing**
   ```
   http://localhost:3000/es/admin/testing
   ```

2. **Cambiar a Cliente**
   - Click en card "María Cliente"
   - Página se recarga
   - Ves banner naranja arriba: "MODO TESTING: Viendo como 👩‍💼 María Cliente"

3. **Crear Request**
   - Ir a `/es/requests/create`
   - Crear request de remodelación
   - Completar wizard

4. **Cambiar a Provider**
   - Click en banner → "Volver a Admin"
   - Ir a `/es/admin/testing`
   - Click en "Carlos Proveedor"

5. **Responder Request**
   - Ver request en browse
   - Crear quote
   - Enviar propuesta

6. **Cambiar a Cliente**
   - Volver a admin
   - Cambiar a "María Cliente"
   - Ver quote recibido
   - Aceptar quote

7. **Cambiar a Provider**
   - Volver a admin
   - Cambiar a "Carlos Proveedor"
   - Marcar trabajo como completado

8. **Cambiar a Cliente**
   - Volver a admin
   - Cambiar a "María Cliente"
   - Aprobar trabajo
   - Realizar pago

9. **Volver a Admin**
   - Click en "Volver a Admin"
   - Verificar transacción en dashboard

---

## 🛠️ Setup Inicial

### 1. Crear Usuarios de Prueba

```bash
npm run script scripts/seed_test_users.ts
```

Esto crea 3 usuarios en la DB:
- maria.cliente@test.com
- carlos.proveedor@test.com  
- admin@test.com

### 2. (Opcional) Crear Auth Users en Supabase

Si querés poder loguearte directamente con estos usuarios:

```sql
-- En Supabase SQL Editor
-- Nota: Esto es opcional, el Role Switcher funciona sin esto
```

O usa el Role Switcher directamente (recomendado).

---

## 📋 Escenarios de Prueba Recomendados

### Escenario 1: Flujo Completo de Request ⭐

**Roles**: Cliente → Provider → Cliente

1. **Cliente**: Crear request de remodelación
2. **Provider**: Ver request y crear quote
3. **Cliente**: Aceptar quote
4. **Provider**: Completar trabajo
5. **Cliente**: Aprobar y pagar

**Qué validar:**
- ✅ Notificaciones llegan correctamente
- ✅ Estados cambian apropiadamente
- ✅ Cálculos de pago son correctos
- ✅ Cada rol ve solo lo que debe ver

### Escenario 2: Flujo de Disputa

**Roles**: Cliente → Provider → Cliente → Admin

1. **Cliente**: Crear request
2. **Provider**: Completar trabajo (mal hecho)
3. **Cliente**: Disputar trabajo
4. **Admin**: Revisar evidencia
5. **Admin**: Resolver disputa

**Qué validar:**
- ✅ Sistema de evidencia funciona
- ✅ AI judge analiza correctamente
- ✅ Refunds se procesan bien
- ✅ Notificaciones de resolución

### Escenario 3: Q&A Comunitario

**Roles**: Cliente → Provider 1 → Provider 2 → Cliente

1. **Cliente**: Hacer pregunta en request
2. **Provider 1**: Responder pregunta
3. **Provider 2**: Responder pregunta
4. **Cliente**: Marcar mejor respuesta
5. **Provider 1**: Recibir recompensa

**Qué validar:**
- ✅ Sistema de recompensas funciona
- ✅ Múltiples respuestas permitidas
- ✅ Solo una puede ser "mejor respuesta"

### Escenario 4: Material Advance (Acopio)

**Roles**: Cliente → Provider → Cliente → Provider → Cliente

1. **Cliente**: Crear request con materiales
2. **Provider**: Quote con acopio 40%
3. **Cliente**: Aprobar y pagar acopio
4. **Provider**: Marcar materiales comprados
5. **Provider**: Completar trabajo
6. **Cliente**: Pagar balance

**Qué validar:**
- ✅ Cálculo de 40% correcto
- ✅ Dos pagos separados
- ✅ Provider recibe acopio antes de completar

---

## 🎨 Indicadores Visuales

### Banner de Testing

Cuando estás en modo testing, verás un banner naranja en la parte superior:

```
🔍 MODO TESTING: Viendo como 👩‍💼 María Cliente (client)
[Volver a Admin] [X]
```

**Características:**
- Siempre visible para recordarte que estás impersonando
- Click en "Volver a Admin" para restaurar
- Click en "X" para ocultar (sigue activo)

### Cards de Rol

En la página de testing, cada rol tiene un card visual:
- **Azul**: Cliente
- **Verde**: Provider
- **Morado**: Admin

El rol activo tiene un borde naranja y badge "Activo".

---

## 🔒 Seguridad

### Quién Puede Usar Role Switcher

**Solo administradores** (`role = 'admin'`)

Si un usuario normal intenta:
```
POST /api/admin/role-switch
→ 403 Forbidden
```

### Cómo Funciona

1. Verificación de admin en API
2. Cookie HTTP-only con rol impersonado
3. Cookie expira en 24 horas
4. No modifica la DB (solo cookie)

### Datos Persistentes

El Role Switcher **NO** cambia:
- Tu sesión de Supabase
- Tu user ID en la DB
- Tus permisos reales

Solo cambia:
- Cómo ves la UI
- Qué acciones podés hacer
- Qué datos ves

---

## 🧩 Integración con Código Existente

### Middleware (Opcional)

Si querés que el role switch afecte permisos:

```tsx
// middleware.ts
import { cookies } from 'next/headers';

export async function middleware(request: Request) {
    const cookieStore = await cookies();
    const roleSwitchCookie = cookieStore.get('role_switch');
    
    if (roleSwitchCookie) {
        const roleSwitch = JSON.parse(roleSwitchCookie.value);
        // Use roleSwitch.impersonatedRole for permissions
    }
}
```

### Componentes

Mostrar banner en layout:

```tsx
// app/[locale]/layout.tsx
import { RoleSwitchBanner } from '@/components/admin/role-switch-banner';

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <RoleSwitchBanner />
                {children}
            </body>
        </html>
    );
}
```

---

## 📊 Scripts de Datos de Prueba

### Generar Usuarios

```bash
npm run script scripts/seed_test_users.ts
```

Crea:
- María Cliente
- Carlos Proveedor
- Admin Sistema

### Generar Requests (TODO)

```bash
npm run script scripts/seed_test_requests.ts
```

Crea 10 requests en diferentes estados:
- 3 open
- 3 in_progress
- 2 completed
- 2 disputed

### Generar Transacciones (TODO)

```bash
npm run script scripts/seed_test_transactions.ts
```

Crea transacciones completas con:
- Quotes aceptados
- Pagos procesados
- Slices completados

### Reset Completo

```bash
npm run db:reset
npm run script scripts/seed_test_users.ts
```

⚠️ **Cuidado**: Borra toda la DB

---

## 💡 Tips de Testing

### 1. Usa el Role Switcher en Lugar de Múltiples Navegadores

**Antes**:
```
Chrome Incognito → Cliente
Firefox → Provider
Safari → Admin
```

**Ahora**:
```
Un solo navegador → Role Switcher
```

### 2. Prueba Flujos Completos

No pruebes features aisladas. Prueba el journey completo:
```
Request → Quote → Accept → Complete → Pay
```

### 3. Valida Notificaciones

Cada cambio de rol, verifica:
- ✅ ¿Llegó notificación?
- ✅ ¿Email enviado?
- ✅ ¿Badge de notificaciones actualizado?

### 4. Verifica Permisos

En cada rol, intenta acciones prohibidas:
- Cliente no debe poder aprobar su propio trabajo
- Provider no debe ver requests de otros
- etc.

### 5. Prueba Edge Cases

- ¿Qué pasa si cancelo?
- ¿Qué pasa si disputo?
- ¿Qué pasa si no pago?

---

## 🐛 Troubleshooting

### "No puedo cambiar de rol"

**Causa**: No eres admin

**Solución**:
```bash
npm run script scripts/make_admin.ts
# Ingresa tu email
```

### "El banner no aparece"

**Causa**: Cookie no se guardó

**Solución**:
1. Abrí DevTools → Application → Cookies
2. Verificá que existe `role_switch`
3. Si no existe, intentá de nuevo

### "Veo datos incorrectos"

**Causa**: Cache del navegador

**Solución**:
1. Hard refresh: Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
2. O limpia cookies

### "No puedo volver a admin"

**Solución**:
```bash
# Manualmente borrar cookie
# DevTools → Application → Cookies → Delete role_switch
```

O visitá:
```
/api/admin/role-switch (DELETE request)
```

---

## 🎯 Checklist de Testing

Antes de deployar a producción:

- [ ] Flujo completo de request funciona
- [ ] Sistema de pagos calcula correctamente
- [ ] Disputas se resuelven apropiadamente
- [ ] Notificaciones llegan a todos los roles
- [ ] Permisos están correctos (cada rol ve lo que debe)
- [ ] Material advance funciona (40% upfront)
- [ ] Q&A comunitario funciona
- [ ] Refunds se procesan correctamente
- [ ] Dashboard muestra métricas correctas
- [ ] Mobile experience es buena para todos los roles

---

## 🚀 Próximos Pasos

### Mejoras Sugeridas

1. **Playwright Tests**
   - Automatizar escenarios con Playwright
   - Usar Role Switcher en tests E2E

2. **Datos Sintéticos Realistas**
   - Generar 100+ requests
   - Generar transacciones históricas
   - Poblar Q&A con preguntas reales

3. **Testing Dashboard**
   - Ver todos los flujos activos
   - Métricas de testing
   - Coverage de escenarios

4. **Snapshot Testing**
   - Guardar estado antes de test
   - Restaurar después de test
   - No contaminar DB de desarrollo

---

## ✅ Resumen

**Problema**: Difícil probar flujos multi-rol

**Solución**: Role Switcher + Página de Testing

**Beneficios**:
- ✅ Un solo navegador
- ✅ Cambio instantáneo de rol
- ✅ Escenarios predefinidos
- ✅ Datos de prueba fáciles
- ✅ Visual feedback claro

**Acceso**:
```
http://localhost:3000/es/admin/testing
```

**Uso**:
1. Click en rol
2. Prueba feature
3. Volver a admin
4. Repetir

¡Eso es todo! 🎉
