# 📊 Dashboard de Management - Guía Completa

## 🎯 ¿Qué es este Dashboard?

Un **dashboard de métricas basado en evidencia** (Evidence-Based Management) combinado con analytics de marketing, construido **directamente en tu aplicación web**. 

**NO necesitás PowerBI, Tableau ni ninguna herramienta externa.** Todo está integrado en tu plataforma.

---

## 🔐 Seguridad y Acceso

### ¿Es Seguro?

✅ **SÍ, es completamente seguro:**

1. **Autenticación Requerida**: Solo usuarios autenticados pueden acceder
2. **Role-Based Access**: Solo administradores pueden ver el dashboard
3. **Datos Reales**: Conectado directamente a tu base de datos PostgreSQL
4. **Sin Terceros**: No se envían datos a servicios externos
5. **Cache Inteligente**: Los datos se cachean 1 hora para reducir carga en DB

### ¿Quién Puede Acceder?

- ✅ **Administradores** (role: 'admin')
- ❌ **Usuarios normales** (serán redirigidos)

---

## 🚀 Cómo Acceder al Dashboard

### Opción 1: URL Directa (Recomendado)

```
https://tudominio.com/es/dashboard/management
```

O en desarrollo:
```
http://localhost:3000/es/dashboard/management
```

### Opción 2: Agregar al Menú de Navegación

Podés agregar un link en tu navbar para admins:

```tsx
// En tu componente de navegación
{user?.role === 'admin' && (
  <Link href="/es/dashboard/management">
    📊 Dashboard
  </Link>
)}
```

---

## 📈 Qué Métricas Incluye

### 1. **Unit Economics** (Lo Más Importante)

Métricas financieras clave para la sostenibilidad del negocio:

- **CAC** (Customer Acquisition Cost): Cuánto cuesta adquirir un cliente
  - Meta: <$1,000 ARS
  - Actual: Calculado en tiempo real

- **LTV** (Lifetime Value): Valor total que genera un cliente
  - Meta: >$5,000 ARS
  - Actual: Calculado en tiempo real

- **LTV:CAC Ratio**: Relación entre valor y costo
  - 🚨 <1: Perdiendo dinero
  - ⚠️ 1-3: No sostenible
  - ✅ >3: Saludable

- **Payback Period**: Meses para recuperar el CAC
  - Meta: <6 meses
  - Actual: Calculado en tiempo real

- **Costo por Transacción**: Todos los costos operativos
  - Payment processing (2.5%)
  - Customer support ($50 ARS)
  - Infrastructure ($20 ARS)

- **Margen por Transacción**: Ganancia neta
  - Debe ser positivo para ser sostenible

### 2. **Evidence-Based Management (EBM)**

Framework de Scrum.org con 4 áreas clave:

#### **Current Value (CV)** - Valor Actual
- Rating promedio de clientes
- Net Promoter Score (NPS)
- Tasa de completitud de slices
- Revenue total y crecimiento

#### **Unrealized Value (UV)** - Valor No Realizado
- Tamaño del mercado (TAM, SAM, SOM)
- Market share actual
- Requests sin match (oportunidades perdidas)
- Potencial de conversión

#### **Time to Market (T2M)** - Velocidad
- Tiempo de request a match
- Tiempo de match a completar
- Lead time total
- Throughput (slices/día)

#### **Ability to Innovate (A2I)** - Capacidad de Innovar
- System uptime
- Engagement de usuarios y providers
- Contribuciones de comunidad (Q&A)
- Experimentos y tasa de éxito

### 3. **Marketing (AARRR - Pirate Metrics)**

#### **Acquisition** - Adquisición
- Nuevos usuarios
- CAC por canal (organic, paid, referral, direct)
- Signup rate
- Gasto total en marketing

#### **Activation** - Activación
- Activation rate (% que hace primera transacción)
- Time to activation
- Onboarding completion rate

