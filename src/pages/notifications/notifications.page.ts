import { NotificationsInterface } from './../../commons/interfaces/notifications.interface';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { NotificationsService } from "../../services/notifications.service";

@Component({
    selector: 'notifications-page',
    templateUrl: 'notifications.page.html',
    styleUrls: ['notifications.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NotificationsPage implements OnInit {

    public notificationsList: Array<NotificationsInterface> = [];
    public configModalRate = {};
    public paymentTypes = {
        'cash': 'Efectivo',
        'bank_account_transfer': 'Transferencia bancaria',
        'qr_code_transfer': 'Código QR',
        'sufi_credit': 'Crédito SUFI',
        'na': 'No aplica'
    }

    idProductMessage: string;
    idUserProductMessage: string;
    private _isModalRateShow: boolean = false;
    showSendMessage: boolean = false;
    idConversation;

    constructor(
        private notificationsService: NotificationsService,
        private changeDetectorRef: ChangeDetectorRef) { }

    async ngOnInit() {
        try {
            this.notificationsList = await this.notificationsService.getNotifications();
            console.log(this.notificationsList);
            this.changeDetectorRef.markForCheck();
        } catch (error) {
            
        }
    }
    
    openConversation(idProduct: string, idUserProduct) {
        this.idConversation = idProduct + '-' + idUserProduct;
        this.showSendMessage = true;

    }

    closeModalRate(){
        this._isModalRateShow = false;
    }

    showModalRate(value: boolean, notification){
        console.log(notification);
        this.configModalRate = {
            name: notification.product.user.name,
            'purchase-id': notification.purchase.id
        }
        this._isModalRateShow = true;
    }

    get isModalRateShow(){
        return this._isModalRateShow;
    }
}