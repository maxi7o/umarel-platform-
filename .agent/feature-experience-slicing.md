# 🎭 Feature: Dynamic Experience Slicing

**Fecha:** 2026-02-07  
**Objetivo:** Permitir que las experiencias tengan "slices" opcionales que se activan durante el evento, con decisiones en tiempo real por parte de los participantes.

---

## 📋 **Casos de Uso**

### **Caso 1: Teatro + Meet & Greet**
- **Slice Base:** Entrada al teatro + ver la obra (100 personas)
- **Slice Premium:** Meet & greet backstage (13 personas)
- **Trigger:** Se abre automáticamente al finalizar la obra
- **Selección:** First-come-first-served (los primeros 13 que se inscriban)

### **Caso 2: Viñedo con Opciones en Vivo** ⭐ (Caso más complejo)
- **Slice Base:** Tour por el viñedo (30 personas)
- **Slice A:** Música en vivo en bodega subterránea (15 min, 20 cupos)
- **Slice B:** Cata en el patio (15 min, 20 cupos)
- **Decisión:** El usuario decide **en el momento** desde la app, "feeling the vibe"
- **Timing:** Ventana de decisión de 15 minutos antes de que empiece cada actividad

---

## 🎯 **Características Clave Identificadas**

### 1. **Timing Dinámico**
- ✅ Slices que se **activan automáticamente** en horarios específicos
- ✅ **Ventanas de decisión** (ej: "Decidí en los próximos 15 min")
- ✅ **Countdown timers** visibles en la app
- ✅ **Notificaciones push** cuando un slice está por abrirse

### 2. **Cupos & Capacidad**
- ✅ Límite de participantes por slice
- ✅ Indicador en tiempo real de cupos disponibles
- ✅ Reserva temporal (ej: "Tenés 2 min para confirmar tu lugar")
- ✅ Lista de espera automática si se llena

### 3. **Decisiones en Tiempo Real**
- ✅ El usuario puede **cambiar de opinión** hasta cierto punto
- ✅ Vista de "slices disponibles ahora" en la app
- ✅ Comparación rápida de opciones (ej: "Bodega vs Patio")
- ✅ Geolocalización para mostrar slices cercanos

### 4. **Tipos de Activación**
- **Automática por tiempo:** "A las 20:00 se abre el meet & greet"
- **Manual por proveedor:** El host activa el slice cuando está listo
- **Condicional:** "Si hay más de 10 personas, se abre el slice premium"
- **Secuencial:** "Después de completar Slice 1, se abre Slice 2"

### 5. **Pricing Models**
- **Incluido:** Ya pagaste todo, solo elegís qué hacer
- **Upgrade:** Pagás extra por el slice premium
- **Dinámico:** Precio varía según demanda (ej: primeros 5 más barato)
- **Subasta:** Los que más pagan acceden

### 6. **Dependencias**
- **Obligatorio:** Debés haber comprado el slice base
- **Excluyente:** Si elegís Slice A, no podés elegir Slice B
- **Complementario:** Podés elegir múltiples slices

---

## 🗄️ **Modelo de Datos Propuesto**

