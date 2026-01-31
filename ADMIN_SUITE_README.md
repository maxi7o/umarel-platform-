# 🎯 Admin Suite - Guía Rápida

## 🚀 Accesos Directos

```bash
# Dashboard EBM (Métricas de Negocio)
http://localhost:3000/es/dashboard/management

# Role Switching (Testing Multi-Rol)
http://localhost:3000/es/admin/testing
```

---

## ⚡ Setup en 3 Pasos

### 1. Hacete Admin
```bash
npx tsx scripts/make_admin.ts tu@email.com
```

### 2. Crear Usuarios de Prueba
```bash
npx tsx scripts/seed_test_users.ts
```

### 3. Arrancar Servidor
```bash
npm run dev
```

---

## 📊 Dashboard EBM - 5 Tabs

### 1. **Unit Economics** ⭐ (Empieza aquí)
- **CAC**: Costo por adquisición
- **LTV**: Lifetime value
- **LTV:CAC Ratio**: Debe ser >3
- **Margen por Transacción**: Debe ser positivo

### 2. **EBM**
- **Current Value**: Rating, NPS, Revenue
- **Unrealized Value**: Market opportunity
- **Time to Market**: Velocidad de entrega
- **Ability to Innovate**: Uptime, engagement

### 3. **Marketing (AARRR)**
- Acquisition, Activation, Retention, Revenue, Referral

### 4. **Growth**
- Coeficiente viral, Referrals

### 5. **Operations**
- Usuarios activos, Throughput

---

## 🧪 Role Switching - 3 Personas

### 👩‍💼 María Cliente
Crear requests, aceptar quotes, pagar

### 👷 Carlos Proveedor
Ver requests, crear quotes, completar trabajos

### 🛡️ Admin Sistema
Resolver disputas, ver dashboard

---

## 🔄 Flujo de Trabajo Integrado

### Validar Métricas del Dashboard

1. **Dashboard**: Anotar métricas actuales
2. **Role Switching**: Crear transacción completa
   - Cliente → Crear request
   - Provider → Crear quote
   - Cliente → Aceptar
   - Provider → Completar
   - Cliente → Pagar
3. **Dashboard**: Verificar que métricas aumentaron

### Probar Flujo de Disputa

1. **Dashboard**: Anotar dispute rate
2. **Role Switching**: Crear disputa
   - Cliente → Request
   - Provider → Completar mal
   - Cliente → Disputar
   - Admin → Resolver
3. **Dashboard**: Verificar impacto en métricas

---

## 📋 Checklist de Refinamiento

### Prioridad Alta
- [ ] Reemplazar TODOs con queries reales
- [ ] Validar cálculos de LTV, CAC
- [ ] Agregar tracking de UTM parameters
- [ ] Arreglar errores de TypeScript en charts

### Prioridad Media
- [ ] Implementar cohort analysis
- [ ] Agregar alertas automáticas
- [ ] Crear más datos sintéticos
- [ ] Mejorar visualizaciones

### Prioridad Baja
- [ ] Exportación a CSV
- [ ] Integración con Google Sheets
- [ ] Videos de demostración

---

## 🎯 Plan de 4 Semanas

### Semana 1: Validación
- Setup y testing básico
- Documentar issues

### Semana 2: Datos Reales
- Reemplazar estimados
- Validar cálculos

### Semana 3: UX
- Mejorar gráficos
- Agregar personas

### Semana 4: Automatización
- Alertas
- Scripts
- Deploy

---

## 📚 Documentación Completa

- **Guía Integrada**: `docs/ADMIN_SUITE_GUIDE.md` (este archivo con TODO el detalle)
- **Dashboard EBM**: `docs/DASHBOARD_GUIDE.md`
- **Role Switching**: `docs/TESTING_GUIDE.md`

---

## 💡 Tips Rápidos

1. **Empieza con Unit Economics** - Es lo más importante
2. **Usa Role Switching para validar** - No confíes solo en los números
3. **Prioriza datos reales** - Reemplaza estimados ASAP
4. **Itera rápido** - Deploy frecuente a staging

---

¡Listo para refinar! 🚀
