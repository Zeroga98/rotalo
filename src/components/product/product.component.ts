import { OfferInterface } from "./../../commons/interfaces/offer.interface";
import {
  ElementRef,
  AfterViewChecked,
  AfterContentInit,
  AfterViewInit,
  Renderer2,
  ChangeDetectorRef
} from "@angular/core";
import { ProductInterface } from "./../../commons/interfaces/product.interface";
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ViewChild
} from "@angular/core";
import { ProductsService } from "../../services/products.service";
import { ROUTES } from "../../router/routes";
import { Router } from "@angular/router";
//import {  AngularMasonry } from 'angular2-masonry';
@Component({
  selector: "product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements AfterViewInit, AfterContentInit {
  @Input() product: ProductInterface;
  @Input() masonryInfo;
  @Input() showField: boolean;
  @Input() isProductSelling: boolean;
  @Input() isProductSold: boolean;
  @Input() isProductPurchased: boolean;
  @Output() selected: EventEmitter<ProductInterface> = new EventEmitter();
  @ViewChild("containerProducts", { read: ElementRef })
  containerProducts: ElementRef;
  readonly defaultImage: string = "../assets/img/product-no-image.png";
  private readonly limitSize: number = 220;
  public productStatus: boolean = false;
  public productChecked: String = "active";

  constructor(private render: Renderer2,
    private productsService: ProductsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router) {
    }

    ngAfterContentInit(){
      this.productChecked = this.product.status;
      this.productStatus = this.product.status === "active";
      this.changeDetectorRef.markForCheck();
    }

    ngAfterViewInit(): void {
      this.checkSizeCard();
    }

  triggerMasonryLayout() {
    //this.masonryInfo._msnry.reloadItems();
    console.log('********', this.masonryInfo);
    this.masonryInfo.layout();
  }
  saveCheck() {
    this.productStatus = !this.productStatus;
    this.productStatus
      ? (this.productChecked = "active")
      : (this.productChecked = "inactive");
    const params = {
      status: this.productStatus ? "active" : "inactive"
    };
    this.changeDetectorRef.markForCheck();
    this.productsService.updateProduct(this.product.id, params).then(response => {
    });
  }

  getLocation(product): string {
    const city = product.user.city;
    const state = city.state;
    return `${city.name}, ${state.name}`;
  }
  selectProduct() {
    this.selected.emit(this.product);
  }
  updateSrc(evt) {
    evt.currentTarget.src = this.defaultImage;
  }

  async deleteProduct(product: ProductInterface) {
    try {
      const result = confirm("¿Seguro quieres borrar esta publicación?");
      if (!result) {
        return;
      }
      const response = await this.productsService.deleteProduct(product.id);
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    } catch (error) {}
  }

  editProduct(product: ProductInterface) {
    this.router.navigate([
      `${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.UPLOAD}/${product.id}`
    ]);
  }

  private checkSizeCard() {
    setTimeout(() => {
      const elem = this.containerProducts.nativeElement;
      if (elem.offsetWidth <= this.limitSize) {
        this.render.addClass(elem, "mini-card");
      }
    });
  }
}
