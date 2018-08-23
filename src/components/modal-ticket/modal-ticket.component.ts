import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';
import { ModalTicketService } from './modal-ticket.service';

@Component({
  selector: 'modal-ticket',
  templateUrl: './modal-ticket.component.html',
  styleUrls: ['./modal-ticket.component.scss']
})
export class ModalTicketComponent implements OnInit, OnDestroy {

  @Input() id: string;
  @Input() coupon;
  private currentEmail;
  private element: any;
  private productId;


  constructor(private modalService: ModalTicketService,
    private el: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSessionSevice: CurrentSessionService) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;
    const currentUser = this.currentSessionSevice.currentUser();
    if (currentUser) {
      this.currentEmail = currentUser.email;
      const emailObject = {
        'correo' : this.currentEmail
      };
    }

    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    document.body.appendChild(this.element);
    this.modalService.add(this);
  }

  ngOnDestroy() {
    this.close();
    this.modalService.remove(this.id);
    this.modalService.setProductId(undefined);
    this.element = undefined;
  }

  open(): void {
    this.productId = this.modalService.getProductId();
    this.element.classList.add('md-show');
    document.body.classList.add('modal-open-red');
  }

  close(): void {
    this.modalService.setProductId(undefined);
    this.element.classList.remove('md-show');
    document.body.classList.remove('modal-open-red');
  }


}
