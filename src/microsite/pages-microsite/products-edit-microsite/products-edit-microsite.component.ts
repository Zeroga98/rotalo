import { ProductInterface } from '../../../commons/interfaces/product.interface';
import { ProductsService } from '../../../services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { CurrentSessionService } from '../../../services/current-session.service';


@Component({
  selector: 'products-edit-microsite',
  templateUrl: './products-edit-microsite.component.html',
  styleUrls: ['./products-edit-microsite.component.scss']
})
export class ProductsEditMicrositeComponent implements OnInit {

  product: ProductInterface;
  public errorference = '';
  public photosUploadedRest = null;
  public idProduct;
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSessionService: CurrentSessionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idProduct = params['id'];
      this.loadProduct();
    });
  }

  loadProduct() {
    this.productsService.getProductsByIdDetail(this.idProduct).subscribe((reponse) => {
      if (reponse.body) {
        this.product = reponse.body.productos[0];
        this.photosUploadedRest = 0;
       // this.redirectIfisNotOwner(this.product);
      }
    } ,
    (error) => {
      console.log(error);
    });
  }

  redirectIfisNotOwner(product) {
    const idUser = this.currentSessionService.getIdUser();
    if (product.user.id != idUser) {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    }
  }

  updatePhoto(event) {
    this.productsService.updateProductForm(this.idProduct, event).subscribe((response) => {
      this.router.navigate([
        `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SELLING}`
      ]);
      this.productsService.products = [];
    },
      (error) => {
        if (error.error) {
          this.errorference = error.error.message;
          this.changeDetectorRef.markForCheck();
        }
        console.log(error);
      }
    );
  }


}
