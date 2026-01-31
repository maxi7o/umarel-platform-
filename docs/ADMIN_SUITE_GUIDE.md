# 🎯 Admin Suite - Dashboard EBM + Role Switching

## 📋 Índice

1. [Setup Inicial](#setup-inicial)
2. [Dashboard EBM - Métricas de Negocio](#dashboard-ebm)
3. [Role Switching - Testing Multi-Rol](#role-switching)
4. [Flujo de Trabajo Integrado](#flujo-de-trabajo-integrado)
5. [Refinamiento y Mejoras](#refinamiento-y-mejoras)

---

## 🚀 Setup Inicial

### Paso 1: Asegurate de Ser Admin

```bash
# Opción A: Hacer admin a tu usuario existente
npx tsx scripts/make_admin.ts tu@email.com

# Opción B: Verificar en la DB
# En Supabase SQL Editor o tu DB:
SELECT email, role FROM users WHERE email = 'tu@email.com';

# Si no es admin, actualizar:
UPDATE users SET role = 'admin' WHERE email = 'tu@email.com';
```

### Paso 2: Crear Usuarios de Prueba

```bash
# Crea 3 usuarios: María Cliente, Carlos Proveedor, Admin Sistema
npx tsx scripts/seed_test_users.ts
```

Esto crea en la DB:
- `maria.cliente@test.com` (Cliente)
- `carlos.proveedor@test.com` (Provider)
- `admin@test.com` (Admin)

### Paso 3: Verificar que el Servidor Esté Corriendo

```bash
npm run dev
```

Deberías ver:
```
✓ Ready in 2s
Local: http://localhost:3000
```

---

## 📊 Dashboard EBM - Métricas de Negocio

### Acceso

```
http://localhost:3000/es/dashboard/management
```

### ¿Qué Incluye?

El dashboard tiene **5 tabs principales**:

#### 1. **Unit Economics** ⭐ (MÁS IMPORTANTE)

**Para qué sirve**: Entender si el negocio es sostenible financieramente.

**Métricas clave**:
- **CAC** (Customer Acquisition Cost): Cuánto cuesta adquirir un cliente
  - Target: <$1,000 ARS
  - Actual: Calculado en tiempo real desde marketing spend / nuevos usuarios

- **LTV** (Lifetime Value): Valor total que genera un cliente
  - Target: >$5,000 ARS
  - Cálculo: ARPU × (1 / Churn Rate)

- **LTV:CAC Ratio**: Relación entre valor y costo
  - 🚨 <1: Perdiendo dinero en cada cliente
  - ⚠️ 1-3: No sostenible a largo plazo
  - ✅ >3: Saludable y escalable

- **Payback Period**: Meses para recuperar el CAC
  - Target: <6 meses
  - Cálculo: CAC / Monthly Revenue per User

- **Margen por Transacción**: Ganancia neta por transacción
  - Debe ser positivo para ser sostenible
  - Incluye: Platform fee - (Payment processing + Support + Infrastructure)

- **CAC por Canal**: Desglose por fuente de tráfico
  - Organic (SEO, directo)
  - Paid Social (Instagram, Facebook)
  - Referral (programa de referidos)
  - Direct (tráfico directo)

**Cómo refinarlo**:
1. Verificar que los cálculos sean correctos
2. Agregar tracking de UTM parameters para CAC real por canal
3. Validar que los costos operacionales sean realistas

#### 2. **EBM (Evidence-Based Management)**

**Para qué sirve**: Decisiones estratégicas de producto basadas en evidencia.

**4 Key Value Areas**:

##### **Current Value (CV)** - Valor Actual
- Rating promedio de clientes (0-100)
- Net Promoter Score (NPS)
- Tasa de completitud de slices
- Revenue total y crecimiento MoM

**Cómo refinarlo**:
- Verificar que el cálculo de NPS sea correcto
- Validar que la tasa de completitud refleje la realidad

##### **Unrealized Value (UV)** - Valor No Realizado
- Tamaño del mercado (TAM, SAM, SOM)
- Market share actual
- Requests sin match (oportunidades perdidas)
- Potencial de conversión

**Cómo refinarlo**:
- Ajustar TAM/SAM/SOM con datos reales del mercado argentino
- Calcular conversion rate real desde requests abiertos

##### **Time to Market (T2M)** - Velocidad de Entrega
- Tiempo de request a match (horas)
- Tiempo de match a completar (horas)
- Lead time total
- Throughput (slices/día)

**Cómo refinarlo**:
- Verificar que los cálculos de tiempo sean precisos
- Agregar percentiles (p50, p90, p95) para mejor visibilidad

##### **Ability to Innovate (A2I)** - Capacidad de Innovar
- System uptime (%)
- Engagement de usuarios y providers
- Contribuciones de comunidad (Q&A)
- Experimentos y tasa de éxito

**Cómo refinarlo**:
- Implementar tracking real de uptime
- Agregar sistema de experimentos (A/B tests)

#### 3. **Marketing (AARRR - Pirate Metrics)**

**Para qué sirve**: Optimizar campañas y canales de adquisición.

**5 Etapas del Funnel**:

- **Acquisition**: Nuevos usuarios, CAC, Signup rate
- **Activation**: Activation rate, Time to activation
- **Retention**: DAU, MAU, Churn rate, Cohorts
- **Revenue**: ARPU, ARPPU, Growth rate
- **Referral**: K-factor, Referral conversion

**Cómo refinarlo**:
- Implementar tracking de eventos de activación
- Crear cohort analysis real
- Agregar retention curves

#### 4. **Growth**

**Para qué sirve**: Estrategias de crecimiento viral.

- Coeficiente viral (K-factor)
- Total de referrals
- Crecimiento orgánico

**Cómo refinarlo**:
- Implementar programa de referidos real
- Trackear source de cada signup

#### 5. **Operations**

**Para qué sirve**: Monitoreo operacional diario.

- Usuarios activos
- Providers activos
- Throughput (slices/semana)

**Cómo refinarlo**:
- Agregar alertas automáticas
- Implementar SLAs

### Health Score

El dashboard calcula automáticamente un **Health Score (0-100)** basado en:
- 40% EBM metrics
- 40% Marketing metrics
- 20% Unit economics

**Interpretación**:
- 80-100: 🟢 Excelente
- 60-79: 🟡 Bueno
- 0-59: 🔴 Necesita atención

### Alertas y Recomendaciones

El sistema genera automáticamente:

**Alertas Críticas (🚨)**:
- LTV:CAC < 1
- Margen por transacción < 0
- Dispute rate > 10%

**Alertas de Warning (⚠️)**:
- LTV:CAC < 3
- Churn rate > 20%
- Delivery time > 96h
- Activation rate < 20%

**Recomendaciones (💡)**:
- Acciones específicas basadas en datos
- Priorizadas por impacto

---

## 🧪 Role Switching - Testing Multi-Rol

### Acceso

```
http://localhost:3000/es/admin/testing
```

### ¿Qué Incluye?

**Role Switcher** con 3 personas predefinidas:

#### 👩‍💼 María Cliente
- **Escenario**: Necesita remodelar su cocina
- **Usa para**: 
  - Crear requests
  - Aceptar quotes
  - Aprobar trabajos
  - Realizar pagos
  - Disputar trabajos

#### 👷 Carlos Proveedor
- **Escenario**: Ofrece servicios de construcción
- **Usa para**:
  - Ver requests disponibles
  - Crear quotes
  - Completar trabajos
  - Recibir pagos
  - Responder disputas

#### 🛡️ Admin Sistema
- **Escenario**: Gestiona la plataforma
- **Usa para**:
  - Resolver disputas
  - Ver dashboard
  - Gestionar usuarios
  - Moderar contenido

### Cómo Funciona

1. **Click en un rol** → Página se recarga
2. **Ves banner naranja** → "MODO TESTING: Viendo como..."
3. **Prueba el flujo** → Crea requests, quotes, etc.
4. **Volver a Admin** → Click en banner

### Escenarios de Prueba Recomendados

#### Escenario 1: Flujo Completo de Request ⭐

```
1. Cliente → Crear request de remodelación
   - Ir a /es/requests/create
   - Completar wizard
   - Publicar request

2. Provider → Ver request y crear quote
   - Ir a /es/browse
   - Buscar request
   - Crear quote con precio y timeline

3. Cliente → Aceptar quote
   - Ver quotes recibidos
   - Comparar opciones
   - Aceptar mejor quote

4. Provider → Completar trabajo
   - Marcar slice como completado
   - Subir evidencia (fotos)

5. Cliente → Aprobar y pagar
   - Revisar trabajo
   - Aprobar
   - Realizar pago
```

**Qué validar**:
- ✅ Notificaciones llegan a cada rol
- ✅ Estados cambian correctamente
- ✅ Cálculos de pago son correctos
- ✅ Cada rol ve solo lo que debe ver

#### Escenario 2: Flujo de Disputa

```
1. Cliente → Crear request
2. Provider → Completar trabajo (mal hecho)
3. Cliente → Disputar
   - Subir evidencia
   - Explicar problema
4. Admin → Revisar evidencia
   - Ver ambos lados
   - Analizar con AI judge
5. Admin → Resolver disputa
   - Decidir ganador
   - Procesar refund si aplica
```

**Qué validar**:
- ✅ Sistema de evidencia funciona
- ✅ AI judge analiza correctamente
- ✅ Refunds se procesan
- ✅ Ambas partes reciben notificación

#### Escenario 3: Material Advance (Acopio)

```
1. Cliente → Request con materiales
2. Provider → Quote con acopio 40%
3. Cliente → Aprobar y pagar acopio
4. Provider → Marcar materiales comprados
5. Provider → Completar trabajo
6. Cliente → Pagar balance (60%)
```

**Qué validar**:
- ✅ Cálculo de 40% correcto
- ✅ Dos pagos separados funcionan
- ✅ Provider recibe acopio antes de completar

#### Escenario 4: Q&A Comunitario

```
1. Cliente → Hacer pregunta en request
2. Provider 1 → Responder pregunta
3. Provider 2 → Responder pregunta
4. Cliente → Marcar mejor respuesta
5. Provider 1 → Recibir recompensa
```

**Qué validar**:
- ✅ Sistema de recompensas funciona
- ✅ Solo una respuesta puede ser "mejor"
- ✅ Recompensa se acredita correctamente

### Cómo Refinarlo

1. **Agregar más personas**:
   - Provider especializado (plomero)
   - Cliente corporativo
   - Super admin

2. **Mejorar persistencia**:
   - Guardar estado del test
   - Poder "rewind" a paso anterior

3. **Agregar datos sintéticos**:
   - Generar 100+ requests
   - Generar transacciones históricas
   - Poblar Q&A con preguntas reales

---

## 🔄 Flujo de Trabajo Integrado

### Caso de Uso 1: Validar Métricas del Dashboard

**Objetivo**: Verificar que las métricas del dashboard reflejen la realidad.

**Flujo**:

1. **Ir al Dashboard EBM**
   ```
   http://localhost:3000/es/dashboard/management
   ```

2. **Anotar métricas actuales**:
   - Total de usuarios: X
   - Total de transacciones: Y
   - Revenue total: Z
   - CAC: W

3. **Ir a Role Switching**
   ```
   http://localhost:3000/es/admin/testing
   ```

4. **Crear transacción completa**:
   - Cambiar a Cliente
   - Crear request
   - Cambiar a Provider
   - Crear quote
   - Cambiar a Cliente
   - Aceptar quote
   - Cambiar a Provider
   - Completar trabajo
   - Cambiar a Cliente
   - Aprobar y pagar

5. **Volver al Dashboard**
   - Refrescar página (F5)
   - Verificar que métricas aumentaron:
     - Total transacciones: Y + 1
     - Revenue total: Z + monto de la transacción
     - Throughput: Aumentó

6. **Validar cálculos**:
   - ¿El revenue aumentó correctamente?
   - ¿El platform fee se calculó bien?
   - ¿Las métricas de tiempo son precisas?

### Caso de Uso 2: Probar Flujo de Disputa y Ver Impacto

**Objetivo**: Validar que las disputas afectan correctamente las métricas.

**Flujo**:

1. **Dashboard: Anotar dispute rate actual**
   - Tab EBM → Current Value → Dispute Rate

2. **Role Switching: Crear disputa**
   - Cliente → Crear request
   - Provider → Completar mal
   - Cliente → Disputar
   - Admin → Resolver

3. **Dashboard: Verificar impacto**
   - Dispute rate aumentó
   - Provider rating bajó
   - Alert apareció si dispute rate > 10%

4. **Refinar**:
   - ¿El cálculo de dispute rate es correcto?
   - ¿Las alertas se disparan apropiadamente?
   - ¿El impacto en rating es justo?

### Caso de Uso 3: Optimizar CAC por Canal

**Objetivo**: Usar datos reales para optimizar marketing.

**Flujo**:

1. **Dashboard: Ver CAC por canal**
   - Tab Unit Economics → CAC by Channel
   - Identificar canal más caro

2. **Role Switching: Simular usuarios de diferentes canales**
   - Crear 5 usuarios "organic"
   - Crear 5 usuarios "paid social"
   - Crear 5 usuarios "referral"

3. **Dashboard: Comparar conversión**
   - ¿Qué canal tiene mejor conversion rate?
   - ¿Qué canal tiene mejor LTV?

4. **Decisión**:
   - Reducir presupuesto en canal con ROI negativo
   - Aumentar en canal con ROI >3x

### Caso de Uso 4: Mejorar Time to Market

**Objetivo**: Reducir tiempo de request a completar.

**Flujo**:

1. **Dashboard: Anotar tiempos actuales**
   - Tab EBM → Time to Market
   - Average time to match: X horas
   - Average time to complete: Y horas

2. **Role Switching: Probar optimizaciones**
   - Cambiar a Provider
   - Responder request en <1 hora
   - Completar trabajo en <24 horas

3. **Dashboard: Verificar mejora**
   - ¿Los promedios bajaron?
   - ¿El throughput aumentó?

4. **Implementar mejoras**:
   - Notificaciones push para providers
   - Incentivos por respuesta rápida
   - Penalizaciones por demoras

---

## 🛠️ Refinamiento y Mejoras

### Prioridad 1: Datos Reales (Alta Prioridad)

**Problema**: Muchas métricas usan valores estimados o hardcoded.

**Solución**:

1. **Identificar TODOs en el código**:
   ```bash
   grep -r "TODO" lib/services/ebm-metrics-service.ts
   grep -r "TODO" lib/services/marketing-metrics-service.ts
   ```

2. **Reemplazar con queries reales**:
   ```typescript
   // Antes (hardcoded)
   day1Retention: 45,
   
   // Después (query real)
   const [retentionData] = await db
     .select({
       retained: count(),
     })
     .from(users)
     .where(
       sql`${users.lastActiveAt} > ${users.createdAt} + INTERVAL '1 day'`
     );
   ```

3. **Prioridad de métricas a arreglar**:
   - ✅ Revenue (ya está)
   - ✅ Transactions (ya está)
   - ⚠️ Retention cohorts (estimado)
   - ⚠️ CAC por canal (estimado)
   - ⚠️ Activation rate (parcial)
   - ⚠️ NPS (estimado)

### Prioridad 2: Tracking de UTM Parameters (Media Prioridad)

**Problema**: No sabemos de dónde vienen los usuarios realmente.

**Solución**:

1. **Agregar campos a tabla users**:
   ```sql
   ALTER TABLE users ADD COLUMN utm_source VARCHAR(255);
   ALTER TABLE users ADD COLUMN utm_medium VARCHAR(255);
   ALTER TABLE users ADD COLUMN utm_campaign VARCHAR(255);
   ```

2. **Capturar en signup**:
   ```typescript
   // app/[locale]/auth/signup/page.tsx
   const searchParams = new URLSearchParams(window.location.search);
   const utmSource = searchParams.get('utm_source');
   const utmMedium = searchParams.get('utm_medium');
   const utmCampaign = searchParams.get('utm_campaign');
   
   // Guardar en DB al crear usuario
   ```

3. **Usar en dashboard**:
   ```typescript
   // Calcular CAC real por canal
   const [channelData] = await db
     .select({
       channel: users.utmSource,
       users: count(),
     })
     .from(users)
     .groupBy(users.utmSource);
   ```

### Prioridad 3: Cohort Analysis (Media Prioridad)

**Problema**: No vemos retención por cohorte de signup.

**Solución**:

1. **Crear tabla de cohorts**:
   ```sql
   CREATE TABLE user_cohorts (
     cohort_month DATE,
     users_count INT,
     day_1_retained INT,
     day_7_retained INT,
     day_30_retained INT,
     day_90_retained INT
   );
   ```

2. **Calcular cohorts**:
   ```typescript
   // Script para calcular cohorts
   // scripts/calculate_cohorts.ts
   ```

3. **Mostrar en dashboard**:
   - Tabla de retención por cohorte
   - Gráfico de retention curves

### Prioridad 4: Alertas Automáticas (Baja Prioridad)

**Problema**: Tenés que entrar al dashboard para ver problemas.

**Solución**:

1. **Crear sistema de alertas**:
   ```typescript
   // lib/services/alert-service.ts
   export async function checkAlerts() {
     const metrics = await getEBMMetrics();
     
     if (metrics.unitEconomics.ltvCacRatio < 1) {
       await sendAlert({
         level: 'critical',
         message: 'LTV:CAC ratio < 1',
         channel: 'email',
       });
     }
   }
   ```

2. **Ejecutar con cron**:
   ```typescript
   // app/api/cron/check-alerts/route.ts
   export async function GET() {
     await checkAlerts();
     return NextResponse.json({ ok: true });
   }
   ```

3. **Configurar Vercel Cron**:
   ```json
   // vercel.json
   {
     "crons": [{
       "path": "/api/cron/check-alerts",
       "schedule": "0 9 * * *"
     }]
   }
   ```

### Prioridad 5: Gráficos Mejorados (Baja Prioridad)

**Problema**: Algunos gráficos tienen errores de TypeScript.

**Solución**:

1. **Arreglar tipos en charts.tsx**:
   ```typescript
   // Cambiar
   formatter={(value: number) => ...}
   
   // Por
   formatter={(value: any) => ...}
   ```

2. **Agregar más visualizaciones**:
   - Revenue trend (últimos 30 días)
   - Funnel de conversión
   - Heatmap de actividad

### Prioridad 6: Exportación de Datos (Baja Prioridad)

**Problema**: No podés exportar datos para análisis externo.

**Solución**:

1. **Agregar botón de export**:
   ```tsx
   <Button onClick={exportToCSV}>
     📊 Exportar a CSV
   </Button>
   ```

2. **Generar CSV**:
   ```typescript
   function exportToCSV(data: any) {
     const csv = convertToCSV(data);
     downloadFile(csv, 'metrics.csv');
   }
   ```

3. **Integración con Google Sheets**:
   - API endpoint para Google Sheets
   - Auto-sync cada 24h

---

## 📝 Checklist de Refinamiento

### Dashboard EBM

- [ ] **Datos Reales**
  - [ ] Reemplazar todos los TODOs con queries reales
  - [ ] Validar cálculos de LTV, CAC, NPS
  - [ ] Agregar tracking de UTM parameters

- [ ] **Visualizaciones**
  - [ ] Arreglar errores de TypeScript en charts
  - [ ] Agregar revenue trend chart
  - [ ] Agregar funnel chart
  - [ ] Agregar retention cohort table

- [ ] **Alertas**
  - [ ] Implementar sistema de alertas
  - [ ] Configurar email notifications
  - [ ] Agregar Slack/Discord integration

- [ ] **Performance**
  - [ ] Optimizar queries lentas
  - [ ] Agregar índices en DB
  - [ ] Implementar cache más agresivo

- [ ] **UX**
  - [ ] Agregar tooltips explicativos
  - [ ] Agregar filtros de fecha
  - [ ] Agregar comparación de períodos

### Role Switching

- [ ] **Funcionalidad**
  - [ ] Verificar que funciona con Supabase auth
  - [ ] Agregar más personas (plomero, corporativo)
  - [ ] Implementar "save state" para tests

- [ ] **Datos de Prueba**
  - [ ] Crear script para generar 100+ requests
  - [ ] Crear script para generar transacciones
  - [ ] Poblar Q&A con preguntas reales

- [ ] **UX**
  - [ ] Mejorar banner visual
  - [ ] Agregar shortcuts de teclado
  - [ ] Agregar "test recorder" para grabar flujos

- [ ] **Integración**
  - [ ] Agregar banner a layout principal
  - [ ] Agregar link en navbar para admins
  - [ ] Integrar con Playwright para E2E tests

### Integración

- [ ] **Flujos Validados**
  - [ ] Flujo completo de request
  - [ ] Flujo de disputa
  - [ ] Flujo de material advance
  - [ ] Flujo de Q&A

- [ ] **Métricas Validadas**
  - [ ] Revenue tracking correcto
  - [ ] CAC calculation correcto
  - [ ] LTV calculation correcto
  - [ ] Retention tracking correcto

- [ ] **Documentación**
  - [ ] Videos de demostración
  - [ ] Screenshots actualizados
  - [ ] Casos de uso documentados

---

## 🎯 Plan de Acción Sugerido

### Semana 1: Validación Básica

**Objetivo**: Asegurar que todo funciona.

1. **Día 1-2: Setup**
   - [ ] Hacer admin a tu usuario
   - [ ] Crear usuarios de prueba
   - [ ] Acceder a ambos dashboards

2. **Día 3-4: Testing**
   - [ ] Probar flujo completo de request
   - [ ] Verificar que métricas se actualizan
   - [ ] Probar flujo de disputa

3. **Día 5: Documentar Issues**
   - [ ] Listar bugs encontrados
   - [ ] Listar mejoras necesarias
   - [ ] Priorizar por impacto

### Semana 2: Refinamiento de Datos

**Objetivo**: Reemplazar datos estimados con reales.

1. **Día 1-2: Queries**
   - [ ] Identificar todos los TODOs
   - [ ] Escribir queries reales
   - [ ] Testear performance

2. **Día 3-4: Validación**
   - [ ] Comparar con datos esperados
   - [ ] Ajustar cálculos si necesario
   - [ ] Agregar tests unitarios

3. **Día 5: Deploy**
   - [ ] Commit cambios
   - [ ] Deploy a staging
   - [ ] Validar en staging

### Semana 3: Mejoras de UX

**Objetivo**: Hacer más usable y visual.

1. **Día 1-2: Gráficos**
   - [ ] Arreglar errores de TypeScript
   - [ ] Agregar nuevas visualizaciones
   - [ ] Mejorar tooltips

2. **Día 3-4: Role Switching**
   - [ ] Mejorar banner
   - [ ] Agregar más personas
   - [ ] Crear datos sintéticos

3. **Día 5: Testing**
   - [ ] Probar con usuarios reales
   - [ ] Recoger feedback
   - [ ] Ajustar según feedback

### Semana 4: Automatización

**Objetivo**: Reducir trabajo manual.

1. **Día 1-2: Alertas**
   - [ ] Implementar sistema de alertas
   - [ ] Configurar cron jobs
   - [ ] Testear notificaciones

2. **Día 3-4: Scripts**
   - [ ] Crear scripts de seed data
   - [ ] Automatizar cálculo de cohorts
   - [ ] Crear backups automáticos

3. **Día 5: Documentación Final**
   - [ ] Actualizar guías
   - [ ] Crear videos
   - [ ] Preparar para lanzamiento

---

## 🚀 Comandos Rápidos

```bash
# Setup inicial
npx tsx scripts/make_admin.ts tu@email.com
npx tsx scripts/seed_test_users.ts

# Desarrollo
npm run dev

# Accesos directos
# Dashboard EBM:
open http://localhost:3000/es/dashboard/management

# Role Switching:
open http://localhost:3000/es/admin/testing

# Build y deploy
npm run build
vercel --prod
```

---

## 📚 Recursos

- **Dashboard EBM**: `docs/DASHBOARD_GUIDE.md`
- **Role Switching**: `docs/TESTING_GUIDE.md`
- **Quick Starts**: `DASHBOARD_README.md`, `TESTING_README.md`

---

¡Éxito con el refinamiento! 🎉
