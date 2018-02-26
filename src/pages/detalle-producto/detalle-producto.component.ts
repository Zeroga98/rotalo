import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "detalle-producto",
  templateUrl: "./detalle-producto.component.html",
  styleUrls: ["./detalle-producto.component.scss"]
})
export class DetalleProductoComponent implements OnInit {
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));

  constructor(private router: Router) {}

  ngOnInit() {}
}
