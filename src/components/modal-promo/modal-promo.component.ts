import { Component, OnInit, HostListener, ElementRef, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalPromoProductService } from './modal-promoProduct.service';
import { ProductsService } from '../../services/products.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

@Component({
  selector: 'modal-promo',
  templateUrl: './modal-promo.component.html',
  styleUrls: ['./modal-promo.component.scss']
})
export class ModalPromoComponent implements OnInit , OnDestroy{
  @Input() id: string;
  private element: any;
  public isWinner;
  public winnerText = '';
  public loserText = '';
  public losePhoto = '../../assets/img/december_promo/ic_reno_perdiste.png';
  public winPhoto = '../../assets/img/december_promo/ic_reno_ganaste.png';

  @HostListener('document:click', ['$event']) clickout(event) {
    if (event.target && event.target.className) {
      if (event.target.className == 'md-overlay-promo') {
        this.close();
      }
    }
  }

  constructor(private modalService: ModalPromoProductService,
    private el: ElementRef,
    private changeRef: ChangeDetectorRef,
    private currentSessionSevice: CurrentSessionService,
    private router: Router) {
      this.element = el.nativeElement;
    }

  ngOnInit() {
    const modal = this;
    const currentUser = this.currentSessionSevice.currentUser();
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    this.close();
    this.modalService.remove(this.id);
    this.element = undefined;
  }

  open(isWinner, params): void {
    this.isWinner = isWinner;
    if (params && params.campana) {
      this.winnerText = params.campana.winnerText;
      this.loserText = params.campana.loserText;
      this.losePhoto = params.campana.losePhoto.url;
      this.winPhoto = params.campana.winPhoto.url;
    }

    this.element.classList.add('md-show');
    document.body.classList.add('modal-open-promo');
    this.changeRef.markForCheck();
  }

  close(): void {
    this.element.classList.remove('md-show');
    document.body.classList.remove('modal-open-promo');
  }

  goToTerms() {
    this.close();
    this.router.navigate([
      `/${ROUTES.TERMS}`
    ]);
  }

}
