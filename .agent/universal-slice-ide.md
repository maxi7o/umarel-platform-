# 🧠 Universal Slice IDE - Technical Spec

**Concept:** A unified, AI-assisted interface for interacting with "Slices" (the fundamental unit of work/value in Umarel & El Entendido).

**Core Philosophy:** 
Whether you are requesting a bathroom renovation, quoting a plumbing job, creating a theater experience, or critiquing a finished wall... **you are manipulating a Slice.**

---

## 🏗️ 1. Architecture: The Polymorphic Query

The IDE is a single React component `<UniversalSliceIDE />` that changes behavior based on `mode`:

```typescript
type IDEMode = 
  | 'REQUEST_CREATION'   // Client defining needs
  | 'QUOTE_PROPOSAL'     // Provider pricing slices
  | 'EXPERIENCE_DESIGN'  // Creator making an event
  | 'CRITIQUE_REVIEW'    // Entendido evaluating evidence
  | 'EVIDENCE_UPLOAD';   // Provider proving work
```

### **Shared State (The Slice)**
Every mode manipulates the same data structure (from our DB):
- `title` & `description`
- `status`
- `price`
- `evidence`
- `ai_metadata`

---

## 🎨 2. The Split-Screen Layout

### **Left Panel: The Context (AI Assistant)**
*   **3D Avatar / Chat Interface:** Always present.
*   **Role:**
    *   *Request:* "What needs fixing? Show me a photo."
    *   *Quote:* "This price seems high for the market ($X). Want to adjust?"
    *   *Experience:* "You have 15 seats left. Should we enable a waitlist?"
    *   *Critique:* "I detect moisture in this photo. Do you agree?"

### **Right Panel: The Workspace (The Slices)**
*   **Visual Representation:** 
    *   *Services:* Kanban Board or Checklist.
    *   *Experiences:* Timeline / Calendar View.
*   **Interactions:** Drag & drop, Click to edit, "Add Slice" button.

---

## 🚀 3. Mode Implementations

### **A. Client Request Mode**
*   **Goal:** Turn vague problems into concrete Slices.
*   **Flow:**
    1.  User: "My bathroom leaks."
    2.  AI: Creates Draft Slice "Diagnose Leak".
    3.  User: "And I want to paint it."
    4.  AI: Adds Draft Slice "Paint Walls".
*   **DB Action:** `INSERT INTO slices (request_id, status='draft')`

### **B. Provider Quote Mode**
*   **Goal:** Price the drafted slices.
*   **Flow:**
    1.  Provider sees "Diagnose Leak" (No Price).
    2.  Provider enters "$500".
    3.  AI generates a `quote_item` linked to that slice.
*   **DB Action:** `INSERT INTO quote_items (quote_id, slice_id, amount)`

### **C. Experience Design Mode** (What we started today)
*   **Goal:** Create time-based inventory.
*   **Flow:**
    1.  Creator: "Theater play at 8pm."
    2.  IDE shows "Base Slice" (Ticket).
    3.  Creator: "Add VIP backstage."
    4.  IDE adds "Optional Slice" (VIP Upgrade).
*   **DB Action:** `INSERT INTO slices (experience_id, slice_type='optional', max_capacity=10)`

### **D. Critique Mode (Entendidos)**
*   **Goal:** Validate quality.
*   **Flow:**
    1.  Entendido sees "Paint Walls" (Status: Completed).
    2.  Views Evidence (Photos/Videos).
    3.  Votes "Approved" or "Rejected".
*   **DB Action:** `INSERT INTO contribution_evaluations (slice_id, score, reasoning)`

---

## 🛠️ 4. AI Agents Integration (n8n)

The backend logic is powered by n8n workflows that listen to Slice changes:

1.  **`slice.created` (Request):** Auto-categorize & estimate price.
2.  **`slice.evidence_uploaded`:** Vision API analysis (Quality Check).
3.  **`slice.quoted`:** Price anomaly detection.

---

## 📅 5. Implementation Roadmap (Revised)

1.  **Day 1:** Refactor DB to Universal Slices (✅ DONE).
2.  **Day 2:** Build `<UniversalSliceIDE />` Shell (Layout + AI Chat).
3.  **Day 3:** Implement "Request Mode" (Client).
4.  **Day 4:** Implement "Experience Mode" (Creator).
5.  **Day 5:** Implement "Quote & Critique Modes".
