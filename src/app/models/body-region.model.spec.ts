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
