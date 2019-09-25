import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from './../../router/routes';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalFeedBackService } from '../modal-feedBack/modal-feedBack.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'custom-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public  termsLink: string = `/${ROUTES.TERMS}`;
  public readonly termsLinkShop: string = `/${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.TERMS}/${this.configurationService.storeIdPublic}`;
  public readonly termsCompaniesLink: string = `/${ROUTES.TERMSCOMPANIES}`;
  public  faqLink: string = `/${ROUTES.FAQ}`;
  public readonly faqLinkShop: string  = `/${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.FAQ}/${this.configurationService.storeIdPublic}`;
  private readonly _homeRoute: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
  public successModal  = false;
  private currentUrl = '';
  public params;

  public hideFaqLink = true;

  constructor(private _router: Router,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private currentSessionService: CurrentSessionService,
    private modalService: ModalFeedBackService,
    private configurationService: ConfigurationService) { }

  ngOnInit() {
    this.currentUrl = window.location.href;
    if (this.currentUrl.includes(ROUTES.SHOPSPRIVATE.LINK)) {
      this.termsLink = `/${ROUTES.TERMS}/${this.configurationService.storeIdPrivate}`;
      this.faqLink = `/${ROUTES.FAQ}/${this.configurationService.storeIdPrivate}`;
      this.hideFaqLink = true;
      this.changeDetector.markForCheck();
    }

    this.route.params.subscribe((response) => {
      if (response['id']) {
        this.termsLink = `/${ROUTES.TERMS}/${response['id']}`;
        this.faqLink = `/${ROUTES.FAQ}/${response['id']}`;
      }
    }, (error) => {
      console.log(error);
    });

  }

  get IsSuFiShop(){
    this.currentUrl = window.location.href;
    return this.currentUrl.includes(ROUTES.SHOPSPRIVATE.LINK);
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
    if (this.currentUrl.includes(ROUTES.SHOPS.LINK)) {
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
