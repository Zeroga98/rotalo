import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatTabChangeEvent, MatDialogConfig, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { UtilsService } from './../../../util/utils.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { ProductsService } from '../../../services/products.service';
import { ROUTES } from '../../../router/routes';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDeleteComponent } from '../../../components/modal-delete/modal-delete.component';

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
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
    this.idTienda = params['id'];
    this.loadInfoUser (this.idTienda);
    if (this.productsService.getStatusTableProduct()) {
      this.statusTab = this.productsService.getStatusTableProduct();
      this.getProductsList(this.productsService.getStatusTableProduct(), this.idTienda);
      this.productsService.setStatusTableProduct(0);
    } else {
      this.getProductsList(0, this.idTienda);
    }
    });
  }

  ngAfterViewInit() {
  }

  async  loadInfoUser (idStore) {
    try {
      const currentUser = await this.userService.getInfoUser();
      if (currentUser.stores) {
        for (let i = 0 ; i < currentUser.stores.length; i++ ) {
          if (currentUser.stores[i] &&
          currentUser.stores[i].id == idStore &&
          !currentUser.stores[i]['is_assigned_to_user'] ) {
            this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
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
      if (response && response.body) {

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


  saveCheck(check, product) {
    const params = {
      estado: check.checked ? 'active' : 'inactive',
      storeId : this.idTienda
    };

    if(this.statusTab == 1 && product.stock == 0 ) {
      this.router.navigate([this.edit + this.idTienda + '/' + product.id]);
    } else  {
      this.productsService
      .updateProductStatus(product.id, params)
      .then(response => {
        this.getProductsList(this.statusTab, this.idTienda);
      });
    }

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
    const iva = (price) / (1.19);
    return iva;
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

  openModalDelete(idProducto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px';
  //  dialogConfig.maxWidth = '335px';
    dialogConfig.minHeight = '373px';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'delete-dialog-container-class';
    const params = {
      idTienda: this.idTienda,
      idProducto: idProducto
    };
    dialogConfig.data = params;
    const dialogRef = this.dialog.open(ModalDeleteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.productos =  this.productos.filter(value => {
        return value.id != result.idProducto;
      });
    });
  }

}
