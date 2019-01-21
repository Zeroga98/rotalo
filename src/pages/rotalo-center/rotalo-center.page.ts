import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../../router/routes';
import { ResumeRotaloCenterService } from '../../services/resume-rotalo-center.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { HostListener } from '@angular/core';
import { NavigationService } from '../products/navigation.service';

@Component({
  selector: 'rotalo-center',
  templateUrl: './rotalo-center.page.html',
  styleUrls: ['./rotalo-center.page.scss']
})
export class RotaloCenterPage implements OnInit  {
  public notificationsSettings = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.NOTIFICATIONSSETTINGS}`;
  public adminOrders = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINORDERS}`;
  public adminRegister  = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINREGISTER}`;
  public featuredProduct = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.FEATUREDPRODUCT}`;
  public selling = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`;
  public sold = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SOLD}`;
  public messages = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.MESSAGES}`;
  public infoRotalo = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.INFOROTALOCENTER}`;
  public screenHeight;
  public screenWidth;
  public showMenu: boolean = true;
  public messagesUnRead: number = 0;


  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    const currentPage = this.router.url;
    this.validateMobileMenu();
  }


  constructor(public router: Router,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private currentSessionSevice: CurrentSessionService
    ) {
    this.onResize();
    this.router.events.subscribe((val) => {
      this.validateMobileMenu();
    });
  }

  validateMobileMenu() {
    const currentPage = this.router.url;
    if (this.screenWidth <= 700) {
      if (currentPage === `/${ROUTES.ROTALOCENTER}`) {
        this.showMenu = true;
      }else {
        this.showMenu = false;
      }
    }else {
      this.showMenu = true;
    }
  }

  ngOnInit() {
  }

  get messageAvailable(): boolean {
    this.messagesUnRead = this.navigationService.getMessagesUnRead();
    return this.messagesUnRead > 0;
  }

  get getMessagesUnRead(){
    this.messagesUnRead = this.navigationService.getMessagesUnRead();
    return this.messagesUnRead;
  }

  get isHideBackArrow() {
    return (
      this.router.url === `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
    );
  }

  isSuperUser() {
    if (this.currentSessionSevice.currentUser()['rol'] && this.currentSessionSevice.currentUser()['rol'] === 'superuser') {
      return true;
    }
    return false;
  }

}
