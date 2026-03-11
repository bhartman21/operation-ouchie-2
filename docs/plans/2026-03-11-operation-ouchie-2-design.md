# Operation: Ouchie! 2.0 — Design Document

**Date:** 2026-03-11
**Based on:** operation-ouchie (Angular 21, Bootstrap 5)
**Purpose:** VA disability rating lookup tool for veterans — adds a clickable body map, condensed results table, and criteria modal.

---

## Overview

Operation Ouchie 2.0 is a new project (`operation-ouchie-2/`) scaffolded from v1. It adds three major features:

1. **Clickable SVG body map** — two views (Exterior, Interior) that filter results to subsystem level
2. **Condensed results table** — 3-column table (Code | Title | 38CFR Link) replacing the card grid
3. **Criteria modal** — clicking any row opens a Bootstrap modal with full rating criteria and notes

All existing text filters (code search, condition search, system/subsystem dropdowns) are preserved and work alongside the body map filter.

---

## Section 1: Overall Layout

Three vertical zones:

```
┌─────────────────────────────────────────────────┐
│  HEADER (Operation: Ouchie! 2.0 + theme picker) │
├──────────────────┬──────────────────────────────┤
│   BODY MAP       │   FILTER BAR                 │
│   (~30% width)   │   (~70% width)               │
│                  │                               │
│  [Exterior]      │   Code search                │
│  [Interior]      │   Condition search            │
│                  │   System dropdown             │
│  SVG figure      │   Subsystem dropdown          │
│  hover + click   │   Clear All                  │
│                  │                               │
│                  │   Active region badge         │
│                  │   (clearable)                 │
├──────────────────┴──────────────────────────────┤
│  RESULTS TABLE                                   │
│  Code │ Title/Condition │ 38CFR Link             │
│  (click any row → opens criteria modal)          │
└─────────────────────────────────────────────────┘
```

- Body map and text filters share the same `filteredRatings` array
- Body region selection is an independent, clearable filter layer
- Results count shown above the table

---

## Section 2: Body Map Component

### Views

Two toggle buttons switch between **Exterior** and **Interior** SVG views. The SVG is a simple, generic, gender-neutral human silhouette — not anatomically specific.

### Exterior View Regions → Subsystem Mappings

| SVG Region ID | Label | Subsystems Mapped |
|---|---|---|
| `head-face` | Head / Face | Eye (all), Ear, Dental & Oral, Smell & Taste, Cranial Nerves |
| `neck` | Neck | Nose & Throat, Torso & Neck (muscle) |
| `shoulder-arm` | Shoulder / Arm | Shoulder & Arm (musculo), Shoulder Girdle & Arm (muscle), Elbow & Forearm |
| `wrist-hand` | Wrist / Hand | Wrist, Limitation of Motion (Hand), Forearm & Hand (muscle) |
| `chest-torso` | Chest / Torso | The Ribs, Torso & Neck (muscle) |
| `spine-back` | Spine / Back | Spine, The Coccyx |
| `skull` | Skull | The Skull |
| `hip-pelvis` | Hip / Pelvis | Hip & Thigh, Pelvic Girdle & Thigh (muscle) |
| `knee-leg` | Knee / Leg | Knee & Leg, Foot & Leg (muscle) |
| `foot-ankle` | Foot / Ankle | The Foot, Ankle |
| `skin` | Skin (whole body) | The Skin |
| `abdomen` | Abdomen | (nudges user to switch to Interior view) |

### Interior View Regions → Subsystem Mappings

| SVG Region ID | Label | Subsystems Mapped |
|---|---|---|
| `brain` | Brain | Mental Disorders, Organic Diseases of CNS, The Epilepsies, Brain New Growth |
| `spinal-cord` | Spinal Cord | Spinal Cord New Growths, Peripheral Nerves, Misc Neurological Diseases |
| `heart` | Heart | Diseases of the Heart |
| `arteries-veins` | Arteries / Veins | Diseases of the Arteries & Veins |
| `lungs` | Lungs | All Respiratory subsystems (8 total) |
| `liver` | Liver | Liver & Biliary |
| `digestive` | Digestive | Stomach & Duodenum, Intestine, Esophagus, Rectum & Anus, Pancreas, Peritoneum, Visceroptosis, Mouth/Lips/Tongue |
| `kidneys-bladder` | Kidneys / Bladder | Kidney, Ureter, Urethra, Bladder |
| `reproductive` | Reproductive | Male Reproductive Organ, Female Reproductive Organ, Breast |
| `endocrine` | Endocrine | Endocrine System |
| `lymphatic-immune` | Lymphatic / Immune | Hemic & Lymphatic, Infectious Diseases |

