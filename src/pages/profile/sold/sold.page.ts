import { ROUTES } from "./../../../router/routes";
import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { ProductsService } from "../../../services/products.service";
import { ProductInterface } from "../../../commons/interfaces/product.interface";
import { DomSanitizer } from "@angular/platform-browser";
import { MASONRY_CONFIG } from "../selling/masonry.config";
import { CurrentSessionService } from "../../../services/current-session.service";

@Component({
  selector: "sold",
  templateUrl: "./sold.page.html",
  styleUrls: ["./sold.page.scss"]
})
export class SoldPage implements OnInit {
  public notificationsUrl: string = `/${ROUTES.ROTALOCENTER}`;
  public isSpinnerShow = true;
  public currentTab: String;
  public productsSold: Array<ProductInterface> = [];
  public productsPurchased: Array<ProductInterface> = [];
  private currentFilterSold: any = {
    "filter[staged]": "sold",
    "page[number]": "1",
    "page[size]": "100"
  };
  private currentFilterPurchased: any = {
    "filter[staged]": "purchased",
    "page[number]": "1",
    "page[size]": "100"
  };
  public masonryConfig = MASONRY_CONFIG;
  private userId;
  public showEmptySold = false;
  public showEmptyPurchase = false;
  constructor(
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private productsService: ProductsService,
    private currentSessionService: CurrentSessionService
  ) {
    this.userId = this.currentSessionService.getIdUser();
    this.getInfoAdditional(this.userId);
  }

  ngOnInit() {
    this.currentTab = "sold";
  }

  async loadProductsSold(solProduct) {
    this.productsService.getProducts(this.currentFilterSold).then(products => {
      this.productsSold = [].concat(products);
      const arraySolds = this.productsSold;
      let newArray = [];
      for (let i = 0; i < arraySolds.length; i++) {
        const settingObject = solProduct.find(function(sold) {
          return sold.idProducto == arraySolds[i].id;
        }, arraySolds[i]);
        if (settingObject) {
          this.productsSold[i]["received-at"] = settingObject.fechaVenta;
          if (settingObject.comprador) {
            this.productsSold[i] = Object.assign(
              this.productsSold[i],
              { calificacionGeneral: settingObject.calificacionGeneral },
              { comprador: settingObject.comprador.nombre }
            );
          } else {
            this.productsSold[i] = Object.assign(
              this.productsSold[i],
              { calificacionGeneral: settingObject.calificacionGeneral },
              { comprador: null }
            );
          }
          newArray.push(this.productsSold[i]);
        }
      }
      this.productsSold = newArray;
      this.thereIsSold(this.productsSold);
      this.isSpinnerShow = false;
    });
  }

  async loadProductSold() {
    this.productsService.getProducts(this.currentFilterSold).then(products => {
      this.productsSold = [].concat(products);
      this.thereIsSold(this.productsSold);
      this.isSpinnerShow = false;
    });
  }

  async loadProductPurchased() {
    this.productsService
      .getProducts(this.currentFilterPurchased)
      .then(products => {
        this.productsPurchased = [].concat(products);
        this.thereIsPurchased(this.productsPurchased);
        this.isSpinnerShow = false;
      });
  }

  async loadProductsPurchased(purchasedProduct) {
    this.productsService
      .getProducts(this.currentFilterPurchased)
      .then(products => {
        this.productsPurchased = [].concat(products);
        const arrayPurchased = this.productsPurchased;
        let newArray = [];
        for (let i = 0; i < arrayPurchased.length; i++) {
          const settingObject = purchasedProduct.find(function(purchased) {
            return purchased.idProducto == arrayPurchased[i].id;
          }, arrayPurchased[i]);
          if (settingObject) {
            this.productsPurchased[i]["received-at"] =
              settingObject.fechaCompra;
            newArray.push(this.productsPurchased[i]);
          }
        }
        this.productsPurchased = newArray;
        this.thereIsPurchased(this.productsPurchased);
        this.isSpinnerShow = false;
      });
  }

  thereIsSold(product) {
    if (product) {
      if (product.length <= 0) {
        this.showEmptySold = true;
      } else {
        this.showEmptySold = false;
      }
    }
  }

  thereIsPurchased(product) {
    if (product) {
      if (product.length <= 0) {
        this.showEmptyPurchase = true;
      } else {
        this.showEmptyPurchase = false;
      }
    }
  }

  sanitizePhoto(photo: String): any {
    let trustPhoto;
    trustPhoto = this.sanitizer.bypassSecurityTrustStyle("url(" + photo + ")");
    return trustPhoto;
  }

  getInfoAdditional(idUsuario) {
    this.productsService.getInfoAdditional(idUsuario).subscribe(
      state => {
        if (state.status === "0") {
          this.loadProductsSold(state.body.articulosVendidos);
          this.loadProductsPurchased(state.body.articulosComprados);
        } else {
          this.loadProductSold();
          this.loadProductPurchased();
        }
      },
      error => console.log(error)
    );
  }

  updateInfo() {
    this.getInfoAdditional(this.userId);
  }
}
