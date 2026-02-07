# 🎯 Implementation Plan: Experience Slicing IDE

**Fecha:** 2026-02-07  
**Visión:** "La IDE de los servicios" - Split screen con configuración manual + AI Assistant 3D  
**Estrategia:** Opción C en cascada (Backend → Frontend Manual → AI Chat)

---

## 🏗️ **Arquitectura: Split Screen IDE**

```
┌─────────────────────────────────────────────────────────────┐
│  Experience Slicing IDE                            [Save]   │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│  📝 Manual Config        │  🤖 AI Assistant (3D)           │
│  (Left Panel)            │  (Right Panel)                   │
│                          │                                  │
│  ┌────────────────────┐  │  ┌────────────────────────────┐ │
│  │ Experience Details │  │  │  [3D Avatar Animation]     │ │
│  │ • Title            │  │  │                            │ │
│  │ • Description      │  │  │  "¡Hola! Veo que estás    │ │
│  │ • Base Price       │  │  │   creando un tour...       │ │
│  └────────────────────┘  │  │   ¿Querés agregar slices?" │ │
│                          │  └────────────────────────────┘ │
│  ┌────────────────────┐  │                                  │
│  │ Slices             │  │  ┌────────────────────────────┐ │
│  │ [+ Add Slice]      │  │  │ > Sí, música y cata       │ │
│  │                    │  │  └────────────────────────────┘ │
│  │ 🎵 Música Bodega   │  │                                  │
│  │   • 20 cupos       │  │  ┌────────────────────────────┐ │
│  │   • 18:30-18:45    │  │  │  "Perfecto! ¿Son incluidas│ │
│  │   • Incluido       │  │  │   o upgrades pagos?"      │ │
│  │   [Edit] [Delete]  │  │  └────────────────────────────┘ │
│  │                    │  │                                  │
│  │ 🍷 Cata Patio      │  │  [Voice Input] [Text Input]    │
│  │   • 20 cupos       │  │                                  │
│  │   • 18:30-18:45    │  │  [Sugerencias del AI:]         │
│  │   • Incluido       │  │  • Agregar slice premium       │
│  │   [Edit] [Delete]  │  │  • Ajustar timing              │
│  └────────────────────┘  │  • Ver ejemplos similares      │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

---

## 📅 **Plan en Cascada (7 días)**

### **Día 1-2: Backend Foundation** 🔴 (YO)
**Objetivo:** Schema + APIs funcionando

#### **Tasks:**
- [x] Crear migraciones de base de datos
  - `experience_slices`
  - `slice_bookings`
  - `slice_evidence`
  - `slice_activations`
- [x] Implementar APIs REST
  - `POST /api/experiences/:id/slices` - Crear slice
  - `GET /api/experiences/:id/slices` - Listar slices
  - `PUT /api/slices/:id` - Editar slice
  - `DELETE /api/slices/:id` - Eliminar slice
  - `POST /api/slices/:id/book` - Reservar slice
  - `POST /api/slices/:id/evidence` - Subir evidencia
- [x] Cron job para activación automática
- [x] Validaciones de negocio
  - Payment-gated reservations
  - Capacity limits
  - Exclusivity rules

**Entregable:** APIs documentadas + tests pasando

---

### **Día 3-4: Frontend Manual Config** 🟡 (YO)
**Objetivo:** Panel izquierdo funcional (sin AI)

#### **Tasks:**
- [ ] Componente `ExperienceSlicingIDE`
  - Split screen layout (60% config / 40% AI)
  - Responsive (mobile: tabs)
- [ ] Panel izquierdo: Manual Config
  - [ ] Form de experiencia base
  - [ ] Lista de slices con drag & drop para reordenar
  - [ ] Modal "Add Slice" con todos los campos:
    - Title, description
    - Capacity
    - Timing (activation type, time, window)
    - Pricing (type, amount)
    - Dependencies (requires, excludes)
    - Location (lat/lng picker con OpenStreetMap)
  - [ ] Inline editing de slices
  - [ ] Preview en tiempo real
- [ ] Validaciones frontend
- [ ] Auto-save (debounced)

**Entregable:** Wizard funcional sin AI

---

### **Día 5-6: AI Assistant 3D** 🟢 (YO + VOS)
**Objetivo:** Chat inteligente que ayuda a configurar

#### **Tasks - Backend AI:**
- [ ] Endpoint `/api/ai/slice-assistant`
  - Input: Conversación + estado actual de slices
  - Output: Respuesta + acciones sugeridas
- [ ] Prompts optimizados para OpenAI
  - System prompt con contexto de slicing
  - Few-shot examples
  - Structured output (JSON)
- [ ] Acciones del AI:
  - `CREATE_SLICE` - Sugerir crear slice
  - `UPDATE_SLICE` - Sugerir modificar slice
  - `ASK_QUESTION` - Pedir clarificación
  - `SHOW_EXAMPLE` - Mostrar caso de uso similar

#### **Tasks - Frontend AI:**
- [ ] Componente `AIAssistant3D`
  - Avatar 3D animado (Ready Player Me o similar)
  - Chat interface
  - Voice input (Web Speech API)
  - Text input con autocomplete
- [ ] Integración bidireccional:
  - AI sugiere → se refleja en panel izquierdo
  - Usuario edita manual → AI lo detecta y comenta
- [ ] Sugerencias contextuales
  - "Basado en tours similares, podrías agregar..."
  - "Este timing podría solaparse con..."
  - "Precio sugerido: $X basado en demanda"

**Entregable:** AI funcional que ayuda a configurar

---

### **Día 7: Polish + Testing** ✨
**Objetivo:** Experiencia premium

#### **Tasks:**
- [ ] Animaciones y transiciones
- [ ] Tutorial interactivo (onboarding)
- [ ] Testing E2E
- [ ] Deploy a staging
- [ ] Video demo para marketing

**Entregable:** Feature lista para beta testers

---

## 🎨 **UI/UX Specs**

### **Colores & Tema:**
```css
/* IDE Theme - Dark Mode */
--ide-bg: #1e1e1e;
--ide-panel-bg: #252526;
--ide-border: #3e3e42;
--ide-text: #cccccc;
--ide-accent: #007acc;

