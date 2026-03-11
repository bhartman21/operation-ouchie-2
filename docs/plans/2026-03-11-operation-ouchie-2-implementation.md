# Operation: Ouchie! 2.0 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create `operation-ouchie-2/` — a new Angular 21 + Bootstrap 5 app based on v1 that adds a clickable SVG body map, a condensed results table, and a criteria modal.

**Architecture:** Dashboard layout splits into body-map (left, ~30%) and filter bar (right, ~70%) above a full-width results table. Body map emits a `regionSelected` event that the dashboard uses as an additional filter alongside existing text/dropdown filters. Clicking any result row opens a Bootstrap modal with full criteria.

**Tech Stack:** Angular 21 standalone components, Bootstrap 5, Bootstrap Icons, Vitest, TypeScript 5.9

---

## Context & Conventions

- All components are **standalone** (no NgModules). Use `imports: [CommonModule, FormsModule]` as needed.
- Tests use `TestBed` from `@angular/core/testing` + Vitest. Run with `ng test`.
- SCSS uses CSS custom properties from `styles.scss` (e.g., `var(--card-bg)`, `var(--accent-color)`).
- Bootstrap modal is triggered via `data-bs-target` / `bootstrap.Modal` JS API — **no extra libraries**.
- The `ratings.json` data file is **unchanged** from v1.
- All `ng generate` commands run from inside `operation-ouchie-2/`.

---

## Task 1: Scaffold the Project

**Files:**
- Create: `operation-ouchie-2/` (copy of v1 source)

**Step 1: Copy v1 source into new folder**

Run from `AntiGravity-001/`:
```bash
mkdir operation-ouchie-2
cp -r operation-ouchie/src operation-ouchie-2/src
cp -r operation-ouchie/public operation-ouchie-2/public
cp operation-ouchie/angular.json operation-ouchie-2/angular.json
cp operation-ouchie/package.json operation-ouchie-2/package.json
cp operation-ouchie/package-lock.json operation-ouchie-2/package-lock.json
cp operation-ouchie/tsconfig*.json operation-ouchie-2/
mkdir -p operation-ouchie-2/docs/plans
cp -r operation-ouchie-2/docs/plans/2026-03-11-* operation-ouchie-2/docs/plans/ 2>/dev/null || true
```

**Step 2: Update package.json name**

In `operation-ouchie-2/package.json`, change:
```json
"name": "operation-ouchie",
```
to:
```json
"name": "operation-ouchie-2",
```

**Step 3: Update angular.json project name**

In `operation-ouchie-2/angular.json`, replace all occurrences of `"operation-ouchie"` with `"operation-ouchie-2"`. There will be several (project key, outputPath, etc.).

**Step 4: Update app title signal**

In `operation-ouchie-2/src/app/app.ts`, change:
```typescript
protected readonly title = signal('operation-ouchie');
```
to:
```typescript
protected readonly title = signal('operation-ouchie-2');
```

**Step 5: Install dependencies and verify**

```bash
cd operation-ouchie-2
npm install
npx ng serve --open
```
Expected: App loads at `http://localhost:4200` showing the v1 dashboard.

**Step 6: Run existing tests**

```bash
ng test
```
Expected: All existing tests pass (app creates, renders title).

**Step 7: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold operation-ouchie-2 from v1"
```

---

## Task 2: Create Body Region Model

**Files:**
- Create: `src/app/models/body-region.model.ts`
- Create: `src/app/models/body-region.model.spec.ts`

**Step 1: Write the failing test**

Create `src/app/models/body-region.model.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { BODY_REGIONS, BodyRegion } from './body-region.model';

