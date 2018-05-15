import { OfferInterface } from './../../commons/interfaces/offer.interface';
import { ElementRef, AfterViewChecked, AfterViewInit, Renderer2 } from '@angular/core';
import { ProductInterface } from './../../commons/interfaces/product.interface';
import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, ViewChild } from '@angular/core';
@Component({
  selector: "product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent implements AfterViewInit {
  @Input() product: ProductInterface;
  @Input() masonryInfo;
  @Output() selected: EventEmitter<ProductInterface> = new EventEmitter();
  @Input() colourCompany: string;

  @ViewChild("containerProducts", { read: ElementRef })
  containerProducts: ElementRef;
  readonly defaultImage: string = "../assets/img/product-no-image.png";
  private readonly limitSize: number = 220;
  constructor(private render: Renderer2) {}
  ngAfterViewInit(): void {
    this.checkSizeCard();
  }

  triggerMasonryLayout() {
    //this.masonryInfo._msnry.reloadItems();
    this.masonryInfo.layout();
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
  private checkSizeCard() {
    setTimeout(() => {
      const elem = this.containerProducts.nativeElement;
      if (elem.offsetWidth <= this.limitSize) {
        this.render.addClass(elem, "mini-card");
      }
    });
  }
}