/* AI Assistant */
--ai-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--ai-text: #ffffff;
--ai-bubble: rgba(255, 255, 255, 0.1);
```

### **Componentes Clave:**

#### **1. Split Screen Layout**
```tsx
<div className="flex h-screen">
  {/* Left: Manual Config (60%) */}
  <div className="w-3/5 border-r border-ide-border">
    <ManualConfigPanel />
  </div>
  
  {/* Right: AI Assistant (40%) */}
  <div className="w-2/5 bg-gradient-to-br from-purple-600 to-indigo-600">
    <AIAssistant3D />
  </div>
</div>
```

#### **2. Slice Card (Manual Panel)**
```tsx
<div className="slice-card group hover:shadow-lg transition-all">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="text-2xl">🎵</span>
      <div>
        <h3 className="font-semibold">Música en Bodega</h3>
        <p className="text-sm text-gray-500">20 cupos • 18:30-18:45</p>
      </div>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="btn-icon">✏️</button>
      <button className="btn-icon">🗑️</button>
    </div>
  </div>
  
  <div className="mt-3 flex gap-2">
    <span className="badge">Incluido</span>
    <span className="badge">Auto-activación</span>
    <span className="badge">Excluyente</span>
  </div>
</div>
```

#### **3. AI Chat Bubble**
```tsx
<div className="ai-message">
  <div className="avatar-3d">
    {/* 3D Avatar Animation */}
    <Canvas>
      <ReadyPlayerMeAvatar url={avatarUrl} />
    </Canvas>
  </div>
  
  <div className="message-bubble">
    <p>¡Hola! Veo que estás creando un tour al viñedo.</p>
    <p>¿Querés agregar actividades opcionales durante el tour?</p>
    
    <div className="quick-replies">
      <button>Sí, ayudame</button>
      <button>No, lo hago manual</button>
    </div>
  </div>
</div>
```

---

## 🤖 **AI Assistant - Conversational Flow**

### **Prompt System (OpenAI)**
```typescript
const systemPrompt = `Eres un asistente experto en diseño de experiencias turísticas y eventos.

Tu objetivo es ayudar al usuario a configurar "slices" (actividades opcionales) para su experiencia.

CONTEXTO:
- El usuario está creando una experiencia (tour, evento, clase, etc.)
- Los "slices" son actividades opcionales que los participantes pueden elegir durante la experiencia
- Cada slice tiene: título, capacidad, timing, precio, ubicación

TU ROL:
1. Hacer preguntas inteligentes para entender la experiencia
2. Sugerir slices basados en experiencias similares
3. Ayudar a configurar timing, capacidad y pricing
4. Detectar conflictos (ej: slices que se solapan en tiempo)
5. Optimizar para maximizar satisfacción y revenue

REGLAS:
- Haz UNA pregunta a la vez
- Sé conversacional y amigable (tutear)
- Usa emojis relevantes
- Sugiere acciones concretas
- Si el usuario edita manual, comenta sobre los cambios

EJEMPLOS DE EXPERIENCIAS:
- Teatro + Meet & Greet backstage
- Tour viñedo + Música en bodega vs Cata en patio
- Clase de cocina + Degustación premium
- City tour + Museo privado

OUTPUT FORMAT (JSON):
{
  "message": "Tu respuesta conversacional",
  "actions": [
    {
      "type": "CREATE_SLICE",
      "data": { "title": "...", "capacity": 20, ... }
    }
  ],
  "suggestions": ["Tip 1", "Tip 2"],
  "confidence": 0.95
}`;

