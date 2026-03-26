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

    // Zoom and Pan state
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    isPanning = false;
    private panStartX = 0;
    private panStartY = 0;

    readonly exteriorRegions = BODY_REGIONS.filter(r => r.view === 'exterior');
    readonly interiorRegions = BODY_REGIONS.filter(r => r.view === 'interior');

    get currentRegions(): BodyRegion[] {
        return this.activeView === 'exterior' ? this.exteriorRegions : this.interiorRegions;
    }

    getRegionById(id: string): BodyRegion | undefined {
        return BODY_REGIONS.find(r => r.id === id);
    }

    setView(view: 'exterior' | 'interior'): void {
        this.activeView = view;
        this.selectedRegion = null;
        this.regionSelected.emit(null);
        this.resetZoom();
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

    // Zoom controls
    zoomIn(): void {
        this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3);
    }

    zoomOut(): void {
        this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.75);
        if (this.zoomLevel === 0.75) this.resetPan();
    }

    resetZoom(): void {
        this.zoomLevel = 1;
        this.resetPan();
    }

    private resetPan(): void {
        this.translateX = 0;
        this.translateY = 0;
    }

    // Panning logic
    startPan(event: MouseEvent | TouchEvent): void {
        if (this.zoomLevel <= 1) return;
        this.isPanning = true;
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        this.panStartX = clientX - this.translateX;
        this.panStartY = clientY - this.translateY;
        event.preventDefault();
    }

    doPan(event: MouseEvent | TouchEvent): void {
        if (!this.isPanning) return;
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        this.translateX = clientX - this.panStartX;
        this.translateY = clientY - this.panStartY;
    }

    endPan(): void {
        this.isPanning = false;
    }
}
