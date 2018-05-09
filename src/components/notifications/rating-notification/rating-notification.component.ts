import { Component, OnInit, Input } from "@angular/core";
import { MessagesService } from "../../../services/messages.service";

@Component({
  selector: "rating-notification",
  templateUrl: "./rating-notification.component.html",
  styleUrls: ["./rating-notification.component.scss"]
})
export class RatingNotificationComponent implements OnInit {
  @Input() notification;
  speed = 0;
  quality = 0;
  attention = 0;
  disableButton = false;

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {}

  rate() {
    const params = {
      idRating: 1,
      rapidezProceso: this.speed,
      calidadProducto: this.quality,
      amabilidadAtencion: this.attention
    };
    this.messagesService.rateSeller(params, 1).subscribe(response => {
      this.disableButton = true;
    });
  }
}