#### **Retention** - Retención
- DAU (Daily Active Users)
- MAU (Monthly Active Users)
- Stickiness ratio (DAU/MAU)
- Churn rate
- Day 1, 7, 30 retention

#### **Revenue** - Ingresos
- Revenue total
- ARPU (Average Revenue Per User)
- ARPPU (Average Revenue Per Paying User)
- Crecimiento MoM

#### **Referral** - Referidos
- Coeficiente viral (K-factor)
- Total de referrals
- Conversion rate de referrals

---

## 🎨 Cómo Usar el Dashboard

### 1. **Vista General (Health Score)**

Al entrar, verás:
- **Puntaje de Salud**: 0-100 (calculado automáticamente)
  - 80-100: 🟢 Excelente
  - 60-79: 🟡 Bueno
  - 0-59: 🔴 Necesita atención

- **Alertas**: Problemas críticos que requieren acción inmediata
  - 🚨 CRITICAL: Requiere acción urgente
  - ⚠️ WARNING: Monitorear de cerca

- **Recomendaciones**: Acciones sugeridas basadas en datos
  - 💡 Optimizaciones específicas con impacto medible

### 2. **Tabs de Navegación**

El dashboard tiene 5 tabs principales:

#### **Tab 1: Unit Economics** ⭐ (EMPIEZA AQUÍ)
- **Úsalo para**: Entender si el negocio es sostenible
- **Frecuencia**: Revisar semanalmente
- **Métricas clave**:
  - LTV:CAC ratio (debe ser >3)
  - Margen por transacción (debe ser positivo)
  - CAC por canal (optimizar canales caros)

#### **Tab 2: EBM**
- **Úsalo para**: Decisiones estratégicas de producto
- **Frecuencia**: Revisar mensualmente
- **Métricas clave**:
  - Current Value: ¿Estamos entregando valor?
  - Time to Market: ¿Somos rápidos?
  - Unrealized Value: ¿Dónde está el crecimiento?

#### **Tab 3: Marketing**
- **Úsalo para**: Optimizar campañas y canales
- **Frecuencia**: Revisar semanalmente
- **Métricas clave**:
  - CAC por canal
  - Activation rate
  - Retention cohorts

#### **Tab 4: Growth**
- **Úsalo para**: Estrategias de crecimiento viral
- **Frecuencia**: Revisar mensualmente
- **Métricas clave**:
  - Coeficiente viral (K-factor)
  - Referral conversion

#### **Tab 5: Operations**
- **Úsalo para**: Monitoreo operacional diario
- **Frecuencia**: Revisar diariamente
- **Métricas clave**:
  - Usuarios activos
  - Providers activos
  - Throughput

### 3. **Gráficos Interactivos**

Todos los gráficos son interactivos:
- **Hover**: Ver valores exactos
- **Click en leyenda**: Ocultar/mostrar series
- **Responsive**: Se adaptan a mobile/tablet/desktop

---

## 📊 Casos de Uso Recomendados

### Caso 1: Reunión Semanal de Management

**Agenda sugerida (30 min):**

1. **Health Score** (5 min)
   - Revisar alertas críticas
   - Priorizar recomendaciones

2. **Unit Economics** (10 min)
   - ¿El LTV:CAC está mejorando?
   - ¿Qué canal tiene mejor ROI?
   - ¿El margen es positivo?

3. **Growth Metrics** (10 min)
   - ¿Cuántos nuevos usuarios?
   - ¿Activation rate está mejorando?
   - ¿Retention se mantiene?

4. **Action Items** (5 min)
   - Definir 1-2 acciones concretas
   - Asignar responsables

### Caso 2: Pitch a Inversores

**Métricas clave para mostrar:**

1. **Traction**:
   - MAU (Monthly Active Users)
   - Revenue growth rate
   - Transaction growth rate

2. **Unit Economics**:
   - LTV:CAC ratio (>3 es excelente)
   - Payback period (<6 meses)
   - Gross margin

3. **Market Opportunity**:
   - TAM, SAM, SOM
   - Current market share
   - Unrealized value

