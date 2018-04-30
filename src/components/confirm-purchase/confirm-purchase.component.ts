import { Component, OnInit, ChangeDetectorRef } from "@angular/core";


@Component({
  selector: "confirm-purchase",
  templateUrl: "./confirm-purchase.component.html",
  styleUrls: ["./confirm-purchase.component.scss"]
})
export class ConfirmPurchaseComponent implements OnInit {
  textInfoPurchase = [
    "Tu pago está en proceso",
    "¡No te vayas!",
    "Psss, revisa tu celular",
    "Estamos verificando el estado de tu transacción"
  ];
  titleWait: String = "Tu pago está en proceso";
  private i = 0;
  constructor(private changeDetectorRef:ChangeDetectorRef) {}

  ngOnInit() {
    setInterval(() => this.changTitle(), 4500);
  }

  changTitle() {
    this.titleWait = this.textInfoPurchase[this.i];
    this.i++;
    if (this.i >= this.textInfoPurchase.length) {
      this.i = 0;
    }
    this.changeDetectorRef.markForCheck();
  }
}
