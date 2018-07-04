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
    
    private userIdEncrypted: string = String(decodeURIComponent(this.router.url.split("?id=", 2)[1]));

    constructor(private router: Router, 
        private messagesService: MessagesService
    ){}

    ngOnInit() {
        this.sendUserIdEncrypted();
    }

    sendUserIdEncrypted(){
        const jsonContent = {
            "idUsuario": this.userIdEncrypted,
            "tipoCorreo": "notificaciones_pendientes",
            "pararEnvioCorreo": true
        }
        this.messagesService.notificationConfirmation(jsonContent).subscribe(
            (response) => {},
            (error) => console.log(error)
        );
    }

}