describe('BODY_REGIONS', () => {
    it('should have regions for both views', () => {
        const exteriorRegions = BODY_REGIONS.filter(r => r.view === 'exterior');
        const interiorRegions = BODY_REGIONS.filter(r => r.view === 'interior');
        expect(exteriorRegions.length).toBeGreaterThan(0);
        expect(interiorRegions.length).toBeGreaterThan(0);
    });

    it('should have unique ids', () => {
        const ids = BODY_REGIONS.map(r => r.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('each region should have at least one subsystem mapping', () => {
        BODY_REGIONS.forEach(region => {
            expect(region.subsystems.length).toBeGreaterThan(0);
        });
    });

    it('each region should have an id, label, view, and subsystems', () => {
        BODY_REGIONS.forEach(region => {
            expect(region.id).toBeTruthy();
            expect(region.label).toBeTruthy();
            expect(['exterior', 'interior']).toContain(region.view);
            expect(Array.isArray(region.subsystems)).toBe(true);
        });
    });
});
```

**Step 2: Run test to verify it fails**

```bash
ng test --reporter=verbose
```
Expected: FAIL — `body-region.model` not found.

**Step 3: Create the model**

Create `src/app/models/body-region.model.ts`:
```typescript
export interface BodyRegionSubsystem {
    system: string;
    subSystem?: string;
}

export interface BodyRegion {
    id: string;
    label: string;
    view: 'exterior' | 'interior';
    subsystems: BodyRegionSubsystem[];
}

export const BODY_REGIONS: BodyRegion[] = [
    // --- EXTERIOR REGIONS ---
    {
        id: 'head-face',
        label: 'Head / Face',
        view: 'exterior',
        subsystems: [
            { system: 'The Eye', subSystem: 'Diseases of the Eye' },
            { system: 'The Eye', subSystem: 'Impairment of Central Visual Acuity' },
            { system: 'The Eye', subSystem: 'Impairment of Field Vision' },
            { system: 'The Eye', subSystem: 'Impairment of Muscle Function' },
            { system: 'The Ear', subSystem: 'Diseases of the Ear' },
            { system: 'Dental and Oral', subSystem: 'Dental and Oral Conditions' },
            { system: 'Other Sense Organs', subSystem: 'Smell and Taste' },
            { system: 'Neurological', subSystem: 'Cranial Nerves' },
        ]
    },
    {
        id: 'neck',
        label: 'Neck',
        view: 'exterior',
        subsystems: [
            { system: 'Respiratory System', subSystem: 'Nose and Throat' },
            { system: 'Muscle Injuries', subSystem: 'Torso and Neck' },
        ]
    },
    {
        id: 'shoulder-arm',
        label: 'Shoulder / Arm',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Shoulder and Arm' },
            { system: 'Musculoskeletal System', subSystem: 'Elbow and Forearm' },
            { system: 'Muscle Injuries', subSystem: 'Shoulder Girdle and Arm' },
        ]
    },
    {
        id: 'wrist-hand',
        label: 'Wrist / Hand',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Wrist' },
            { system: 'Musculoskeletal System', subSystem: 'Limitation of Motion (Hand)' },
            { system: 'Muscle Injuries', subSystem: 'Forearm and Hand' },
        ]
    },
    {
        id: 'chest-torso',
        label: 'Chest / Torso',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'The Ribs' },
            { system: 'Muscle Injuries', subSystem: 'Torso and Neck' },
        ]
    },
    {
        id: 'spine-back',
        label: 'Spine / Back',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Spine' },
            { system: 'Musculoskeletal System', subSystem: 'The Coccyx' },
        ]
    },
    {
        id: 'skull',
        label: 'Skull',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'The Skull' },
        ]
    },
    {
        id: 'hip-pelvis',
        label: 'Hip / Pelvis',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Hip and Thigh' },
            { system: 'Muscle Injuries', subSystem: 'Pelvic Girdle and Thigh' },
        ]
    },
    {
        id: 'knee-leg',
        label: 'Knee / Leg',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'Knee and Leg' },
            { system: 'Muscle Injuries', subSystem: 'Foot and Leg' },
        ]
    },
    {
        id: 'foot-ankle',
        label: 'Foot / Ankle',
        view: 'exterior',
        subsystems: [
            { system: 'Musculoskeletal System', subSystem: 'The Foot' },
            { system: 'Musculoskeletal System', subSystem: 'Ankle' },
        ]
    },
    {
        id: 'skin',
        label: 'Skin',
        view: 'exterior',
        subsystems: [
            { system: 'The Skin', subSystem: 'The Skin' },
        ]
    },

    // --- INTERIOR REGIONS ---
    {
        id: 'brain',
        label: 'Brain',
        view: 'interior',
        subsystems: [
            { system: 'Mental Disorders', subSystem: 'Mental Disorders' },
            { system: 'Neurological', subSystem: 'Organic Diseases of CNS' },
            { system: 'Neurological', subSystem: 'The Epilepsies' },
            { system: 'Neurological', subSystem: 'Brain, New Growth of' },
            { system: 'Neurological', subSystem: 'Miscellaneous Diseases' },
        ]
    },
    {
        id: 'spinal-cord',
        label: 'Spinal Cord',
        view: 'interior',
        subsystems: [
            { system: 'Neurological', subSystem: 'Spinal Cord, New Growths' },
            { system: 'Neurological', subSystem: 'Peripheral Nerves' },
        ]
    },
    {
        id: 'heart',
        label: 'Heart',
        view: 'interior',
        subsystems: [
            { system: 'Cardiovascular System', subSystem: 'Diseases of the Heart' },
        ]
    },
    {
        id: 'arteries-veins',
        label: 'Arteries / Veins',
        view: 'interior',
        subsystems: [
            { system: 'Cardiovascular System', subSystem: 'Diseases of the Arteries and Veins' },
        ]
    },
    {
        id: 'lungs',
        label: 'Lungs',
        view: 'interior',
        subsystems: [
            { system: 'Respiratory System', subSystem: 'Bacterial Infections of the Lung' },
            { system: 'Respiratory System', subSystem: 'Interstitial Lung Disease' },
            { system: 'Respiratory System', subSystem: 'Mycotic Lung Disease' },
            { system: 'Respiratory System', subSystem: 'Nontuberculous Diseases' },
            { system: 'Respiratory System', subSystem: 'Restrictive Lung Disease' },
            { system: 'Respiratory System', subSystem: 'Trachea and Bronchi' },
            { system: 'Respiratory System', subSystem: 'Tuberculosis' },
        ]
    },
    {
        id: 'liver',
        label: 'Liver',
        view: 'interior',
        subsystems: [
            { system: 'Digestive System', subSystem: 'Liver and Biliary' },
        ]
    },
    {
        id: 'digestive',
        label: 'Digestive System',
        view: 'interior',
        subsystems: [
            { system: 'Digestive System', subSystem: 'Stomach and Duodenum' },
            { system: 'Digestive System', subSystem: 'Intestine' },
            { system: 'Digestive System', subSystem: 'Esophagus' },
            { system: 'Digestive System', subSystem: 'Rectum and Anus' },
            { system: 'Digestive System', subSystem: 'Pancreas' },
            { system: 'Digestive System', subSystem: 'Peritoneum' },
            { system: 'Digestive System', subSystem: 'Visceroptosis' },
            { system: 'Digestive System', subSystem: 'Mouth, Lips, Tongue' },
            { system: 'Digestive System', subSystem: 'Hernia' },
        ]
    },
    {
        id: 'kidneys-bladder',
        label: 'Kidneys / Bladder',
        view: 'interior',
        subsystems: [
            { system: 'Genitourinary System', subSystem: 'Kidney' },
            { system: 'Genitourinary System', subSystem: 'Ureter' },
            { system: 'Genitourinary System', subSystem: 'Urethra' },
            { system: 'Genitourinary System', subSystem: 'Bladder' },
        ]
    },
    {
        id: 'reproductive',
        label: 'Reproductive',
        view: 'interior',
        subsystems: [
            { system: 'Genitourinary System', subSystem: 'Male Reproductive Organ' },
            { system: 'Gynecological/Breast', subSystem: 'Female Reproductive Organ' },
            { system: 'Gynecological/Breast', subSystem: 'Breast' },
        ]
    },
    {
        id: 'endocrine',
        label: 'Endocrine',
        view: 'interior',
        subsystems: [
            { system: 'Endocrine System', subSystem: 'Endocrine System' },
        ]
    },
    {
        id: 'lymphatic-immune',
        label: 'Lymphatic / Immune',
        view: 'interior',
        subsystems: [
            { system: 'Hemic and Lymphatic', subSystem: 'Hemic and Lymphatic' },
            { system: 'Infectious Diseases/Immune Disorders', subSystem: 'Infectious Diseases' },
        ]
    },
];
```

**Step 4: Run tests to verify they pass**

```bash
ng test --reporter=verbose
```
Expected: All BODY_REGIONS tests pass.

**Step 5: Commit**

```bash
git add src/app/models/body-region.model.ts src/app/models/body-region.model.spec.ts
git commit -m "feat: add BodyRegion model and BODY_REGIONS config"
```

---

## Task 3: Create Body Map Component Shell

**Files:**
- Create: `src/app/components/body-map/body-map.component.ts`
- Create: `src/app/components/body-map/body-map.component.html`
- Create: `src/app/components/body-map/body-map.component.scss`
- Create: `src/app/components/body-map/body-map.component.spec.ts`

**Step 1: Generate the component**

```bash
npx ng generate component components/body-map --standalone --skip-tests
```

**Step 2: Write the failing test**

Create `src/app/components/body-map/body-map.component.spec.ts`:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BodyMapComponent } from './body-map.component';
import { describe, it, expect, beforeEach } from 'vitest';

describe('BodyMapComponent', () => {
    let component: BodyMapComponent;
    let fixture: ComponentFixture<BodyMapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BodyMapComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(BodyMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should default to exterior view', () => {
        expect(component.activeView).toBe('exterior');
    });

    it('should switch to interior view', () => {
        component.setView('interior');
        expect(component.activeView).toBe('interior');
    });

    it('should emit regionSelected when a region is clicked', () => {
        const emitted: any[] = [];
        component.regionSelected.subscribe((r: any) => emitted.push(r));

        const region = component.exteriorRegions[0];
        component.selectRegion(region);

        expect(emitted.length).toBe(1);
        expect(emitted[0]).toBe(region);
    });

    it('should deselect region when clicked again', () => {
        const emitted: any[] = [];
        component.regionSelected.subscribe((r: any) => emitted.push(r));

        const region = component.exteriorRegions[0];
        component.selectRegion(region);
        component.selectRegion(region); // click same region again

        expect(emitted.length).toBe(2);
        expect(emitted[1]).toBeNull();
    });
});
```

**Step 3: Run test to verify it fails**

```bash
ng test --reporter=verbose
```
Expected: FAIL — component exists but `activeView`, `setView`, `selectRegion`, `exteriorRegions`, `regionSelected` not found.

**Step 4: Implement the component**

Replace `src/app/components/body-map/body-map.component.ts`:
```typescript
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { BODY_REGIONS, BodyRegion } from '../../models/body-region.model';

@Component({
    selector: 'app-body-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './body-map.component.html',
    styleUrls: ['./body-map.component.scss']
})
export class BodyMapComponent {
    @Output() regionSelected = new EventEmitter<BodyRegion | null>();

    activeView: 'exterior' | 'interior' = 'exterior';
    selectedRegion: BodyRegion | null = null;
    hoveredRegionId: string | null = null;

    readonly exteriorRegions = BODY_REGIONS.filter(r => r.view === 'exterior');
    readonly interiorRegions = BODY_REGIONS.filter(r => r.view === 'interior');

    get currentRegions(): BodyRegion[] {
        return this.activeView === 'exterior' ? this.exteriorRegions : this.interiorRegions;
    }

    setView(view: 'exterior' | 'interior'): void {
        this.activeView = view;
        this.selectedRegion = null;
        this.regionSelected.emit(null);
    }

    selectRegion(region: BodyRegion): void {
        if (this.selectedRegion?.id === region.id) {
            this.selectedRegion = null;
            this.regionSelected.emit(null);
        } else {
            this.selectedRegion = region;
            this.regionSelected.emit(region);
        }
    }

    isSelected(region: BodyRegion): boolean {
        return this.selectedRegion?.id === region.id;
    }

    clearSelection(): void {
        this.selectedRegion = null;
        this.regionSelected.emit(null);
    }
}
```

**Step 5: Run tests to verify they pass**

```bash
ng test --reporter=verbose
```
Expected: All BodyMapComponent tests pass.

**Step 6: Commit**

```bash
git add src/app/components/body-map/
git commit -m "feat: add BodyMapComponent shell with view toggle and region selection"
```

---

## Task 4: Add Exterior SVG to Body Map

**Files:**
- Modify: `src/app/components/body-map/body-map.component.html`
- Modify: `src/app/components/body-map/body-map.component.scss`

