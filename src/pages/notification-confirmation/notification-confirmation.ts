import { Router } from "@angular/router";
import {
    Component,
    OnInit
} from "@angular/core";
import { MessagesService } from "../../services/messages.service";

@Component({
    selector: "notification-confirmation",
    templateUrl: "notification-confirmation.page.html",
    styleUrls: ["notification-confirmation.page.scss"]
})

export class NotificationConfirmation implements OnInit {
    
    private userId: number = parseInt(this.router.url.replace(/[^\d]/g, ''));

    constructor(private router: Router, private messagesService: MessagesService
    ){
    }

    ngOnInit() {
        this.sendUserId();
    }

    sendUserId(){
        const jsonContent = {
            "idUsuario": this.userId,
            "tipoCorreo": "notificaciones_pendientes",
            "pararEnvioCorreo": true
        }
        this.messagesService.notificationConfirmation(jsonContent).subscribe(
            (response) => {},
            (error) => console.log(error)
        );
    }

}
