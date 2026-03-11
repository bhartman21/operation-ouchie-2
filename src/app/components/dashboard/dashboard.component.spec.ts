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
