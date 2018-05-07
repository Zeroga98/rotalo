import { CountryInterface } from "./../select-country/country.interface";
import { ChangeDetectorRef } from "@angular/core";
import { NotificationsService } from "./../../services/notifications.service";
import { Router } from "@angular/router";
import { ROUTES } from "./../../router/routes";
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { MessagesService } from "../../services/messages.service";
import { NavigationService } from "../../pages/products/navigation.service";
import { CurrentSessionService } from "../../services/current-session.service";
@Component({
  selector: "navigation-top",
  templateUrl: "./navigation-top.component.html",
  styleUrls: ["./navigation-top.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationTopComponent implements OnInit, OnDestroy {
  @Output() countryChanged: EventEmitter<any> = new EventEmitter();
  @Input() hideBackArrow: boolean = false;
  @Input() defaultCountryValue: CountryInterface;
  readonly rotaloCenter: string = `/${ROUTES.ROTALOCENTER}`;
  uploadProductPage = ROUTES.PRODUCTS.UPLOAD;
  isModalMessageShowed: boolean = false;
  listenerNotifications: any;
  listenerMessages: any;
  messagesUnRead: number = 0;
  notificationsUnread: number = 0;
  userId;
  private readonly timeToCheckNotification: number = 5000;
  constructor(
    private router: Router,
    private messagesService: MessagesService,
    private changeDetector: ChangeDetectorRef,
    private navigationService: NavigationService,
    private notificationsService: NotificationsService,
    private currentSessionService: CurrentSessionService
  ) {}
  ngOnInit() {
    this.defaultCountryValue = {
      id: this.navigationService.getCurrentCountryId()
    };
    this.userId = this.currentSessionService.getIdUser();
  //  this.listenerMessages = this.setListenerMessagesUnread(this.userId);
    //this.listenerMessages = this.setListenerMessagesUnread(this.userId);
  }
  ngOnDestroy(): void {
    clearInterval(this.listenerMessages);
    clearInterval(this.listenerNotifications);
  }
  changeSelectorCounrty(evt) {
    this.countryChanged.emit(evt);
    this.navigationService.setCurrentCountryId(evt.id);
    this.goToFeed(evt.id);
  }
  goToHome() {
    const url = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
    `/${url}` === this.router.url
      ? location.reload()
      : this.router.navigate([url]);
  }

  get messageAvailable(): boolean {
    return this.messagesUnRead > 0;
  }

  private  setListenerMessagesUnread(userId) {
    return setInterval(() => {
      this.messagesService.getMessagesUnred(userId).subscribe(
        state => {
          this.messagesUnRead = state.body.cantidadNotificaciones;
          this.changeDetector.markForCheck();
        },
        error => console.log(error)
      );
    }, this.timeToCheckNotification);
  }

  private goToFeed(id: number) {
    const currentUrl = window.location.pathname;
    const feedUrl = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
    if (currentUrl !== feedUrl) {
      this.router.navigate([`${feedUrl}`]);
    }
  }
}