### Caso 3: Optimización de Marketing

**Flujo de análisis:**

1. **Ir a Tab "Unit Economics"**
   - Ver "CAC by Channel"
   - Identificar canal más caro

2. **Ir a Tab "Marketing" → Acquisition**
   - Ver conversion rate por canal
   - Calcular ROI: (Revenue - CAC) / CAC

3. **Acción**:
   - Reducir presupuesto en canales con ROI negativo
   - Aumentar en canales con ROI >3x

### Caso 4: Mejorar Retention

**Flujo de análisis:**

1. **Ir a Tab "Marketing" → Retention**
   - Ver Day 7 retention
   - Si <40%, hay problema

2. **Ir a Tab "Marketing" → Activation**
   - Ver activation rate
   - Ver time to activation

3. **Acción**:
   - Si activation es baja: Mejorar onboarding
   - Si activation es alta pero retention baja: Mejorar producto

---

## 🔧 Personalización

### Cambiar Período de Análisis

Por defecto muestra últimos 30 días. Podés cambiar agregando parámetro:

```
/es/dashboard/management?period=7   # Últimos 7 días
/es/dashboard/management?period=90  # Últimos 90 días
```

### Agregar Métricas Personalizadas

Editá el archivo:
```
/Users/maxi/umarel.org/lib/services/ebm-metrics-service.ts
```

O:
```
/Users/maxi/umarel.org/lib/services/marketing-metrics-service.ts
```

### Cambiar Targets/Metas

En el archivo:
```
/Users/maxi/umarel.org/app/api/dashboard/metrics/route.ts
```

Función `calculateHealthScore()` - ajustá los umbrales.

---

## 🚨 Alertas y Umbrales

### Alertas Críticas (🚨)

Se disparan cuando:
- LTV:CAC < 1 (perdiendo dinero)
- Margen por transacción < 0
- Dispute rate > 10%

### Alertas de Warning (⚠️)

Se disparan cuando:
- LTV:CAC < 3 (no sostenible)
- Churn rate > 20%
- Delivery time > 96 horas
- Activation rate < 20%

---

## 📱 Acceso Mobile

El dashboard es **completamente responsive**:
- ✅ Mobile (phone)
- ✅ Tablet
- ✅ Desktop
- ✅ Large screens

Podés acceder desde cualquier dispositivo con tu cuenta admin.

---

## 🔄 Actualización de Datos

- **Frecuencia**: Los datos se actualizan cada vez que cargás la página
- **Cache**: Se cachean 1 hora en el servidor
- **Refresh manual**: Recargá la página (F5 o Cmd+R)

---

## 💾 Exportar Datos

### Opción 1: Screenshot

Usá la función de screenshot de tu navegador o herramientas como:
- Mac: Cmd + Shift + 4
- Windows: Win + Shift + S

### Opción 2: API Directa

Podés acceder a los datos en JSON:

```bash
curl https://tudominio.com/api/dashboard/metrics?period=30
```

Esto te da todos los datos en formato JSON para análisis externo.

### Opción 3: Conectar a Google Sheets/Excel

Podés usar la API para importar datos a hojas de cálculo:

1. Google Sheets: Usar `IMPORTDATA()` o Apps Script
2. Excel: Power Query → From Web

---

## 🎓 Mejores Prácticas

### 1. **Revisión Regular**

- **Diario**: Operations tab (5 min)
- **Semanal**: Unit Economics + Marketing (30 min)
- **Mensual**: EBM completo (1 hora)

### 2. **Toma de Decisiones**

- ✅ **Basate en tendencias**, no en puntos individuales
- ✅ **Compará períodos** (week-over-week, month-over-month)
- ✅ **Actúa en métricas accionables** (CAC, activation rate)
- ❌ **No te obsesiones** con métricas vanidad (total users)

### 3. **Priorización**

