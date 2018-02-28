import { Component, OnInit } from "@angular/core";
import { NotificationsService } from "../../services/notifications.service";

@Component({
    selector: 'notifications-page',
    templateUrl: 'notifications.page.html',
    styleUrls: ['notifications.page.scss']
})

export class NotificationsPage implements OnInit {

    public notificationsList: Array<string> = [];

    public paymentTypes = {
        'cash': 'Efectivo',
        'bank_account_transfer': 'Transferencia bancaria',
        'qr_code_transfer': 'Código QR',
        'sufi_credit': 'Crédito SUFI',
        'na': 'No aplica'
    }

    constructor(private notificationsService: NotificationsService) { }

    ngOnInit() {
        this.notificationsService.getNotifications().then(response => {
            this.notificationsList = [].concat(response);
            console.log(this.notificationsList)
        });

        this.setStatus();
    }

    private setStatus(){
        console.log('set Status');
    }
}