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
