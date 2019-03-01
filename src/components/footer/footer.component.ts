import { Router } from '@angular/router';
import { ROUTES } from './../../router/routes';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ModalFeedBackService } from '../modal-feedBack/modal-feedBack.service';

@Component({
  selector: 'custom-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  public readonly termsLink: string = `/${ROUTES.TERMS}`;
  public readonly faqLink: string = `/${ROUTES.FAQ}`;
  private readonly _homeRoute: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;

  constructor(private _router:Router,
    private modalService: ModalFeedBackService) { }

  ngOnInit() {

  }

  goToHome(){
    this._router.navigate([this._homeRoute]);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

}
