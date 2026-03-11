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

    it('should create', () => { expect(component).toBeTruthy(); });

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
