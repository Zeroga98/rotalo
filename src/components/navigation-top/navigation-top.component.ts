import { CountryInterface } from './../select-country/country.interface';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationsService } from './../../services/notifications.service';
import { Router } from '@angular/router';
import { ROUTES } from './../../router/routes';
import { Component, OnInit, EventEmitter, Output, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { MessagesService } from '../../services/messages.service';

@Component({
	selector: 'navigation-top',
	templateUrl: './navigation-top.component.html',
	styleUrls: ['./navigation-top.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationTopComponent implements OnInit, OnDestroy {
	@Output() countryChanged: EventEmitter<any> = new EventEmitter();
	@Input() hideBackArrow: boolean = false;
	@Input() defaultCountryValue: CountryInterface;
	readonly notificationsRoute: string = `/${ROUTES.NOTIFICATIONS}`;
	uploadProductPage = ROUTES.PRODUCTS.UPLOAD;
	isModalMessageShowed: boolean = false;
	listenerNotifications: any;
	listenerMessages: any;
	messagesUnRead: number = 0;
	notificationsUnread: number = 0;
	private readonly timeToCheckNotification: number = 5000;


	constructor(
		private router: Router,
		private messagesService: MessagesService,
		private changeDetector: ChangeDetectorRef,
		private notificationsService: NotificationsService) { }

	ngOnInit() {
		this.listenerMessages = this.setListenerMessagesUnread();
		this.listenerMessages = this.setListenerNotificationsUnread();
	}
	ngOnDestroy(): void {
		console.log("destroy");
		clearInterval(this.listenerMessages);
		clearInterval(this.listenerNotifications);
	}

	changeSelectorCounrty(evt) {
		this.countryChanged.emit(evt);
	}

	goToHome() {
		const url = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
		this.router.navigate([url]);
	}

	openConversations(){
		this.isModalMessageShowed = true;
	}

	closeModalMessage(){
		this.isModalMessageShowed = false;
	}

	get messageAvailable(): boolean{
		return this.messagesUnRead > 0;
	}

	get notificationsAvailable(): boolean{
		return this.notificationsUnread > 0;
	}

	private setListenerMessagesUnread(){
		return setInterval(() => {
			this.messagesService.getConversationsUnread()
								.then( conversations => {
									this.messagesUnRead = 0;
									conversations.forEach(conversation => {
										this.messagesUnRead += conversation['unread-count']
									});
									this.changeDetector.markForCheck();
									console.log("messagesunread", this.messagesUnRead);
								});
		}, this.timeToCheckNotification);
	}

	private setListenerNotificationsUnread(){
		return setInterval(() => {
			this.notificationsService.getUnreadNotifications()
									.then((notifications:any)=>{
										this.notificationsUnread = notifications['unread-notifications'];
										this.changeDetector.markForCheck();
										console.log("notifications unread: ", this.notificationsUnread)
									})
		}, this.timeToCheckNotification)
	}

}
