import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';
import { ResumeRotaloCenterService } from '../../services/resume-rotalo-center.service';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: 'rotalo-center',
  templateUrl: './rotalo-center.page.html',
  styleUrls: ['./rotalo-center.page.scss']
})
export class RotaloCenterPage implements OnInit  {
  public notificationsSettings = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.NOTIFICATIONSSETTINGS}`;
  public selling = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`;
  public sold = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SOLD}`;
  public messages = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}`;
  public infoRotalo = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.INFOROTALOCENTER}`;

  constructor(public router: Router) {}

  ngOnInit() {
  }

  get isHideBackArrow() {
    return (
      this.router.url === `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
    );
  }

}
