# 🧪 Sistema de Testing Multi-Rol - Quick Start

## 🎯 Problema Resuelto

**Antes**: 3 navegadores para probar un flujo
**Ahora**: 1 navegador, cambias de rol con un click

---

## 🚀 Acceso Rápido

```
http://localhost:3000/es/admin/testing
```

---

## 💡 Cómo Funciona

1. **Click en un rol** (Cliente, Provider, Admin)
2. **Página se recarga** automáticamente
3. **Ves la plataforma** como ese usuario
4. **Prueba el flujo** que necesites
5. **Volver a Admin** con un click

---

## 👥 Roles Disponibles

### 👩‍💼 María Cliente
- Crear requests
- Aceptar quotes
- Aprobar trabajos
- Pagar

### 👷 Carlos Proveedor
- Ver requests
- Crear quotes
- Completar trabajos
- Recibir pagos

### 🛡️ Admin Sistema
- Resolver disputas
- Ver dashboard
- Gestionar plataforma

---

## 📋 Escenarios de Prueba

### 1. Flujo Completo de Request
```
Cliente → Crear request
Provider → Crear quote
Cliente → Aceptar quote
Provider → Completar trabajo
Cliente → Aprobar y pagar
```

### 2. Flujo de Disputa
```
Cliente → Crear request
Provider → Completar (mal)
Cliente → Disputar
Admin → Resolver
```

### 3. Material Advance
```
Cliente → Request con materiales
Provider → Quote con acopio 40%
Cliente → Pagar acopio
Provider → Completar
Cliente → Pagar balance
```

---

## 🛠️ Setup

### 1. Crear Usuarios de Prueba

```bash
npm run script scripts/seed_test_users.ts
```

### 2. Asegurate de ser Admin

```bash
npm run script scripts/make_admin.ts
# Ingresa tu email
```

### 3. Accede a Testing Page

```
http://localhost:3000/es/admin/testing
```

---

## 🎨 Indicador Visual

Cuando estés en modo testing, verás un **banner naranja** arriba:

```
🔍 MODO TESTING: Viendo como 👩‍💼 María Cliente
[Volver a Admin]
```

---

## 📖 Documentación Completa

Ver: `docs/TESTING_GUIDE.md`

---

## ✅ Archivos Creados

```
lib/services/
  └── role-switch-service.ts       # Lógica de role switching

app/api/admin/
  └── role-switch/route.ts         # API endpoint

app/[locale]/admin/
  └── testing/page.tsx             # Página de testing

components/admin/
  ├── role-switcher.tsx            # UI del switcher
  └── role-switch-banner.tsx       # Banner visual

scripts/
  └── seed_test_users.ts           # Crear usuarios de prueba

docs/
  └── TESTING_GUIDE.md             # Guía completa
```

---

## 🔐 Seguridad

- ✅ Solo admins pueden usar Role Switcher
- ✅ Cookie HTTP-only (24h)
- ✅ No modifica DB
- ✅ Solo afecta vista

---

## 💡 Tips

1. **Usa Role Switcher** en lugar de múltiples navegadores
2. **Prueba flujos completos** de principio a fin
3. **Verifica notificaciones** en cada paso
4. **Valida permisos** (cada rol ve lo que debe)
5. **Prueba edge cases** (cancelaciones, disputas)

---

## 🎉 ¡Listo!

Ya podés probar flujos completos sin complicaciones.

**Próximo paso**: Visitá `/es/admin/testing` y empezá a probar 🚀
