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
