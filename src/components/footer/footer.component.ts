import { Router } from '@angular/router';
import { ROUTES } from './../../router/routes';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalFeedBackService } from '../modal-feedBack/modal-feedBack.service';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: 'custom-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public readonly termsLink: string = `/${ROUTES.TERMS}`;
  public readonly termsLinkShop: string = `/${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.TERMS}`;
  public readonly termsCompaniesLink: string = `/${ROUTES.TERMSCOMPANIES}`;
  public readonly faqLink: string = `/${ROUTES.FAQ}`;
  public readonly faqLinkShop: string  = `/${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.FAQ}`;
  private readonly _homeRoute: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
  public successModal  = false;
  private currentUrl = '';
  constructor(private _router: Router,
    private currentSessionService: CurrentSessionService,
    private modalService: ModalFeedBackService) { }

  ngOnInit() {
    this.currentUrl = window.location.href;
  }

  goToHome() {
    this._router.navigate([this._homeRoute]);
  }

  get isGuatemala() {
    if (this.currentUrl.includes('gt')) {
      return true;
    }
    return false;
  }

  get isShop() {
    if (this.currentUrl.includes('shop')) {
      return true;
    }
    return false;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }


  public checkSession() {
    return this.currentSessionService.currentUser();
  }


}
