import { ChangeDetectionStrategy, HostListener, ChangeDetectorRef } from '@angular/core';
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

    @HostListener('document:click', ['$event']) clickout(event) {
      if (event.target && event.target.className) {
        if (event.target.className == 'opacity') {
          this.closeModal();
        }
      }
    }

    constructor(private render: Renderer2) {
    }

    closeModal() {
        this.close.emit();
    }

    acceptTerms() {
        this.accept.emit();
    }
}
