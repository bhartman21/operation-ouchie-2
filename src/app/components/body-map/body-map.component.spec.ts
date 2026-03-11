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
