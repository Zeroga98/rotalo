import { Router } from '@angular/router';
import { NotificationsInterface } from './../../commons/interfaces/notifications.interface';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { NotificationsService } from "../../services/notifications.service";
import { ConversationInterface } from '../../commons/interfaces/conversation.interface';
import { ROUTES } from '../../router/routes';

@Component({
    selector: 'notifications-page',
    templateUrl: 'notifications.page.html',
    styleUrls: ['notifications.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NotificationsPage implements OnInit {

    public notificationsList: Array<NotificationsInterface> = [];
	public conversation: ConversationInterface;
    public configModalRate = {};
    public paymentTypes = {
        'cash': 'Efectivo',
        'bank_account_transfer': 'Transferencia bancaria',
        'qr_code_transfer': 'Código QR',
        'sufi_credit': 'Crédito SUFI',
        'na': 'No aplica'
    }
    readonly defaultImage: string = '../assets/img/product-no-image.png';
    idProductMessage: string;
    idUserProductMessage: string;
    private _isModalRateShow: boolean = false;
    showMessage: boolean = false;
    idConversation;

    constructor(
        private notificationsService: NotificationsService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router) { }

    async ngOnInit() {
        try {
            this.notificationsList = await this.notificationsService.getNotifications();
            console.log(this.notificationsList);
            this.changeDetectorRef.markForCheck();
        } catch (error) {
            
        }
    }
    
    openConversation(notification: NotificationsInterface) {
        console.log(notification); 
        if(notification.message){
            this.idConversation = `${notification.product.id}-${notification.message['author-id']}`;
        }else{
            this.idConversation = undefined;
            this.conversation = this._getDefaultConversation(notification);
        }     
        this.showMessage = true;
    }

    closeModalRate(){
        this._isModalRateShow = false;
    }

    showModalRate(notification){
        this.configModalRate = {
            name: notification.product.user.name,
            'purchase-id': notification.purchase.id,
            'seller-rate': notification.status && notification.purchase ? notification.purchase['seller-rate'].value : false,
            comment: notification.status && notification.purchase ? notification.purchase['seller-rate'].comment : undefined,
        }
        this._isModalRateShow = true;
    }

    goToDetail(id: number){
		this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/${id}`,{readOnly: true}]);
	}

    get isModalRateShow(){
        return this._isModalRateShow;
    }

    private _getDefaultConversation(notification: NotificationsInterface){
        const name = notification.purchase ? notification.purchase.user.name : notification.offer.user.name;
        const photo = this.defaultImage;
        return {name, photo}
    }
}