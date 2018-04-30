import { Component, OnInit } from "@angular/core";
import { ResumeRotaloCenterService } from "../../services/resume-rotalo-center.service";
import { CurrentSessionService } from "../../services/current-session.service";

@Component({
  selector: "rotalo-center",
  templateUrl: "./info-rotalo-center.component.html",
  styleUrls: ["./info-rotalo-center.component.scss"]
})
export class RotaloCenterComponent implements OnInit {
  private userId;
  public numberMessages;
  public mainRanking;
  public speedRanking;
  public qualityRanking;
  public attentionRanking;
  public productsRotando;
  public productsRotados;
  public productExpire;
  constructor(
    private resumeRotaloCenterService: ResumeRotaloCenterService,
    private currentSessionService: CurrentSessionService
  ) {}

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.loadResume(this.userId);
  }

  loadResume(userId) {
    /**valor id usuario quemado */
    this.resumeRotaloCenterService.resumeRotaloCenter("41").subscribe(
      state => {
        this.numberMessages = state.body.notificacionesPendientes;
        this.speedRanking = state.body.rapidezProceso;
        this.qualityRanking = state.body.calidadProducto;
        this.attentionRanking = state.body.amabilidadAtencion;
        this.productsRotando = state.body.articulosRotando;
        this.productsRotados = state.body.articulosRotados;
        this.productExpire = state.body.articulosVencidos;
        this.mainRanking = this.speedRanking + this.qualityRanking + this.attentionRanking;
        this.mainRanking =  this.mainRanking / 3 ;
        this.mainRanking = Math.round(this.mainRanking);

      },
      error => console.log(error)
    );
  }
}