### **Tabla: `experience_slices`**
```sql
CREATE TABLE experience_slices (
  id UUID PRIMARY KEY,
  experience_id UUID REFERENCES experiences(id),
  
  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  slice_type TEXT NOT NULL, -- 'base' | 'optional' | 'premium' | 'exclusive'
  
  -- Capacity
  max_capacity INTEGER,
  current_bookings INTEGER DEFAULT 0,
  waitlist_enabled BOOLEAN DEFAULT false,
  
  -- Timing
  activation_type TEXT NOT NULL, -- 'auto' | 'manual' | 'conditional' | 'sequential'
  activation_time TIMESTAMP, -- Para tipo 'auto'
  activation_condition JSONB, -- Para tipo 'conditional'
  decision_window_minutes INTEGER, -- Cuánto tiempo tienen para decidir
  
  -- Pricing
  pricing_type TEXT NOT NULL, -- 'included' | 'upgrade' | 'dynamic' | 'auction'
  base_price_cents INTEGER,
  dynamic_pricing_rules JSONB,
  
  -- Dependencies
  requires_slice_ids UUID[], -- Slices que debés haber comprado antes
  excludes_slice_ids UUID[], -- Slices incompatibles
  
  -- Geolocation (opcional)
  location_lat DECIMAL,
  location_lng DECIMAL,
  location_radius_meters INTEGER,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending' | 'active' | 'full' | 'closed'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabla: `slice_bookings`**
```sql
CREATE TABLE slice_bookings (
  id UUID PRIMARY KEY,
  slice_id UUID REFERENCES experience_slices(id),
  user_id UUID REFERENCES users(id),
  experience_booking_id UUID REFERENCES experience_bookings(id),
  
  -- Booking details
  booking_status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed' | 'waitlist' | 'cancelled'
  price_paid_cents INTEGER,
  
  -- Timing
  booked_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  expires_at TIMESTAMP, -- Para reservas temporales
  
  -- Payment
  payment_id UUID REFERENCES payments(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabla: `slice_activations` (Log de activaciones)**
```sql
CREATE TABLE slice_activations (
  id UUID PRIMARY KEY,
  slice_id UUID REFERENCES experience_slices(id),
  
  activated_by UUID REFERENCES users(id), -- Si fue manual
  activation_trigger TEXT, -- 'auto_time' | 'manual' | 'condition_met' | 'sequential'
  
  activated_at TIMESTAMP DEFAULT NOW(),
  notification_sent BOOLEAN DEFAULT false,
  users_notified INTEGER DEFAULT 0
);
```

---

## 🎨 **UX Flow - Caso Viñedo**

### **Pre-Experiencia (Compra)**
1. Usuario ve: "Tour Viñedo Premium - $8000 ARS"
2. Descripción incluye: "Durante el tour, podrás elegir entre música en vivo o cata en el patio"
3. Usuario compra el ticket base

### **Durante la Experiencia**
1. **T-15 min:** Push notification: "🎵 En 15 min: Música en Bodega o Cata en Patio. Decidí ahora!"
2. Usuario abre la app → Ve pantalla de "Slices Disponibles"
3. **Vista de comparación:**
   ```
   🎵 Música en Bodega Subterránea
   📍 150m de tu ubicación
   ⏱️ Empieza en 12 min
   👥 8/20 lugares ocupados
   [Reservar mi lugar]
   
   🍷 Cata en el Patio
   📍 50m de tu ubicación
   ⏱️ Empieza en 12 min
   👥 15/20 lugares ocupados
   [Reservar mi lugar]
   ```
4. Usuario elige "Música en Bodega"
5. **Confirmación:** "Lugar reservado por 2 min. Confirmá tu asistencia."
6. Usuario confirma → Recibe QR code para acceder a la bodega

### **Post-Slice**
1. Slice finaliza
2. Usuario vuelve al tour principal
3. Puede haber más slices opcionales más tarde

---

## 🔧 **Configuración del Proveedor**

### **Al crear la experiencia:**
```
Experiencia: "Tour Viñedo Premium"
Precio base: $8000 ARS
Duración: 3 horas

┌─ Slice 1: Tour Principal (Base)
│  ├─ Incluido en precio base
│  ├─ Duración: 3 horas
│  └─ Capacidad: 30 personas
│
├─ Slice 2: Música en Bodega (Opcional)
│  ├─ Tipo: Opcional (incluido en precio)
│  ├─ Activación: Automática a las 18:45
│  ├─ Ventana de decisión: 15 minutos antes
│  ├─ Capacidad: 20 personas
│  ├─ Duración: 45 min
│  ├─ Ubicación: Bodega Subterránea (GPS)
│  └─ Excluye: Slice 3 (no podés estar en ambos)
│
└─ Slice 3: Cata en Patio (Opcional)
   ├─ Tipo: Opcional (incluido en precio)
   ├─ Activación: Automática a las 18:45
   ├─ Ventana de decisión: 15 minutos antes
   ├─ Capacidad: 20 personas
   ├─ Duración: 45 min
   ├─ Ubicación: Patio Principal (GPS)
   └─ Excluye: Slice 2
```

---

## 🚀 **Implementación - Fases**

### **Fase 1: MVP (2-3 días)**
- [ ] Schema de base de datos (`experience_slices`, `slice_bookings`)
- [ ] CRUD básico para slices (admin)
- [ ] Vista de slices disponibles en la app (usuario)
- [ ] Booking simple (first-come-first-served)
- [ ] Activación manual por proveedor

### **Fase 2: Timing Automático (1-2 días)**
- [ ] Activación automática por tiempo
- [ ] Countdown timers en la UI
- [ ] Notificaciones push cuando se abre un slice
- [ ] Ventanas de decisión con expiración

### **Fase 3: Capacidad & Cupos (1 día)**
- [ ] Control de capacidad en tiempo real
- [ ] Reservas temporales (2 min para confirmar)
- [ ] Lista de espera
- [ ] Indicadores visuales de disponibilidad

### **Fase 4: Geolocalización (1 día)**
- [ ] Mostrar distancia a cada slice
- [ ] Filtrar slices por proximidad
- [ ] Mapa de slices disponibles

### **Fase 5: Pricing Dinámico (2 días)**
- [ ] Slices con precio adicional
- [ ] Pricing dinámico basado en demanda
- [ ] Integración con MercadoPago para upgrades

### **Fase 6: Analytics & Optimización (1 día)**
- [ ] Dashboard para proveedores (qué slices son más populares)
- [ ] Métricas de conversión
- [ ] A/B testing de precios

---

## ❓ **Preguntas Pendientes para Maxi**

1. **Notificaciones:** ✅ Email (con link a la web)
2. **Cancelaciones:** ✅ Para reservar hay que haber pagado ALGO (según config del evento) → No harm done
3. **Proveedor Control:** ✅ El proveedor debe evidenciar cada slice (como los prestadores de servicio)
4. **Overbooking:** ✅ Hard limit (first-come-first-served)
5. **Pricing:** ✅ A discreción del owner (necesita tutorial + AI assistant)
6. **Geolocalización:** ✅ Sí, pero SIN Google Maps API (usar alternativa gratuita)
7. **Multi-idioma:** ✅ Español por ahora

---

## ✅ **Decisiones Confirmadas**

### **1. Pricing & Configuration**
- **Owner tiene control total** sobre pricing de cada slice
- **AI Assistant** ayuda a configurar slices ideales (hace preguntas inteligentes)
- **Tutorial interactivo** para abrir la mente a las posibilidades
- Ejemplos: "Todo incluido", "Upgrade pago", "Dinámico", "Subasta"

### **2. Geolocalización (Sin Google Maps)**
- **Alternativa:** OpenStreetMap + Leaflet.js (100% gratis)
- **Funcionalidad:** Mostrar distancia entre usuario y slice
- **Fallback:** Si no hay permisos de ubicación, mostrar descripción de lugar

### **3. Payment-Gated Reservations**
- **Regla:** Para reservar un slice, el usuario debe haber pagado algo
- **Configuración del owner:** Define cuánto (puede ser $1 o el precio completo)
- **Beneficio:** Elimina reservas fantasma

### **4. Evidence-Based Slice Completion**
- **Igual que servicios:** El proveedor debe subir evidencia de cada slice
- **Ejemplos de evidencia:**
  - Foto del meet & greet con los actores
  - Video de la música en vivo en la bodega
  - Selfie grupal en el patio
- **Pago:** Solo se libera el pago del slice cuando hay evidencia aprobada
- **Disputas:** Mismo sistema que servicios (AI Judge + evidencia)

### **5. Email Notifications**
- **Trigger:** Cuando un slice se abre
- **Contenido:** "🎵 Música en Bodega disponible! Decidí en 15 min"
- **CTA:** Link directo a la web para reservar
- **Integración:** Resend (ya configurado ✅)

---

## 🚀 **Plan de Implementación Actualizado**

### **Fase 1: Core Slicing (3-4 días)** 🔴 PRIORITARIO

#### **Backend:**
- [ ] Schema: `experience_slices`, `slice_bookings`, `slice_evidence`
- [ ] API: CRUD slices (crear, editar, eliminar)
- [ ] API: Booking de slices (con validación de pago previo)
- [ ] API: Activación automática por tiempo (cron job)
- [ ] API: Upload de evidencia por slice

#### **Frontend - Owner:**
- [ ] Wizard de creación de experiencia con slices
- [ ] **AI Assistant** para configurar slices (integrado en wizard)
- [ ] **Tutorial interactivo** (onboarding de slices)
- [ ] Vista de gestión de slices activos
- [ ] Upload de evidencia por slice

#### **Frontend - Usuario:**
- [ ] Vista de "Slices Disponibles Ahora"
- [ ] Countdown timer para ventana de decisión
- [ ] Indicador de cupos disponibles en tiempo real
- [ ] Botón de reserva (con validación de pago)
- [ ] Confirmación de reserva

#### **Notificaciones:**
- [ ] Email cuando se abre un slice (Resend)
- [ ] Email de confirmación de reserva
- [ ] Email de recordatorio (10 min antes)

---

### **Fase 2: Geolocalización (1-2 días)** 🟡 IMPORTANTE

#### **Sin Google Maps:**
- [ ] Integrar Leaflet.js + OpenStreetMap
- [ ] Calcular distancia entre usuario y slice (Haversine formula)
- [ ] Mostrar mapa de slices disponibles
- [ ] Ordenar slices por proximidad
- [ ] Fallback si no hay permisos de ubicación

---

### **Fase 3: AI Assistant & Tutorial (2 días)** 🟡 IMPORTANTE

#### **AI Assistant para Configuración:**
```
AI: "¡Hola! Veo que estás creando 'Tour Viñedo Premium'. 
     ¿Querés agregar actividades opcionales durante el tour?"

Owner: "Sí, música en vivo y cata"

AI: "Perfecto! ¿Estas actividades son:
     A) Incluidas en el precio (los usuarios eligen gratis)
     B) Upgrades pagos (cobran extra)
     C) Dinámico (precio varía según demanda)"

Owner: "A"

AI: "¿Cuántas personas pueden ir a cada una?"

Owner: "20 a cada una"

AI: "¿Pueden ir a ambas o deben elegir una?"

Owner: "Deben elegir una"

AI: "¿A qué hora se abre la decisión?"

Owner: "18:30"

AI: "¿Cuánto tiempo tienen para decidir?"

Owner: "15 minutos"

AI: "Perfecto! Creé 2 slices:
     🎵 Música en Bodega (20 cupos, 18:30-18:45)
     🍷 Cata en Patio (20 cupos, 18:30-18:45)
     Excluyentes entre sí. ¿Confirmás?"
```

#### **Tutorial Interactivo:**
- [ ] Onboarding de 5 pasos con ejemplos reales
- [ ] Casos de uso: Teatro, Viñedo, Tour gastronómico, etc.
- [ ] Video explicativo (2 min)
- [ ] Tooltips contextuales

---

### **Fase 4: Evidence & Disputes (1-2 días)** 🟢 MEDIO

#### **Sistema de Evidencia:**
- [ ] Upload de fotos/videos por slice
- [ ] Aprobación automática si no hay disputa en 24hs
- [ ] Integración con sistema de disputas existente
- [ ] AI Judge evalúa evidencia de slices

#### **Pago Escalonado:**
- [ ] Liberar pago por slice (no todo junto)
- [ ] Retención hasta evidencia aprobada
- [ ] Reembolso automático si slice no se cumple

---

## 🗺️ **Alternativa a Google Maps: OpenStreetMap**

### **Stack Propuesto:**
```typescript
// Leaflet.js (gratis, open source)
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Calcular distancia sin API
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distancia en km
}

// Componente de mapa
<MapContainer center={[userLat, userLng]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {slices.map(slice => (
    <Marker position={[slice.location_lat, slice.location_lng]}>
      <Popup>{slice.title}</Popup>
    </Marker>
  ))}
</MapContainer>
```

**Ventajas:**
- ✅ 100% gratis
- ✅ Sin límites de requests
- ✅ Open source
- ✅ Funciona offline con cache

---

## 📊 **Schema Actualizado con Evidencia**

```sql
-- Nueva tabla para evidencia de slices
CREATE TABLE slice_evidence (
  id UUID PRIMARY KEY,
  slice_booking_id UUID REFERENCES slice_bookings(id),
  slice_id UUID REFERENCES experience_slices(id),
  provider_id UUID REFERENCES users(id),
  
  -- Evidence
  evidence_type TEXT NOT NULL, -- 'photo' | 'video' | 'document'
  evidence_url TEXT NOT NULL,
  description TEXT,
  
  -- Approval
  status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'disputed' | 'rejected'
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  
  -- AI Analysis
  ai_quality_score INTEGER, -- 1-10
  ai_analysis JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger para liberar pago cuando se aprueba evidencia
CREATE OR REPLACE FUNCTION release_slice_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Liberar pago del slice
    UPDATE slice_bookings 
    SET payment_released = true,
        payment_released_at = NOW()
    WHERE id = NEW.slice_booking_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER slice_evidence_approved
AFTER UPDATE ON slice_evidence
FOR EACH ROW
EXECUTE FUNCTION release_slice_payment();
```

---

## 🎯 **Siguiente Paso: ¿Qué Hacemos Ahora?**

Tengo 3 opciones:

### **Opción A: Empezar con Fase 1 (Core Slicing)** ⭐ RECOMENDADO
- Crear el schema de base de datos
- Implementar CRUD de slices
- Crear wizard básico para owners
- Vista de slices para usuarios
- **Tiempo:** 3-4 días
- **Resultado:** MVP funcional para testear

### **Opción B: Empezar con AI Assistant + Tutorial**
- Diseñar conversación del AI
- Crear tutorial interactivo
- Implementar wizard guiado
- **Tiempo:** 2 días
- **Resultado:** Mejor UX para owners, pero sin funcionalidad backend

### **Opción C: Hacer ambas en paralelo**
- Yo hago el backend (schema + APIs)
- Vos revisás el diseño del AI Assistant
- **Tiempo:** 3-4 días
- **Resultado:** Más rápido pero requiere coordinación

---

## 💡 **Mi Recomendación**

**Opción A:** Arrancar con Fase 1 (Core Slicing)

**Razón:** Necesitamos validar el concepto con usuarios reales antes de invertir en AI Assistant. Una vez que tengamos el MVP funcionando, podemos iterar el wizard basándonos en feedback.

**Plan de 4 días:**
- **Día 1:** Schema + APIs básicas
- **Día 2:** Wizard simple para owners + activación automática
- **Día 3:** Vista de usuario + reservas + emails
- **Día 4:** Testing + ajustes + deploy

**¿Arrancamos con Opción A?** 🚀

Si estás de acuerdo, empiezo ahora mismo con el schema y las migraciones.