const userContext = {
  experienceTitle: "Tour Viñedo Premium",
  experiencePrice: 8000,
  existingSlices: [
    { title: "Música en Bodega", capacity: 20, ... }
  ],
  conversationHistory: [...]
};

const response = await openai.chat.completions.create({
  model: "gpt-4-turbo-preview",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(userContext) }
  ],
  response_format: { type: "json_object" }
});
```

---

## 🎭 **3D Avatar Integration**

### **Opción 1: Ready Player Me** ⭐ RECOMENDADO
```bash
npm install @readyplayerme/rpm-react-sdk
```

```tsx
import { Avatar } from '@readyplayerme/rpm-react-sdk';

<Avatar
  modelSrc="https://models.readyplayerme.com/YOUR_AVATAR_ID.glb"
  animationSrc="idle" // idle, talking, thinking
  cameraInitialDistance={2}
/>
```

**Ventajas:**
- ✅ Gratis para uso básico
- ✅ Avatares customizables
- ✅ Animaciones built-in
- ✅ React SDK oficial

### **Opción 2: Spline (Más simple)**
```tsx
import Spline from '@splinetool/react-spline';

<Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
```

**Ventajas:**
- ✅ 100% gratis
- ✅ Editor visual (no-code)
- ✅ Animaciones fáciles
- ✅ Más ligero que Ready Player Me

---

## 📊 **Database Schema (Final)**

```sql
-- Tabla principal de slices
CREATE TABLE experience_slices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  
  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🎯',
  slice_type TEXT NOT NULL DEFAULT 'optional', -- 'base' | 'optional' | 'premium'
  
  -- Capacity
  max_capacity INTEGER NOT NULL,
  current_bookings INTEGER DEFAULT 0,
  waitlist_enabled BOOLEAN DEFAULT false,
  
  -- Timing
  activation_type TEXT NOT NULL DEFAULT 'auto', -- 'auto' | 'manual' | 'conditional'
  activation_time TIMESTAMP,
  decision_window_minutes INTEGER DEFAULT 15,
  duration_minutes INTEGER,
  
  -- Pricing
  pricing_type TEXT NOT NULL DEFAULT 'included', -- 'included' | 'upgrade' | 'dynamic'
  price_cents INTEGER DEFAULT 0,
  min_payment_required_cents INTEGER DEFAULT 0, -- Para payment-gated
  
  -- Dependencies
  requires_slice_ids UUID[] DEFAULT '{}',
  excludes_slice_ids UUID[] DEFAULT '{}',
  
  -- Location (OpenStreetMap)
  location_name TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_description TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- 'draft' | 'active' | 'full' | 'closed' | 'cancelled'
  
  -- AI Metadata
  ai_suggested BOOLEAN DEFAULT false,
  ai_confidence DECIMAL(3, 2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_capacity CHECK (max_capacity > 0),
  CONSTRAINT valid_price CHECK (price_cents >= 0)
);

-- Índices para performance
CREATE INDEX idx_slices_experience ON experience_slices(experience_id);
CREATE INDEX idx_slices_activation ON experience_slices(activation_time) WHERE status = 'active';
CREATE INDEX idx_slices_status ON experience_slices(status);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_slices_timestamp
BEFORE UPDATE ON experience_slices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🚀 **Cómo Arrancamos (Ahora Mismo)**

### **Paso 1: Crear Branch**
```bash
git checkout -b feature/experience-slicing-ide
```

### **Paso 2: Crear Migración**
```bash
# Voy a crear el archivo de migración
```

### **Paso 3: Implementar Schema**
```bash
# Aplicar migración a DB local
npm run db:migrate
```

### **Paso 4: Crear APIs Base**
```bash
# Crear estructura de archivos:
# - app/api/experiences/[id]/slices/route.ts
# - app/api/slices/[id]/route.ts
# - lib/services/slice-service.ts
```

---

## 🎯 **Success Metrics**

### **MVP (Día 7):**
- [ ] Owner puede crear experiencia con 3+ slices en < 5 min
- [ ] AI sugiere al menos 2 slices relevantes
- [ ] Usuario puede reservar slice en < 30 seg
- [ ] Email de notificación llega en < 1 min
- [ ] Evidencia se sube y aprueba correctamente

### **Post-Launch:**
- **Adoption:** 30% de experiencias usan slices
- **Conversion:** 60% de usuarios reservan al menos 1 slice
- **Revenue:** +25% por experiencia con slices vs sin slices
- **NPS:** 8+ de owners que usan slices

---

**¿Arrancamos? Digo "sí" y creo la primera migración ahora mismo.** 🚀
