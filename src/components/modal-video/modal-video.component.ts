import { Component, OnInit, OnDestroy, Input, ElementRef, HostListener } from '@angular/core';
import { ModalVideoService } from './modal-video.service';

@Component({
  selector: 'modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.scss']
})

export class ModalVideoComponent implements OnInit, OnDestroy {
  @Input() id: string;
  private element: any;
  public showColombiaVideo = true;

  @HostListener('document:click', ['$event']) clickout(event) {
     if (event.target && event.target.className) {
       if (event.target.className == 'md-overlay') {
         this.close();
       }
     }
   }
  constructor(
    private modalService: ModalVideoService,
    private el: ElementRef,
  ) {
    this.checkIfIsColombiaVideo();
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.add(this);
  }


  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    // this.element.remove();
    this.element = undefined;
  }

  checkIfIsColombiaVideo() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('gt')) {
      this.showColombiaVideo = false;
    } else {
      this.showColombiaVideo = true;
    }
  }

  open(): void {
    this.element.classList.add('md-show');
    document.body.classList.add('modal-open');
   }

  close(): void {
    document.getElementsByTagName('iframe')[0].src = document.getElementsByTagName('iframe')[0].src;
    this.element.classList.remove('md-show');
    document.body.classList.remove('modal-open');
  }

}