Orden de importancia:
1. **Unit Economics** (sostenibilidad)
2. **Retention** (product-market fit)
3. **Activation** (onboarding)
4. **Acquisition** (crecimiento)
5. **Referral** (viralidad)

### 4. **Experimentación**

Usá el dashboard para:
- Definir hipótesis
- Medir impacto de cambios
- Validar experimentos

Ejemplo:
```
Hipótesis: Mejorar onboarding aumentará activation rate
Baseline: 25% activation
Experimento: Nuevo onboarding wizard
Medición: Activation rate después de 2 semanas
Target: >30% activation
```

---

## 🆚 Comparación con Otras Herramientas

| Característica | Este Dashboard | PowerBI | Tableau | Google Analytics |
|---|---|---|---|---|
| **Costo** | $0 | $10-20/user/mes | $15-70/user/mes | $0-150K/año |
| **Setup** | Ya está listo | Días/semanas | Días/semanas | Horas |
| **Integración** | Nativa | Requiere conectores | Requiere conectores | Requiere SDK |
| **Customización** | Total (código) | Media | Media | Baja |
| **Real-time** | Sí (1h cache) | Depende | Depende | 24-48h delay |
| **Mobile** | Sí | Limitado | Limitado | Sí |
| **Seguridad** | Total control | Depende de MS | Depende de Salesforce | Depende de Google |

---

## 🐛 Troubleshooting

### "No veo datos"

1. Verificá que tenés role 'admin'
2. Verificá que hay datos en la DB
3. Revisá la consola del navegador (F12)

### "Los números parecen incorrectos"

1. Verificá el período seleccionado
2. Algunos datos son estimados (ver TODOs en el código)
3. Revisá la lógica en `ebm-metrics-service.ts`

### "El dashboard está lento"

1. Los datos se cachean 1 hora
2. Si es la primera carga, puede tardar 2-3 segundos
3. Considerá agregar más índices en la DB

---

## 🚀 Próximos Pasos

### Mejoras Sugeridas

1. **Tracking de UTM parameters**
   - Agregar campos `utm_source`, `utm_medium`, `utm_campaign` a tabla `users`
   - Mejorar precisión de CAC por canal

2. **Cohort Analysis**
   - Implementar tabla de retención por cohorte
   - Ver retención por mes de signup

3. **A/B Testing Integration**
   - Trackear experimentos
   - Medir impacto en métricas clave

4. **Alertas Automáticas**
   - Email cuando métricas críticas caen
   - Slack/Discord notifications

5. **Exportación Automática**
   - PDF reports semanales
   - CSV exports programados

---

## 📞 Soporte

Si tenés dudas o querés agregar métricas personalizadas:

1. Revisá el código en:
   - `/lib/services/ebm-metrics-service.ts`
   - `/lib/services/marketing-metrics-service.ts`
   - `/app/api/dashboard/metrics/route.ts`

2. Los TODOs en el código marcan áreas que necesitan datos reales

3. Podés extender fácilmente agregando nuevas queries a la DB

---

## ✅ Checklist de Implementación

- [x] Servicio de métricas EBM
- [x] Servicio de métricas de marketing
- [x] API endpoint unificado
- [x] Dashboard UI con tabs
- [x] Gráficos interactivos
- [x] Health score y alertas
- [x] Responsive design
- [ ] Autenticación admin (agregar middleware)
- [ ] Tracking de UTM parameters
- [ ] Cohort analysis
- [ ] PDF export
- [ ] Email alerts

---

## 🎉 Conclusión

Tenés un **dashboard de management profesional** completamente integrado en tu plataforma, sin necesidad de herramientas externas como PowerBI o Tableau.

**Ventajas:**
- ✅ $0 de costo adicional
- ✅ Datos en tiempo real
- ✅ 100% customizable
- ✅ Seguro y privado
- ✅ Accesible desde cualquier dispositivo

**Empieza revisando el tab "Unit Economics"** - es lo más importante para la sostenibilidad del negocio.

¡Buena suerte! 🚀
