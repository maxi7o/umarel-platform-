# Umarel Platform: "Signal-Over-Noise" Refactor Manual

## Overview
This document outlines the major architectural and UI changes implemented to streamline the Umarel platform, focusing on the "Signal over Noise" philosophy and the "Entendido" ecosystem integration.

---

## 1. Onboarding & Roles
**Objective:** Eliminate confusion about the 3 roles immediately upon entry.

*   **New Component:** `RoleOnboardingModal` (`components/onboarding/role-onboarding-modal.tsx`)
*   **Behavior:**
    *   Appears automatically for new visitors (controlled by `localStorage`).
    *   Displays 3 clear choices side-by-side:
        1.  **Client (Cliente)**: "Definí" (Vision).
        2.  **Provider (Profesional)**: "Ejecutá" (Execution).
        3.  **Advisor (Entendido)**: "Opiná" (Intelligence).
*   **Narrative:** The `es.json` file has been updated to reflect this ecosystem story ("Un Ecosistema de Valor").

## 2. The "One-Shot" Request Flow
**Objective:** Allow users to post simple tasks without getting stuck in complex "Slicing" logic.

*   **Logic Change:** The "Skip Wizard" button in `WizardInterface` was repurposed to **"Publish Request"**.
*   **Behavior:**
    *   Users can still chat with AI to refine the request.
    *   If satisfied early, they click "Publish Request".
    *   **Redirect:** Sends user directly to the **Request Dashboard** (`/requests/[id]`), bypassing the "Browse" page to keep them focused on their new project.
*   **Action:** No longer warns "Are you sure?", but confirms "Publish Now".

## 3. The Entendido Integration (Community Intelligence)
**Objective:** Enable verified experts (Entendidos) to provide non-binding, valuable feedback on quotes/slices.

### A. The Input ("The Sticky Note")
*   **Component:** `StickyNoteButton` (`components/interaction/sticky-note-button.tsx`)
*   **Usage:** Placed on Quotes or Slices. Allows text/voice input.
*   **Security:** Inputs are **NOT** published immediately. They must pass the AI Firewall.

### B. The Brain ("Consensus Filter")
*   **Service:** `lib/ai/consensus-filter.ts`
*   **Logic:**
    *   Receives content.
    *   Comparing analysis from **Gemini** (Context/Speed) and **OpenAI** (Reasoning/Safety).
    *   **Rule:** Only publishes if **BOTH** models agree it is Safe/Constructive.
    *   **Endpoint:** `POST /api/entendido/feedback`

### C. The Display ("Evaluation View")
*   **Component:** `QuoteEvaluationView` (`components/interaction/quote-evaluation-view.tsx`)
*   **Layout:**
    *   **Left:** The Provider's Quote (The Cost).
    *   **Right:** A "Margin Notes" sidebar showing AI-verified Entendido feedback (The Value).
    *   **Features:** Verified Checkmarks, Sentiment Indicators (Green/Red lines).

---

## 4. UI Simplification
*   **Navbar:** Removed clutter (Roles, About, etc.). Only `Explore` + `User Actions`.
*   **Footer:** Single line. Copyright + Essential Legal Links.
*   **Visuals:** Adopted a "Document" style for evaluations to handle information density cleanly.
