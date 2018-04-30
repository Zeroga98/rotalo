import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "detalle-producto",
  templateUrl: "./detalle-producto.component.html",
  styleUrls: ["./detalle-producto.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleProductoComponent implements OnInit {
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  isDetailReadOnly: boolean = false;
  isSpinnerShow = true;
  constructor(private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private activedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activedRoute.params.subscribe(params => {
      this.isDetailReadOnly = params.readOnly || false;
    });
    this.isSpinnerShow = false;
  }
}
