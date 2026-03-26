import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DiagnosticCode, SystemGrouping } from '../../models/rating.model';
import { BodyRegion } from '../../models/body-region.model';
import { RatingDataService } from '../../services/rating-data.service';
import { BodyMapComponent } from '../body-map/body-map.component';
import { ResultsTableComponent } from '../results-table/results-table.component';
import { CriteriaModalComponent } from '../criteria-modal/criteria-modal.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, BodyMapComponent, ResultsTableComponent, CriteriaModalComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    @ViewChild('modalTriggerBtn') modalTriggerBtn!: ElementRef;

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

    // Visibility state
    showBodyMap = signal(true);
    showFilters = signal(true);

    // Performance limit
    resultsLimit = 50;

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
        setTimeout(() => {
            this.modalTriggerBtn?.nativeElement?.click();
        }, 0);
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
