import { EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { ModalInterface } from '../../commons/interfaces/modal.interface';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';

@Component({
  selector: "sufi-modal",
  templateUrl: "./sufi-te-presta-modal.component.html",
  styleUrls: ["./sufi-te-presta-modal.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SufiTePrestaModalComponent implements OnInit {
  @Input() config: ModalInterface;
  @Output() close: EventEmitter<any> = new EventEmitter();
  title: string = "Créditos Sufi";

  @HostListener('document:click', ['$event']) clickout(event) {
    if (event.target && event.target.className) {
      if (event.target.className == 'opacity') {
        this.closeModal();
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  closeModal() {
    this.close.emit();
  }

  acceptModalSufi() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
  }
}