**Step 1: Replace the template with exterior + interior SVG layout**

Replace `src/app/components/body-map/body-map.component.html` entirely:
```html
<div class="body-map-container">
    <!-- View Toggle -->
    <div class="view-toggle btn-group w-100 mb-3" role="group">
        <button type="button" class="btn btn-sm"
            [class.btn-warning]="activeView === 'exterior'"
            [class.btn-outline-secondary]="activeView !== 'exterior'"
            (click)="setView('exterior')">
            <i class="bi bi-person me-1"></i>Exterior
        </button>
        <button type="button" class="btn btn-sm"
            [class.btn-warning]="activeView === 'interior'"
            [class.btn-outline-secondary]="activeView !== 'interior'"
            (click)="setView('interior')">
            <i class="bi bi-lungs me-1"></i>Interior
        </button>
    </div>

    <!-- Selected Region Badge -->
    @if (selectedRegion) {
        <div class="selected-badge mb-2">
            <span class="badge bg-warning text-dark w-100 py-2">
                <i class="bi bi-geo-alt-fill me-1"></i>{{ selectedRegion.label }}
                <button type="button" class="btn-close btn-close-sm ms-2"
                    (click)="clearSelection()" aria-label="Clear body filter">
                </button>
            </span>
        </div>
    }

    <!-- Exterior SVG -->
    @if (activeView === 'exterior') {
        <svg class="body-svg" viewBox="0 0 200 440" xmlns="http://www.w3.org/2000/svg"
            role="img" aria-label="Exterior body diagram">

            <!-- Body outline (decorative, not clickable) -->
            <g class="body-outline">
                <!-- Head -->
                <ellipse cx="100" cy="42" rx="32" ry="38" />
                <!-- Neck -->
                <rect x="88" y="78" width="24" height="18" />
                <!-- Torso -->
                <rect x="58" y="94" width="84" height="114" rx="4" />
                <!-- Left Arm -->
                <polygon points="58,98 36,108 28,188 50,188 62,128" />
                <!-- Right Arm (mirror) -->
                <polygon points="142,98 164,108 172,188 150,188 138,128" />
                <!-- Left Hand -->
                <rect x="22" y="188" width="30" height="30" rx="4" />
                <!-- Right Hand -->
                <rect x="148" y="188" width="30" height="30" rx="4" />
                <!-- Hip/Pelvis -->
                <rect x="52" y="208" width="96" height="36" rx="4" />
                <!-- Left Leg -->
                <rect x="56" y="242" width="36" height="100" rx="4" />
                <!-- Right Leg -->
                <rect x="108" y="242" width="36" height="100" rx="4" />
                <!-- Left Foot -->
                <rect x="50" y="340" width="44" height="22" rx="4" />
                <!-- Right Foot -->
                <rect x="106" y="340" width="44" height="22" rx="4" />
            </g>

            <!-- Clickable Regions -->
            <!-- Skull (inside head, slightly smaller) -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(r)" *ngFor="let r of []"
                cx="100" cy="40" rx="28" ry="33" />

            <!-- Use a single ngFor over currentRegions, but SVG shapes differ per region.
                 Instead we explicitly define each region shape with its id. -->

            <!-- Head/Face -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[0])"
                [class.region-hovered]="hoveredRegionId === 'head-face'"
                cx="100" cy="42" rx="32" ry="38"
                (click)="selectRegion(exteriorRegions[0])"
                (mouseenter)="hoveredRegionId = 'head-face'"
                (mouseleave)="hoveredRegionId = null">
                <title>Head / Face</title>
            </ellipse>

            <!-- Skull (overlaid small badge inside head) -->
            <ellipse class="body-region region-secondary"
                [class.region-selected]="isSelected(exteriorRegions[6])"
                [class.region-hovered]="hoveredRegionId === 'skull'"
                cx="100" cy="34" rx="20" ry="22"
                (click)="selectRegion(exteriorRegions[6])"
                (mouseenter)="hoveredRegionId = 'skull'"
                (mouseleave)="hoveredRegionId = null">
                <title>Skull</title>
            </ellipse>

            <!-- Neck -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[1])"
                [class.region-hovered]="hoveredRegionId === 'neck'"
                x="88" y="78" width="24" height="18" rx="2"
                (click)="selectRegion(exteriorRegions[1])"
                (mouseenter)="hoveredRegionId = 'neck'"
                (mouseleave)="hoveredRegionId = null">
                <title>Neck</title>
            </rect>

            <!-- Shoulder/Arm (left) -->
            <polygon class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[2])"
                [class.region-hovered]="hoveredRegionId === 'shoulder-arm'"
                points="58,98 36,108 28,188 50,188 62,128"
                (click)="selectRegion(exteriorRegions[2])"
                (mouseenter)="hoveredRegionId = 'shoulder-arm'"
                (mouseleave)="hoveredRegionId = null">
                <title>Shoulder / Arm</title>
            </polygon>
            <!-- Shoulder/Arm (right, mirror) -->
            <polygon class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[2])"
                [class.region-hovered]="hoveredRegionId === 'shoulder-arm'"
                points="142,98 164,108 172,188 150,188 138,128"
                (click)="selectRegion(exteriorRegions[2])"
                (mouseenter)="hoveredRegionId = 'shoulder-arm'"
                (mouseleave)="hoveredRegionId = null">
                <title>Shoulder / Arm</title>
            </polygon>

            <!-- Wrist/Hand (left) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[3])"
                [class.region-hovered]="hoveredRegionId === 'wrist-hand'"
                x="22" y="188" width="30" height="30" rx="4"
                (click)="selectRegion(exteriorRegions[3])"
                (mouseenter)="hoveredRegionId = 'wrist-hand'"
                (mouseleave)="hoveredRegionId = null">
                <title>Wrist / Hand</title>
            </rect>
            <!-- Wrist/Hand (right) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[3])"
                [class.region-hovered]="hoveredRegionId === 'wrist-hand'"
                x="148" y="188" width="30" height="30" rx="4"
                (click)="selectRegion(exteriorRegions[3])"
                (mouseenter)="hoveredRegionId = 'wrist-hand'"
                (mouseleave)="hoveredRegionId = null">
                <title>Wrist / Hand</title>
            </rect>

            <!-- Chest/Torso (upper torso, above abdomen) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[4])"
                [class.region-hovered]="hoveredRegionId === 'chest-torso'"
                x="62" y="96" width="76" height="58" rx="2"
                (click)="selectRegion(exteriorRegions[4])"
                (mouseenter)="hoveredRegionId = 'chest-torso'"
                (mouseleave)="hoveredRegionId = null">
                <title>Chest / Torso</title>
            </rect>

            <!-- Spine/Back (center strip over torso) -->
            <rect class="body-region region-secondary"
                [class.region-selected]="isSelected(exteriorRegions[5])"
                [class.region-hovered]="hoveredRegionId === 'spine-back'"
                x="92" y="96" width="16" height="148" rx="2"
                (click)="selectRegion(exteriorRegions[5])"
                (mouseenter)="hoveredRegionId = 'spine-back'"
                (mouseleave)="hoveredRegionId = null">
                <title>Spine / Back</title>
            </rect>

            <!-- Abdomen (lower torso, above hip) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[10])"
                [class.region-hovered]="hoveredRegionId === 'abdomen-hint'"
                x="62" y="154" width="76" height="54" rx="2"
                (click)="setView('interior')"
                (mouseenter)="hoveredRegionId = 'abdomen-hint'"
                (mouseleave)="hoveredRegionId = null">
                <title>Abdomen (click to see Interior view)</title>
            </rect>

            <!-- Skin toggle button (special - covers whole figure) -->
            <rect class="body-region region-skin-toggle"
                [class.region-selected]="isSelected(exteriorRegions[10])"
                [class.region-hovered]="hoveredRegionId === 'skin'"
                x="0" y="0" width="200" height="440" rx="0" opacity="0"
                style="pointer-events: none" />

            <!-- Hip/Pelvis -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[7])"
                [class.region-hovered]="hoveredRegionId === 'hip-pelvis'"
                x="54" y="208" width="92" height="34" rx="2"
                (click)="selectRegion(exteriorRegions[7])"
                (mouseenter)="hoveredRegionId = 'hip-pelvis'"
                (mouseleave)="hoveredRegionId = null">
                <title>Hip / Pelvis</title>
            </rect>

            <!-- Knee/Leg (left) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[8])"
                [class.region-hovered]="hoveredRegionId === 'knee-leg'"
                x="56" y="242" width="36" height="98" rx="2"
                (click)="selectRegion(exteriorRegions[8])"
                (mouseenter)="hoveredRegionId = 'knee-leg'"
                (mouseleave)="hoveredRegionId = null">
                <title>Knee / Leg</title>
            </rect>
            <!-- Knee/Leg (right) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[8])"
                [class.region-hovered]="hoveredRegionId === 'knee-leg'"
                x="108" y="242" width="36" height="98" rx="2"
                (click)="selectRegion(exteriorRegions[8])"
                (mouseenter)="hoveredRegionId = 'knee-leg'"
                (mouseleave)="hoveredRegionId = null">
                <title>Knee / Leg</title>
            </rect>

            <!-- Foot/Ankle (left) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[9])"
                [class.region-hovered]="hoveredRegionId === 'foot-ankle'"
                x="50" y="340" width="44" height="22" rx="4"
                (click)="selectRegion(exteriorRegions[9])"
                (mouseenter)="hoveredRegionId = 'foot-ankle'"
                (mouseleave)="hoveredRegionId = null">
                <title>Foot / Ankle</title>
            </rect>
            <!-- Foot/Ankle (right) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(exteriorRegions[9])"
                [class.region-hovered]="hoveredRegionId === 'foot-ankle'"
                x="106" y="340" width="44" height="22" rx="4"
                (click)="selectRegion(exteriorRegions[9])"
                (mouseenter)="hoveredRegionId = 'foot-ankle'"
                (mouseleave)="hoveredRegionId = null">
                <title>Foot / Ankle</title>
            </rect>

            <!-- Region Labels -->
            <g class="region-labels" pointer-events="none">
                <text x="100" y="42" text-anchor="middle" dominant-baseline="middle" font-size="7">Head</text>
                <text x="100" y="83" text-anchor="middle" dominant-baseline="middle" font-size="6">Neck</text>
                <text x="40" y="145" text-anchor="middle" dominant-baseline="middle" font-size="6">Arm</text>
                <text x="160" y="145" text-anchor="middle" dominant-baseline="middle" font-size="6">Arm</text>
                <text x="37" y="203" text-anchor="middle" dominant-baseline="middle" font-size="6">Hand</text>
                <text x="163" y="203" text-anchor="middle" dominant-baseline="middle" font-size="6">Hand</text>
                <text x="100" y="122" text-anchor="middle" dominant-baseline="middle" font-size="6">Chest</text>
                <text x="100" y="180" text-anchor="middle" dominant-baseline="middle" font-size="6">Abdomen</text>
                <text x="100" y="225" text-anchor="middle" dominant-baseline="middle" font-size="6">Hip</text>
                <text x="74" y="290" text-anchor="middle" dominant-baseline="middle" font-size="6">Leg</text>
                <text x="126" y="290" text-anchor="middle" dominant-baseline="middle" font-size="6">Leg</text>
                <text x="72" y="352" text-anchor="middle" dominant-baseline="middle" font-size="6">Foot</text>
                <text x="128" y="352" text-anchor="middle" dominant-baseline="middle" font-size="6">Foot</text>
            </g>
        </svg>

        <!-- Skin toggle below SVG -->
        <button class="btn btn-sm w-100 mt-2"
            [class.btn-warning]="isSelected(exteriorRegions[10])"
            [class.btn-outline-secondary]="!isSelected(exteriorRegions[10])"
            (click)="selectRegion(exteriorRegions[10])">
            <i class="bi bi-person-fill me-1"></i>The Skin
        </button>
    }

    <!-- Interior SVG -->
    @if (activeView === 'interior') {
        <svg class="body-svg" viewBox="0 0 200 440" xmlns="http://www.w3.org/2000/svg"
            role="img" aria-label="Interior organ diagram">

            <!-- Body outline (decorative) -->
            <g class="body-outline">
                <ellipse cx="100" cy="42" rx="32" ry="38" />
                <rect x="58" y="78" width="84" height="200" rx="8" />
                <rect x="52" y="276" width="96" height="36" rx="4" />
                <rect x="56" y="310" width="36" height="80" rx="4" />
                <rect x="108" y="310" width="36" height="80" rx="4" />
            </g>

            <!-- Clickable Interior Regions -->

            <!-- Brain -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(interiorRegions[0])"
                [class.region-hovered]="hoveredRegionId === 'brain'"
                cx="100" cy="38" rx="26" ry="30"
                (click)="selectRegion(interiorRegions[0])"
                (mouseenter)="hoveredRegionId = 'brain'"
                (mouseleave)="hoveredRegionId = null">
                <title>Brain</title>
            </ellipse>

            <!-- Spinal Cord (center strip) -->
            <rect class="body-region region-secondary"
                [class.region-selected]="isSelected(interiorRegions[1])"
                [class.region-hovered]="hoveredRegionId === 'spinal-cord'"
                x="94" y="78" width="12" height="198" rx="3"
                (click)="selectRegion(interiorRegions[1])"
                (mouseenter)="hoveredRegionId = 'spinal-cord'"
                (mouseleave)="hoveredRegionId = null">
                <title>Spinal Cord</title>
            </rect>

            <!-- Endocrine (thyroid area, neck) -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(interiorRegions[10])"
                [class.region-hovered]="hoveredRegionId === 'endocrine'"
                cx="100" cy="84" rx="14" ry="9"
                (click)="selectRegion(interiorRegions[10])"
                (mouseenter)="hoveredRegionId = 'endocrine'"
                (mouseleave)="hoveredRegionId = null">
                <title>Endocrine</title>
            </ellipse>

            <!-- Heart (left chest) -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(interiorRegions[2])"
                [class.region-hovered]="hoveredRegionId === 'heart'"
                cx="82" cy="120" rx="16" ry="18"
                (click)="selectRegion(interiorRegions[2])"
                (mouseenter)="hoveredRegionId = 'heart'"
                (mouseleave)="hoveredRegionId = null">
                <title>Heart</title>
            </ellipse>

            <!-- Lungs (left) -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(interiorRegions[4])"
                [class.region-hovered]="hoveredRegionId === 'lungs'"
                cx="72" cy="136" rx="16" ry="28"
                (click)="selectRegion(interiorRegions[4])"
                (mouseenter)="hoveredRegionId = 'lungs'"
                (mouseleave)="hoveredRegionId = null">
                <title>Lungs</title>
            </ellipse>
            <!-- Lungs (right) -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(interiorRegions[4])"
                [class.region-hovered]="hoveredRegionId === 'lungs'"
                cx="128" cy="136" rx="16" ry="28"
                (click)="selectRegion(interiorRegions[4])"
                (mouseenter)="hoveredRegionId = 'lungs'"
                (mouseleave)="hoveredRegionId = null">
                <title>Lungs</title>
            </ellipse>

            <!-- Arteries/Veins (upper abdomen, sides) -->
            <ellipse class="body-region region-secondary"
                [class.region-selected]="isSelected(interiorRegions[3])"
                [class.region-hovered]="hoveredRegionId === 'arteries-veins'"
                cx="100" cy="168" rx="34" ry="12"
                (click)="selectRegion(interiorRegions[3])"
                (mouseenter)="hoveredRegionId = 'arteries-veins'"
                (mouseleave)="hoveredRegionId = null">
                <title>Arteries / Veins</title>
            </ellipse>

            <!-- Liver (right upper abdomen) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(interiorRegions[5])"
                [class.region-hovered]="hoveredRegionId === 'liver'"
                x="112" y="172" width="28" height="22" rx="4"
                (click)="selectRegion(interiorRegions[5])"
                (mouseenter)="hoveredRegionId = 'liver'"
                (mouseleave)="hoveredRegionId = null">
                <title>Liver</title>
            </rect>

            <!-- Digestive (center abdomen) -->
            <ellipse class="body-region"
                [class.region-selected]="isSelected(interiorRegions[6])"
                [class.region-hovered]="hoveredRegionId === 'digestive'"
                cx="95" cy="210" rx="28" ry="26"
                (click)="selectRegion(interiorRegions[6])"
                (mouseenter)="hoveredRegionId = 'digestive'"
                (mouseleave)="hoveredRegionId = null">
                <title>Digestive System</title>
            </ellipse>

            <!-- Kidneys (left and right, flanking spine in lower abdomen) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(interiorRegions[7])"
                [class.region-hovered]="hoveredRegionId === 'kidneys-bladder'"
                x="62" y="196" width="18" height="24" rx="4"
                (click)="selectRegion(interiorRegions[7])"
                (mouseenter)="hoveredRegionId = 'kidneys-bladder'"
                (mouseleave)="hoveredRegionId = null">
                <title>Kidneys / Bladder</title>
            </rect>
            <rect class="body-region"
                [class.region-selected]="isSelected(interiorRegions[7])"
                [class.region-hovered]="hoveredRegionId === 'kidneys-bladder'"
                x="120" y="196" width="18" height="24" rx="4"
                (click)="selectRegion(interiorRegions[7])"
                (mouseenter)="hoveredRegionId = 'kidneys-bladder'"
                (mouseleave)="hoveredRegionId = null">
                <title>Kidneys / Bladder</title>
            </rect>

            <!-- Lymphatic/Immune (lower torso) -->
            <ellipse class="body-region region-secondary"
                [class.region-selected]="isSelected(interiorRegions[11])"
                [class.region-hovered]="hoveredRegionId === 'lymphatic-immune'"
                cx="100" cy="248" rx="28" ry="16"
                (click)="selectRegion(interiorRegions[11])"
                (mouseenter)="hoveredRegionId = 'lymphatic-immune'"
                (mouseleave)="hoveredRegionId = null">
                <title>Lymphatic / Immune</title>
            </ellipse>

            <!-- Reproductive (pelvis) -->
            <rect class="body-region"
                [class.region-selected]="isSelected(interiorRegions[8])"
                [class.region-hovered]="hoveredRegionId === 'reproductive'"
                x="66" y="276" width="68" height="30" rx="4"
                (click)="selectRegion(interiorRegions[8])"
                (mouseenter)="hoveredRegionId = 'reproductive'"
                (mouseleave)="hoveredRegionId = null">
                <title>Reproductive</title>
            </rect>

            <!-- Region Labels -->
            <g class="region-labels" pointer-events="none">
                <text x="100" y="38" text-anchor="middle" dominant-baseline="middle" font-size="7">Brain</text>
                <text x="82" y="120" text-anchor="middle" dominant-baseline="middle" font-size="6">Heart</text>
                <text x="72" y="136" text-anchor="middle" dominant-baseline="middle" font-size="5">Lung</text>
                <text x="128" y="136" text-anchor="middle" dominant-baseline="middle" font-size="5">Lung</text>
                <text x="100" y="84" text-anchor="middle" dominant-baseline="middle" font-size="5">Endocrine</text>
                <text x="100" y="168" text-anchor="middle" dominant-baseline="middle" font-size="5">Arteries/Veins</text>
                <text x="126" y="183" text-anchor="middle" dominant-baseline="middle" font-size="5">Liver</text>
                <text x="95" y="210" text-anchor="middle" dominant-baseline="middle" font-size="5">Digestive</text>
                <text x="71" y="208" text-anchor="middle" dominant-baseline="middle" font-size="4">Kidney</text>
                <text x="129" y="208" text-anchor="middle" dominant-baseline="middle" font-size="4">Kidney</text>
                <text x="100" y="248" text-anchor="middle" dominant-baseline="middle" font-size="5">Lymphatic</text>
                <text x="100" y="291" text-anchor="middle" dominant-baseline="middle" font-size="5">Reproductive</text>
                <text x="100" y="140" text-anchor="middle" dominant-baseline="middle" font-size="5" fill="var(--bs-secondary)">Spine</text>
            </g>
        </svg>
    }

    <!-- Hint text -->
    <p class="hint-text text-center mt-2 small text-muted">
        @if (activeView === 'exterior') {
            Click a body region to filter results. Click Abdomen to switch to Interior view.
        } @else {
            Click an organ to filter results.
        }
    </p>
</div>
```

