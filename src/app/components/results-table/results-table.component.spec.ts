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

    it('should create', () => { expect(component).toBeTruthy(); });

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

    it('should show no-results message when ratings is empty', async () => {
        fixture.componentRef.setInput('ratings', []);
        fixture.detectChanges();
        await fixture.whenStable();
        const noResults = fixture.nativeElement.querySelector('.no-results');
        expect(noResults).toBeTruthy();
    });
});
