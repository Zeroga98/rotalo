import { Component, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalFeedBackService } from './modal-feedBack.service';

@Component({
  selector: 'modal-feedBack',
  templateUrl: './modal-feedBack.component.html',
  styleUrls: ['./modal-feedBack.component.scss']
})
export class ModalFeedBackComponent implements OnInit, OnDestroy {
  @Input() id: string;

  private element: any;

  constructor(private modalService: ModalFeedBackService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;

    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    document.body.appendChild(this.element);


    this.element.addEventListener('click', function(e: any) {
      if (e.target.className === 'modal') {
        modal.close();
      }
    });


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