**Step 2: Add SCSS**

Replace `src/app/components/body-map/body-map.component.scss`:
```scss
.body-map-container {
    padding: 0.5rem;
}

.body-svg {
    width: 100%;
    height: auto;
    max-height: 440px;
    display: block;
    margin: 0 auto;
}

// Decorative body outline
.body-outline ellipse,
.body-outline rect,
.body-outline polygon {
    fill: var(--card-bg, #1e1e1e);
    stroke: var(--bs-secondary, #6c757d);
    stroke-width: 1.5;
}

// Clickable regions
.body-region {
    fill: transparent;
    stroke: var(--bs-info, #0dcaf0);
    stroke-width: 1;
    stroke-dasharray: 3 2;
    cursor: pointer;
    transition: fill 0.15s ease, stroke 0.15s ease;

    &:hover,
    &.region-hovered {
        fill: rgba(13, 202, 240, 0.2);
        stroke: var(--bs-info, #0dcaf0);
        stroke-dasharray: none;
        stroke-width: 1.5;
    }

    &.region-selected {
        fill: rgba(255, 193, 7, 0.3);
        stroke: var(--bs-warning, #ffc107);
        stroke-dasharray: none;
        stroke-width: 2;
    }

    // Less visually prominent secondary regions (spine, arteries)
    &.region-secondary {
        stroke-dasharray: 4 3;
        opacity: 0.7;
    }
}

// Text labels inside SVG
.region-labels text {
    fill: var(--bs-light, #f8f9fa);
    font-family: inherit;
    font-size: 6px;
    user-select: none;
}

// Selected badge
.selected-badge .btn-close {
    filter: invert(0);
    opacity: 0.7;
    &:hover { opacity: 1; }
}

.hint-text {
    font-size: 0.7rem;
    color: var(--bs-secondary);
}
```