### Interaction Behavior

- **Hover** → region fills with a highlight color
- **Click** → region locks as selected (distinct active color); sets subsystem filter; shows active region name as clearable badge above results
- **Click same region again** → deselects, clears body-map filter
- **Clear Body Filter button** → appears when a region is active; resets body-map filter only
- A single body region may map to multiple subsystems — all are included in the filter result

---

## Section 3: Results Table + Modal

### Results Table

Replaces the card grid. A simple Bootstrap table with three columns:

| Diagnostic Code | Condition / Title | 38CFR |
|---|---|---|
| 5260 | Leg, limitation of flexion of | View 38CFR ↗ |
| 5261 | Leg, limitation of extension of | View 38CFR ↗ |

- Every row is clickable — clicking anywhere on the row opens the criteria modal
- The 38CFR link opens in a new tab with text fragment anchor (existing behavior)
- Result count displayed above the table: "Showing X of 741 conditions"
- Empty state: "No results found — try adjusting your search."

### Criteria Modal

Triggered by clicking any table row. Uses Bootstrap modal (no extra libraries).

```
┌─────────────────────────────────────────────────┐
│ [5260] Leg, limitation of flexion of        [X] │
│ Musculoskeletal System > Knee and Leg            │
├──────────┬──────────────────────────────────────┤
│ Rating   │ Criteria                             │
│ 60%      │ Flexion limited to 15°               │
│ 40%      │ Flexion limited to 30°               │
│ 20%      │ Flexion limited to 45°               │
│ 10%      │ Flexion limited to 60°               │
├──────────┴──────────────────────────────────────┤
│ Notes: (if present)                              │
│                      [View 38CFR ↗]   [Close]   │
└─────────────────────────────────────────────────┘
```

---

## Section 4: Technical & Data

### Project Setup

- New folder: `operation-ouchie-2/` (sibling to `operation-ouchie/`)
- Scaffolded from v1 source (excluding `node_modules/`, `dist/`)
- `package.json` name updated to `operation-ouchie-2`
- Same Angular 21 + Bootstrap 5 stack; no new dependencies

### New Component Structure

```
src/app/
  components/
    body-map/
      body-map.component.ts       ← view toggle, region click/hover logic
      body-map.component.html     ← two inline SVGs (exterior, interior)
      body-map.component.scss     ← hover, active, disabled region styles
    results-table/
      results-table.component.ts  ← table rendering, row click → modal trigger
      results-table.component.html
      results-table.component.scss
    criteria-modal/
      criteria-modal.component.ts ← receives DiagnosticCode, renders modal
      criteria-modal.component.html
      criteria-modal.component.scss
    dashboard/                    ← extended from v1
      dashboard.component.ts      ← adds selectedRegions filter logic
      dashboard.component.html    ← new layout with body-map + results-table
      dashboard.component.scss
  models/
    rating.model.ts               ← unchanged from v1
    body-region.model.ts          ← new: BodyRegion interface + region map config
  services/
    rating-data.service.ts        ← unchanged from v1
```

### Body Region Model

```typescript
export interface BodyRegion {
  id: string;
  label: string;
  view: 'exterior' | 'interior';
  subsystems: Array<{ system: string; subSystem?: string }>;
}

export const BODY_REGIONS: BodyRegion[] = [ /* static config */ ];
```

### Filter Logic Extension

`dashboard.component.ts` gains a `selectedBodyRegion: BodyRegion | null` property. `applyFilter()` is extended with a body region pass:

```typescript
if (this.selectedBodyRegion) {
  temp = temp.filter(r =>
    this.selectedBodyRegion!.subsystems.some(s =>
      s.system === r.system &&
      (s.subSystem == null || s.subSystem === r.subSystem)
    )
  );
}
```

### Data

`ratings.json` copied from v1 unchanged. No new fields required.

---

## Out of Scope (v2.0)

- Posterior (back-facing) body view — can be added in v2.1
- Amputations / Prosthetics subsystems (not cleanly body-region-mappable) — accessible via text filters only in v2.0
- "Acute, Subacute, or Chronic Diseases" and "Combinations of Disabilities" Musculoskeletal subsystems — accessible via text filters only
- Neoplasm subsystems (appear across multiple systems) — accessible via text filters only
