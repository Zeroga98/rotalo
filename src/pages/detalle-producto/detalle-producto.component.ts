import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: "detalle-producto",
  templateUrl: "./detalle-producto.component.html",
  styleUrls: ["./detalle-producto.component.scss"]
})
export class DetalleProductoComponent implements OnInit {
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  isDetailReadOnly: boolean = false;
  isSpinnerShow = true;
  isFooterShow = false;
  constructor(private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private activedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activedRoute.params.subscribe(params => {
      this.isDetailReadOnly = params.readOnly || false;
    });
    this.isSpinnerShow = false;
  }

  onNotify(product): void {
    this.showFooter(product);
  }

  /**Se muestra el footer en el caso que ya cargo el producto*/
  showFooter(product) {
    if (product) {
      this.isFooterShow = true;
    }else {
      this.isFooterShow = false;
    }
  }


}
