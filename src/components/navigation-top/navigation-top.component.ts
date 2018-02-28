import { Router } from '@angular/router';
import { ROUTES } from './../../router/routes';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MessagesService } from '../../services/messages.service';

@Component({
	selector: 'navigation-top',
	templateUrl: './navigation-top.component.html',
	styleUrls: ['./navigation-top.component.scss']
})
export class NavigationTopComponent implements OnInit, OnDestroy {
	@Output() countryChanged: EventEmitter<any> = new EventEmitter();
	readonly timeToCheckNotification: number = 5000;
	uploadProductPage = ROUTES.PRODUCTS.UPLOAD;
	listenerNotifications:any;
	messagesUnRead: number = 0;

	constructor(private router: Router,private messagesService: MessagesService) { }

	ngOnInit() {
		this.listenerNotifications = this.setListenerNotifications();
		console.log(this.listenerNotifications);
	}
	ngOnDestroy(): void {
		clearInterval(this.listenerNotifications);
	}

	changeSelectorCounrty(evt) {
		this.countryChanged.emit(evt);
	}

	goToHome(){
		const url = `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`;
		this.router.navigate([url])
	}

	get messageAvailable(): boolean{
		return this.messagesUnRead > 0;
	}

	private setListenerNotifications(){
		return setInterval(() => {
			this.messagesService.getConversationsUnread()
								.then( conversations => {
									this.messagesUnRead = 0;
									conversations.forEach(conversation => {
										this.messagesUnRead += conversation['unread-count']
									});
								});
		}, this.timeToCheckNotification);
	}

}
