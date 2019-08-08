import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatTabChangeEvent } from '@angular/material';
import * as moment from 'moment';
import { UtilsService } from './../../../util/utils.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { ProductsService } from '../../../services/products.service';
import { ROUTES } from '../../../router/routes';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-shop',
  templateUrl: './products-shop.component.html',
  styleUrls: ['./products-shop.component.scss']
})
export class ProductsShopComponent implements OnInit, AfterViewInit {
  displayedColumns = ['photos', 'id', 'name', 'description', 'price', 'priceIVA', 'IVA', 'published-at', 'stock', 'status', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  public statusTab = 0;
  public productos = [];
  @ViewChild('grid') grid: ElementRef;
  edit: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.UPLOAD}/`;
  show: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.SHOW}/`;
  preview: string = `/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.PREVIEW}/`;

  public messageChange = '';
  public errorChange = '';
  public routeSub;
  public idTienda;

  constructor(private productsService: ProductsService,
    private utilService: UtilsService,
    private userService: UserService,
    private router: Router,
    private settingsService: SettingsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
    this.idTienda = params['id'];
    this.getProductsList(0, this.idTienda);
    });
  }

  ngAfterViewInit() {

  }

  getFormatDate(date) {
    if (date) {
      const dateMoment: any = moment(date);
      return dateMoment.format('DD/MM/YYYY');
    }
    return '';
  }

  getProductsList(option, idShop) {
    this.productsService.getProductsShop(idShop).subscribe((response) => {
      if(response.body) {
        switch (option) {
          case 0:
          this.productos = response.body.productosActivos;
            break;
          case 1:
          this.productos = response.body.productosInactivos;
            break;
          case 2:
            break;
          default:
          this.productos = response.body.productosActivos;
            break;
        }
      }
    },
    (error) =>  console.log(error));
  }


  saveCheck(check, idCampaign) {
    const params = {
      estado: check.checked ? 'active' : 'inactive',
      storeId : this.idTienda
    };

    this.productsService
      .updateProductStatus(idCampaign, params)
      .then(response => {
        this.getProductsList(this.statusTab, this.idTienda);
      });
  }

  getUrlProduct (idProduct) {
    return this.edit + this.idTienda + '/' + idProduct;
  }

  getUrlPreviewProduct (idProduct) {
    return this.preview + this.idTienda + '/' + idProduct;
  }

  getUrlProductDetail (idProduct) {
    return this.show + idProduct;
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.statusTab = tabChangeEvent.index;
    this.getProductsList(tabChangeEvent.index, this.idTienda);
  }

  calculateIVA(price) {
    const iva = (price * 19) / 100;
    return price + iva;
  }


  onSubmit() {
    let productId = [];
    this.messageChange = '';
    this.errorChange = '';
    if (this.productos) {
      productId = this.productos.map((product: any) => {
        return product.id;
      });
      const params = {
        'productos': productId
      };
      this.productsService.setOrderProductsShop(params).subscribe((response) => {
        this.messageChange = 'Se ha guardado correctamente .';
        this.errorChange = '';
        this.utilService.goToTopWindow(20, 600);
      }, (error) => {
        this.messageChange = '';
        this.errorChange = 'Error';
        this.utilService.goToTopWindow(20, 600);
        console.log(error);
      });
    }
  }

  goBack(): void {
    window.history.back();
  }

  goToUploadProduct() {
    this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${
      ROUTES.MICROSITE.UPLOAD}/${this.idTienda}`]);
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

}
