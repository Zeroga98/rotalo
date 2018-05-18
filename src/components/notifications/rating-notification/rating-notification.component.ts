import { Component, OnInit, Input } from "@angular/core";
import { MessagesService } from "../../../services/messages.service";
import { CurrentSessionService } from "../../../services/current-session.service";
import { FormGroup, Validators, FormControl, AbstractControl, FormBuilder } from "@angular/forms";

function validateRating(c: AbstractControl): {[key: string]: boolean} | null {
  const speed = c.get('speed').value;
  const quality = c.get('quality').value;
  const attention = c.get('attention').value;

  if (speed > 0 && quality > 0 && attention > 0) {
      return null;
  }
  return { 'rate': true };
}

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
  hideButton = false;
  rateSeller;

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private currentSessionService: CurrentSessionService
  ) {}

  ngOnInit() {
    this.rateSeller =  this.fb.group({
      speed: [this.notification.calificacion.rapidezProceso, [Validators.required]],
      quality: [this.notification.calificacion.calidadProducto, [Validators.required]],
      attention: [this.notification.calificacion.amabilidadAtencion, [Validators.required]]
      }, {validator: validateRating});
    this.speed = this.notification.calificacion.rapidezProceso;
    this.quality = this.notification.calificacion.calidadProducto;
    this.attention = this.notification.calificacion.amabilidadAtencion;
    if (this.speed > 0 && this.quality > 0 && this.attention > 0) {
      this.hideButton = true;
    }
  }

  rate() {
    if (this.rateSeller.get('speed').value > 0 &&
    this.rateSeller.get('quality').value > 0 &&
    this.rateSeller.get('attention').value > 0) {
      const params = {
        idRating: this.notification.calificacion.idRating,
        rapidezProceso: this.rateSeller.get('speed').value,
        calidadProducto: this.rateSeller.get('quality').value,
        amabilidadAtencion: this.rateSeller.get('attention').value
      };
      this.messagesService
        .rateSeller(params, this.currentSessionService.getIdUser())
        .subscribe(response => {
          this.disableButton = true;
          this.hideButton = true;
        });
    }
  }
}
