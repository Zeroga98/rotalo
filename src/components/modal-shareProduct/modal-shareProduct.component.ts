import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { ModalShareProductService } from './modal-shareProduct.service';

@Component({
  selector: 'modal-shareProduct',
  templateUrl: './modal-shareProduct.component.html',
  styleUrls: ['./modal-shareProduct.component.scss']
})
export class ModalShareProductComponent implements OnInit, OnDestroy {
  @Input() id: string;

  private element: any;
  constructor(private modalService: ModalShareProductService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;

    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    document.body.appendChild(this.element);
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }


  open(): void {
    // this.element.style.display = 'block';

     this.element.classList.add('md-show');
     document.body.classList.add('modal-open');
   }

   close(): void {
    //this.element.style.display = 'none';
     this.element.classList.remove('md-show');
     document.body.classList.remove('modal-open');
   }

}
