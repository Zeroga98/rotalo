import { ChangeDetectionStrategy } from '@angular/core';
import { Component, Renderer2, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'terms-modal',
    templateUrl: 'terms-modal.page.html',
    styleUrls: ['terms-modal.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsModalComponent {
    @Output() close: EventEmitter<any> = new EventEmitter();
    @Output() accept: EventEmitter<any> = new EventEmitter();

    constructor(private render: Renderer2) { }

    closeModal() {
        this.close.emit();
    }

    acceptTerms() {
        this.accept.emit();
    }
}