**Step 3: Verify in browser**

```bash
npx ng serve
```
Navigate to `http://localhost:4200`. The body map should appear with both Exterior and Interior toggle views. Hovering over regions should highlight them; clicking should select them and show a badge.

**Step 4: Run tests**

```bash
ng test
```
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/app/components/body-map/
git commit -m "feat: add exterior and interior SVG body map with hover/click regions"
```

---

## Task 5: Create Results Table Component

**Files:**
- Create: `src/app/components/results-table/results-table.component.ts`
- Create: `src/app/components/results-table/results-table.component.html`
- Create: `src/app/components/results-table/results-table.component.scss`
- Create: `src/app/components/results-table/results-table.component.spec.ts`

**Step 1: Generate component**

```bash
npx ng generate component components/results-table --standalone --skip-tests
```

**Step 2: Write the failing test**

Create `src/app/components/results-table/results-table.component.spec.ts`:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsTableComponent } from './results-table.component';
import { DiagnosticCode } from '../../models/rating.model';
import { describe, it, expect, beforeEach } from 'vitest';

const mockRatings: DiagnosticCode[] = [
    {
        code: '5260',
        condition: 'Leg, limitation of flexion of',
        system: 'Musculoskeletal System',
        subSystem: 'Knee and Leg',
        link: 'https://www.ecfr.gov/current/title-38/section-4.71a',
        criteria: [{ percent: 60, description: 'Flexion limited to 15°' }]
    },
    {
        code: '5261',
        condition: 'Leg, limitation of extension of',
        system: 'Musculoskeletal System',
        subSystem: 'Knee and Leg',
        link: 'https://www.ecfr.gov/current/title-38/section-4.71a',
        criteria: [{ percent: 50, description: 'Extension limited to 5°' }]
    }
];

describe('ResultsTableComponent', () => {
    let component: ResultsTableComponent;
    let fixture: ComponentFixture<ResultsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResultsTableComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(ResultsTableComponent);
        component = fixture.componentInstance;
        component.ratings = mockRatings;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct number of rows', () => {
        const rows = fixture.nativeElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
    });

    it('should emit rowClicked when a row is clicked', () => {
        const emitted: DiagnosticCode[] = [];
        component.rowClicked.subscribe((r: DiagnosticCode) => emitted.push(r));

        const firstRow = fixture.nativeElement.querySelector('tbody tr');
        firstRow.click();

        expect(emitted.length).toBe(1);
        expect(emitted[0].code).toBe('5260');
    });

    it('should show result count', () => {
        const countEl = fixture.nativeElement.querySelector('.result-count');
        expect(countEl?.textContent).toContain('2');
    });

    it('should show no-results message when ratings is empty', () => {
        component.ratings = [];
        fixture.detectChanges();
        const noResults = fixture.nativeElement.querySelector('.no-results');
        expect(noResults).toBeTruthy();
    });
});
```

