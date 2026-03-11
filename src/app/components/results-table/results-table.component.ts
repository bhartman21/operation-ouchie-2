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

    onRowClick(rating: DiagnosticCode): void { this.rowClicked.emit(rating); }

    getFragmentLink(link: string, code: string): string {
        return `${link}#:~:text=${code}`;
    }
}
