import { Component, OnInit } from "@angular/core";

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
  constructor() {}

  ngOnInit() {
  }

}