**Step 3: Run test to verify it fails**

```bash
ng test --reporter=verbose
```
Expected: FAIL.

**Step 4: Implement component**

Replace `src/app/components/results-table/results-table.component.ts`:
```typescript
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiagnosticCode } from '../../models/rating.model';

@Component({
    selector: 'app-results-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './results-table.component.html',
    styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent {
    @Input() ratings: DiagnosticCode[] = [];
    @Output() rowClicked = new EventEmitter<DiagnosticCode>();

    onRowClick(rating: DiagnosticCode): void {
        this.rowClicked.emit(rating);
    }

    getFragmentLink(link: string, code: string): string {
        return `${link}#:~:text=${code}`;
    }
}
```

Create `src/app/components/results-table/results-table.component.html`:
```html
<div class="results-container">
    <div class="result-count text-muted small mb-2">
        Showing <strong>{{ ratings.length }}</strong> of <strong>741</strong> conditions
    </div>

    @if (ratings.length === 0) {
        <div class="no-results text-center py-5">
            <i class="bi bi-search fs-1 text-muted d-block mb-2"></i>
            <h5 class="text-muted">No results found</h5>
            <p class="text-muted small">Try adjusting your search or body map selection.</p>
        </div>
    } @else {
        <div class="table-responsive">
            <table class="table table-sm table-hover results-table">
                <thead>
                    <tr>
                        <th style="width: 110px">Diag. Code</th>
                        <th>Condition / Title</th>
                        <th style="width: 120px">38 CFR</th>
                    </tr>
                </thead>
                <tbody>
                    @for (rating of ratings; track rating.code) {
                        <tr class="result-row" (click)="onRowClick(rating)" role="button">
                            <td>
                                <span class="badge bg-primary">{{ rating.code }}</span>
                            </td>
                            <td class="condition-cell">
                                <div class="condition-title">{{ rating.condition }}</div>
                                <small class="text-muted">{{ rating.system }}
                                    @if (rating.subSystem) { › {{ rating.subSystem }} }
                                </small>
                            </td>
                            <td>
                                @if (rating.link) {
                                    <a [href]="getFragmentLink(rating.link, rating.code)"
                                        target="_blank"
                                        class="btn btn-sm btn-outline-info"
                                        (click)="$event.stopPropagation()">
                                        38 CFR <i class="bi bi-box-arrow-up-right ms-1"></i>
                                    </a>
                                }
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    }
</div>
```

Create `src/app/components/results-table/results-table.component.scss`:
```scss
.results-table {
    color: var(--body-color);

    thead th {
        color: var(--bs-secondary);
        border-bottom-color: var(--card-border);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .result-row {
        cursor: pointer;
        border-bottom: 1px solid var(--card-border);
        transition: background-color 0.1s ease;

        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }

        td {
            vertical-align: middle;
            padding: 0.5rem 0.75rem;
        }
    }

    .condition-title {
        font-size: 0.9rem;
        color: var(--body-color);
    }
}

.result-count {
    font-size: 0.8rem;
}
```

**Step 5: Run tests to verify they pass**

```bash
ng test --reporter=verbose
```
Expected: All ResultsTableComponent tests pass.

**Step 6: Commit**

```bash
git add src/app/components/results-table/
git commit -m "feat: add ResultsTableComponent with 3-column table and row click emission"
```

---

## Task 6: Create Criteria Modal Component

**Files:**
- Create: `src/app/components/criteria-modal/criteria-modal.component.ts`
- Create: `src/app/components/criteria-modal/criteria-modal.component.html`
- Create: `src/app/components/criteria-modal/criteria-modal.component.scss`
- Create: `src/app/components/criteria-modal/criteria-modal.component.spec.ts`

**Step 1: Generate component**

```bash
npx ng generate component components/criteria-modal --standalone --skip-tests
```

**Step 2: Write the failing test**

Create `src/app/components/criteria-modal/criteria-modal.component.spec.ts`:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriteriaModalComponent } from './criteria-modal.component';
import { DiagnosticCode } from '../../models/rating.model';
import { describe, it, expect, beforeEach } from 'vitest';

const mockRating: DiagnosticCode = {
    code: '5260',
    condition: 'Leg, limitation of flexion of',
    system: 'Musculoskeletal System',
    subSystem: 'Knee and Leg',
    link: 'https://www.ecfr.gov/current/title-38/section-4.71a',
    criteria: [
        { percent: 60, description: 'Flexion limited to 15°' },
        { percent: 40, description: 'Flexion limited to 30°' }
    ],
    notes: 'Some important note here.'
};

describe('CriteriaModalComponent', () => {
    let component: CriteriaModalComponent;
    let fixture: ComponentFixture<CriteriaModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CriteriaModalComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(CriteriaModalComponent);
        component = fixture.componentInstance;
        component.rating = mockRating;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the diagnostic code in the modal title', () => {
        const title = fixture.nativeElement.querySelector('.modal-title');
        expect(title?.textContent).toContain('5260');
    });

    it('should display all criteria rows', () => {
        const rows = fixture.nativeElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
    });

    it('should display notes when present', () => {
        const notes = fixture.nativeElement.querySelector('.notes-section');
        expect(notes?.textContent).toContain('Some important note here.');
    });

    it('should display 38CFR link when link is present', () => {
        const link = fixture.nativeElement.querySelector('.cfr-link');
        expect(link).toBeTruthy();
        expect(link?.getAttribute('href')).toContain('ecfr.gov');
    });

    it('should return correct fragment link', () => {
        const result = component.getFragmentLink('https://example.com/page', '5260');
        expect(result).toBe('https://example.com/page#:~:text=5260');
    });
});
```

**Step 3: Run test to verify it fails**

```bash
ng test --reporter=verbose
```
Expected: FAIL.

**Step 4: Implement the component**

Replace `src/app/components/criteria-modal/criteria-modal.component.ts`:
```typescript
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DiagnosticCode } from '../../models/rating.model';

@Component({
    selector: 'app-criteria-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './criteria-modal.component.html',
    styleUrls: ['./criteria-modal.component.scss']
})
export class CriteriaModalComponent {
    @Input() rating: DiagnosticCode | null = null;

    getFragmentLink(link: string, code: string): string {
        return `${link}#:~:text=${code}`;
    }
}
```

Create `src/app/components/criteria-modal/criteria-modal.component.html`:
```html
<div class="modal fade" id="criteriaModal" tabindex="-1"
    aria-labelledby="criteriaModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">

            @if (rating) {
                <div class="modal-header">
                    <h5 class="modal-title" id="criteriaModalLabel">
                        <span class="badge bg-primary me-2">{{ rating.code }}</span>
                        {{ rating.condition }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <p class="breadcrumb-label text-muted small mb-3">
                        {{ rating.system }}
                        @if (rating.subSystem) { <span class="mx-1">›</span> {{ rating.subSystem }} }
                    </p>

                    <div class="table-responsive">
                        <table class="table table-sm criteria-table">
                            <thead>
                                <tr>
                                    <th style="width: 90px">Rating %</th>
                                    <th>Criteria</th>
                                </tr>
                            </thead>
                            <tbody>
                                @for (criterion of rating.criteria; track criterion.percent) {
                                    <tr>
                                        <td class="rating-percent">{{ criterion.percent }}%</td>
                                        <td class="criteria-desc">{{ criterion.description }}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    @if (rating.notes) {
                        <div class="notes-section mt-3 p-3">
                            <p class="mb-0 small"><i class="bi bi-info-circle me-1"></i>{{ rating.notes }}</p>
                        </div>
                    }
                </div>

                <div class="modal-footer">
                    @if (rating.link) {
                        <a [href]="getFragmentLink(rating.link, rating.code)"
                            target="_blank"
                            class="btn btn-outline-info cfr-link">
                            View 38 CFR <i class="bi bi-box-arrow-up-right ms-1"></i>
                        </a>
                    }
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            }
        </div>
    </div>
</div>
```

Create `src/app/components/criteria-modal/criteria-modal.component.scss`:
```scss
.modal-content {
    background-color: var(--card-bg);
    border-color: var(--card-border);
}

.modal-header {
    border-bottom-color: var(--card-border);
}

.modal-footer {
    border-top-color: var(--card-border);
}

.modal-title {
    color: var(--body-color);
    font-size: 1rem;
}

.criteria-table {
    color: var(--body-color);

    thead th {
        color: var(--bs-secondary);
        border-bottom-color: var(--card-border);
        font-size: 0.8rem;
    }

    tbody tr {
        border-color: var(--card-border);
    }

    .rating-percent {
        font-weight: bold;
        color: var(--bs-warning);
        font-size: 1rem;
    }

    .criteria-desc {
        color: var(--body-color);
        font-size: 0.875rem;
    }
}

.notes-section {
    background-color: rgba(0, 0, 0, 0.15);
    border-left: 3px solid var(--accent-color);
    border-radius: 0 4px 4px 0;
    color: var(--bs-secondary);
}
```

**Step 5: Run tests to verify they pass**

```bash
ng test --reporter=verbose
```
Expected: All CriteriaModalComponent tests pass.

**Step 6: Commit**

```bash
git add src/app/components/criteria-modal/
git commit -m "feat: add CriteriaModalComponent with Bootstrap modal and full criteria display"
```

---

## Task 7: Integrate Body Map Filter into Dashboard

**Files:**
- Modify: `src/app/components/dashboard/dashboard.component.ts`
- Modify: `src/app/components/dashboard/dashboard.component.spec.ts` (create if missing)

**Step 1: Write the failing test**

Create `src/app/components/dashboard/dashboard.component.spec.ts`:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RatingDataService } from '../../services/rating-data.service';
import { DiagnosticCode } from '../../models/rating.model';
import { BODY_REGIONS } from '../../models/body-region.model';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockData: DiagnosticCode[] = [
    { code: '5260', condition: 'Leg flexion', system: 'Musculoskeletal System', subSystem: 'Knee and Leg', criteria: [{ percent: 60, description: 'Test' }] },
    { code: '6260', condition: 'Tinnitus', system: 'The Ear', subSystem: 'Diseases of the Ear', criteria: [{ percent: 10, description: 'Test' }] },
    { code: '9411', condition: 'PTSD', system: 'Mental Disorders', subSystem: 'Mental Disorders', criteria: [{ percent: 70, description: 'Test' }] },
];

describe('DashboardComponent - body region filter', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: RatingDataService,
                    useValue: {
                        getRatings: () => of(mockData),
                        getSystemGroupings: () => of([])
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should start with all ratings showing', () => {
        expect(component.filteredRatings.length).toBe(3);
    });

    it('should filter by body region', () => {
        const kneeRegion = BODY_REGIONS.find(r => r.id === 'knee-leg')!;
        component.onBodyRegionSelected(kneeRegion);
        expect(component.filteredRatings.length).toBe(1);
        expect(component.filteredRatings[0].code).toBe('5260');
    });

    it('should filter by brain region including mental disorders', () => {
        const brainRegion = BODY_REGIONS.find(r => r.id === 'brain')!;
        component.onBodyRegionSelected(brainRegion);
        expect(component.filteredRatings.length).toBe(1);
        expect(component.filteredRatings[0].code).toBe('9411');
    });

    it('should clear body region filter when null emitted', () => {
        const kneeRegion = BODY_REGIONS.find(r => r.id === 'knee-leg')!;
        component.onBodyRegionSelected(kneeRegion);
        expect(component.filteredRatings.length).toBe(1);

        component.onBodyRegionSelected(null);
        expect(component.filteredRatings.length).toBe(3);
    });
});
```

**Step 2: Run test to verify it fails**

```bash
ng test --reporter=verbose
```
Expected: FAIL — `onBodyRegionSelected` not found.

**Step 3: Extend DashboardComponent**

In `src/app/components/dashboard/dashboard.component.ts`, add the import and new property/method. The full updated file:

```typescript
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DiagnosticCode, SystemGrouping } from '../../models/rating.model';
import { BodyRegion } from '../../models/body-region.model';
import { RatingDataService } from '../../services/rating-data.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    ratings: DiagnosticCode[] = [];
    filteredRatings: DiagnosticCode[] = [];

    systemGroupings: SystemGrouping[] = [];
    availableSubSystems: string[] = [];

    // Filters
    searchCode: string = '';
    searchCondition: string = '';
    selectedSystem: string = '';
    selectedSubSystem: string = '';
    selectedBodyRegion: BodyRegion | null = null;

    // Modal state
    selectedRating: DiagnosticCode | null = null;

    // Theme state
    currentTheme: string = 'Night Ops';

    constructor(
        private ratingService: RatingDataService,
        @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit(): void {
        this.ratingService.getRatings().subscribe({
            next: (data) => {
                this.ratings = data;
                this.filteredRatings = data;
                this.clearFilters();
            },
            error: (err) => {
                console.error('Error loading ratings:', err);
            }
        });

        this.ratingService.getSystemGroupings().subscribe(groupings => {
            this.systemGroupings = groupings;
        });
    }

    onSystemChange(): void {
        this.selectedSubSystem = '';
        if (this.selectedSystem) {
            const group = this.systemGroupings.find(g => g.name === this.selectedSystem);
            this.availableSubSystems = group ? group.subSystems : [];
        } else {
            this.availableSubSystems = [];
        }
        this.applyFilter();
    }

    onBodyRegionSelected(region: BodyRegion | null): void {
        this.selectedBodyRegion = region;
        this.applyFilter();
    }

    applyFilter(): void {
        if (!this.ratings) {
            this.filteredRatings = [];
            return;
        }

        let temp = [...this.ratings];

        if (this.searchCode && this.searchCode.trim() !== '') {
            const codeTerm = this.searchCode.toLowerCase().trim();
            temp = temp.filter(r => r.code.toLowerCase().includes(codeTerm));
        }

        if (this.searchCondition && this.searchCondition.trim() !== '') {
            const term = this.searchCondition.toLowerCase().trim();
            temp = temp.filter(r =>
                r.condition.toLowerCase().includes(term) ||
                r.system.toLowerCase().includes(term) ||
                (r.subSystem && r.subSystem.toLowerCase().includes(term))
            );
        }

        if (this.selectedSystem && this.selectedSystem.trim() !== '') {
            temp = temp.filter(r => r.system === this.selectedSystem);
        }

        if (this.selectedSubSystem && this.selectedSubSystem.trim() !== '') {
            temp = temp.filter(r => r.subSystem === this.selectedSubSystem);
        }

        if (this.selectedBodyRegion) {
            temp = temp.filter(r =>
                this.selectedBodyRegion!.subsystems.some(s =>
                    s.system === r.system &&
                    (s.subSystem == null || s.subSystem === r.subSystem)
                )
            );
        }

        this.filteredRatings = temp;
    }

    clearFilters(): void {
        this.searchCode = '';
        this.searchCondition = '';
        this.selectedSystem = '';
        this.selectedSubSystem = '';
        this.selectedBodyRegion = null;
        this.onSystemChange();
    }

    openModal(rating: DiagnosticCode): void {
        this.selectedRating = rating;
    }

    setTheme(themeName: string, themeId: string) {
        this.currentTheme = themeName;
        if (themeId === 'default') {
            this.document.documentElement.removeAttribute('data-theme');
        } else {
            this.document.documentElement.setAttribute('data-theme', themeId);
        }
    }

    getFragmentLink(link: string, code: string): string {
        return `${link}#:~:text=${code}`;
    }
}
```

**Step 4: Run tests to verify they pass**

```bash
ng test --reporter=verbose
```
Expected: All dashboard filter tests pass.

**Step 5: Commit**

```bash
git add src/app/components/dashboard/dashboard.component.ts src/app/components/dashboard/dashboard.component.spec.ts
git commit -m "feat: extend DashboardComponent with body region filter and modal state"
```

---

## Task 8: Update Dashboard Template and Layout

**Files:**
- Modify: `src/app/components/dashboard/dashboard.component.html`
- Modify: `src/app/components/dashboard/dashboard.component.scss`

**Step 1: Replace the dashboard template**

Replace `src/app/components/dashboard/dashboard.component.html` entirely:
```html
<div class="container-fluid py-4">

    <!-- Header -->
    <div class="dashboard-hero p-4 rounded mb-4 shadow-lg position-relative">
        <div class="overlay position-absolute top-0 start-0 w-100 h-100"
            style="background: rgba(0,0,0,0.4); z-index: 1;"></div>
        <div class="row position-relative" style="z-index: 2;">
            <div class="col-12 d-flex justify-content-between align-items-center">
                <h1 class="display-6 fw-bold text-uppercase text-white text-shadow" style="letter-spacing: 2px;">
                    <i class="bi bi-crosshair me-2"></i>Operation: Ouchie! 2.0
                </h1>
                <div class="dropdown">
                    <button class="btn btn-outline-light dropdown-toggle backdrop-blur" type="button"
                        id="themeDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-palette me-2"></i>Loadout: {{ currentTheme }}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="themeDropdown"
                        style="background-color: var(--card-bg); border-color: var(--card-border);">
                        <li><button class="dropdown-item text-white" (click)="setTheme('Night Ops', 'default')">Night Ops (Default)</button></li>
                        <li><button class="dropdown-item text-white" (click)="setTheme('Oorah!', 'usmc')">Oorah!</button></li>
                        <li><button class="dropdown-item text-white" (click)="setTheme('Jungle Standard', 'jungle')">Jungle Standard</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Layout: Body Map (left) + Filters (right) -->
    <div class="row g-3 mb-4">

        <!-- Body Map Column -->
        <div class="col-12 col-lg-3">
            <div class="card filter-card h-100">
                <div class="card-header py-2">
                    <small class="text-muted text-uppercase fw-bold" style="letter-spacing: 0.05em;">
                        <i class="bi bi-person-bounding-box me-1"></i>Body Region
                    </small>
                </div>
                <div class="card-body p-2">
                    <app-body-map (regionSelected)="onBodyRegionSelected($event)" />
                </div>
            </div>
        </div>

        <!-- Filters Column -->
        <div class="col-12 col-lg-9">
            <div class="card filter-card h-100">
                <div class="card-header py-2">
                    <small class="text-muted text-uppercase fw-bold" style="letter-spacing: 0.05em;">
                        <i class="bi bi-funnel me-1"></i>Filters
                    </small>
                </div>
                <div class="card-body">
                    <!-- Primary Text Filters -->
                    <div class="row g-3 mb-3">
                        <div class="col-md-3">
                            <label class="form-label text-muted small">Diagnostic Code</label>
                            <input type="text" class="form-control" placeholder="e.g. 5260"
                                [(ngModel)]="searchCode" (input)="applyFilter()" autocomplete="off">
                        </div>
                        <div class="col-md-9">
                            <label class="form-label text-muted small">Body Part or Condition</label>
                            <input type="text" class="form-control"
                                placeholder="e.g. Ankle, Shoulder, Sinusitis..."
                                [(ngModel)]="searchCondition" (input)="applyFilter()" autocomplete="off">
                        </div>
                    </div>

                    <!-- System / Subsystem Dropdowns -->
                    <div class="row g-3">
                        <div class="col-md-5">
                            <select class="form-select" [(ngModel)]="selectedSystem" (change)="onSystemChange()">
                                <option value="">Filter by System (Optional)</option>
                                @for (group of systemGroupings; track group.name) {
                                    <option [value]="group.name">{{ group.name }}</option>
                                }
                            </select>
                        </div>
                        <div class="col-md-5">
                            <select class="form-select" [(ngModel)]="selectedSubSystem" (change)="applyFilter()"
                                [disabled]="!selectedSystem || availableSubSystems.length === 0">
                                <option value="">Filter by Sub-Group (Optional)</option>
                                @for (sub of availableSubSystems; track sub) {
                                    <option [value]="sub">{{ sub }}</option>
                                }
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-warning w-100" (click)="clearFilters()">
                                Clear All
                            </button>
                        </div>
                    </div>

                    <!-- Active Body Region Badge (shown when body map filter is active) -->
                    @if (selectedBodyRegion) {
                        <div class="mt-3">
                            <span class="badge bg-warning text-dark py-2 px-3">
                                <i class="bi bi-geo-alt-fill me-1"></i>
                                Body filter: {{ selectedBodyRegion.label }}
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>

    <!-- Results Table -->
    <app-results-table
        [ratings]="filteredRatings"
        (rowClicked)="openModal($event)" />

    <!-- Criteria Modal -->
    <app-criteria-modal
        [rating]="selectedRating"
        id="criteriaModal" />

    <!-- Bootstrap modal trigger (opened programmatically on row click) -->
    <button id="modalTriggerBtn" data-bs-toggle="modal" data-bs-target="#criteriaModal"
        style="display:none" aria-hidden="true"></button>

</div>
```

**Note:** The modal needs to be triggered programmatically when `selectedRating` is set. Add a `ViewChild` trigger in the component to click the hidden button after `selectedRating` is set. Update `openModal()` in `dashboard.component.ts`:

```typescript
import { Component, Inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

// Add inside the class:
@ViewChild('modalTriggerBtn') modalTriggerBtn!: ElementRef;

openModal(rating: DiagnosticCode): void {
    this.selectedRating = rating;
    setTimeout(() => {
        this.modalTriggerBtn?.nativeElement?.click();
    }, 0);
}
```

And update the template button to use `#modalTriggerBtn`:
```html
<button #modalTriggerBtn data-bs-toggle="modal" data-bs-target="#criteriaModal"
    style="display:none" aria-hidden="true"></button>
```

Also add the new component imports to `dashboard.component.ts`:
```typescript
import { BodyMapComponent } from '../body-map/body-map.component';
import { ResultsTableComponent } from '../results-table/results-table.component';
import { CriteriaModalComponent } from '../criteria-modal/criteria-modal.component';

// In @Component decorator:
imports: [CommonModule, FormsModule, BodyMapComponent, ResultsTableComponent, CriteriaModalComponent],
```

**Step 2: Update dashboard SCSS**

Replace `src/app/components/dashboard/dashboard.component.scss` to remove now-unused card styles and keep filter/table styles:
```scss
.filter-card {
    border: none;
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075);

    .form-control,
    .form-select {
        background-color: var(--card-bg);
        color: var(--body-color);
        border-color: var(--card-border);

        &::placeholder {
            color: var(--bs-gray-500);
        }
    }
}
```

**Step 3: Verify in browser**

```bash
npx ng serve
```
Navigate to `http://localhost:4200`. Verify:
- Body map appears on the left
- Filters are on the right
- Clicking a body region shows the badge and filters the results table
- Clicking a table row opens the criteria modal
- Clear All resets all filters including the body region badge

**Step 4: Run all tests**

```bash
ng test
```
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/app/components/dashboard/
git commit -m "feat: update dashboard layout with body map, results table, and criteria modal"
```

---

## Task 9: Final Verification and Polish

**Step 1: Run full test suite**

```bash
ng test --reporter=verbose
```
Expected: All tests pass with 0 failures.

**Step 2: Build production bundle**

```bash
npx ng build
```
Expected: Build succeeds with no errors. Output in `dist/`.

**Step 3: Manual smoke test checklist**

Verify each of the following in the browser at `http://localhost:4200`:

- [ ] Header shows "Operation: Ouchie! 2.0"
- [ ] Theme switcher works (Night Ops, Oorah!, Jungle Standard)
- [ ] Exterior body map loads with visible regions
- [ ] Hovering a body region highlights it
- [ ] Clicking a body region selects it (yellow highlight + badge appears)
- [ ] Badge appears in both the body map and the filter bar
- [ ] Results table filters to that region's subsystems
- [ ] Clicking the same region again deselects it
- [ ] Switching from Exterior to Interior clears the body region selection
- [ ] Interior organ map loads and regions are clickable
- [ ] Clicking Abdomen area on exterior switches to interior view
- [ ] Text search filters combine with body region filter
- [ ] Clear All resets all filters
- [ ] Clicking a table row opens the criteria modal
- [ ] Modal shows correct code, condition, criteria table, notes, and 38 CFR link
- [ ] 38 CFR link opens in new tab
- [ ] Modal Close button works
- [ ] No console errors

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: operation-ouchie-2 complete — body map, results table, criteria modal"
```
