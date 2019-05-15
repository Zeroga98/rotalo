import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { UtilsService } from './../../../util/utils.service';
import { UserService } from '../../../services/user.service';
import { SettingsService } from '../../../services/settings.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-products-shop',
  templateUrl: './products-shop.component.html',
  styleUrls: ['./products-shop.component.scss']
})
export class ProductsShopComponent implements OnInit, AfterViewInit {

  dataSource;
  displayedColumns = ['photos', 'id', 'name', 'description', 'price', 'priceIVA', 'IVA', 'published-at', 'stock', 'status', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  public productsActive = [];
  public productsInactive = [];
  public productos = [];
  @ViewChild('grid') grid: ElementRef;

  constructor(private productsService: ProductsService,
    private utilService: UtilsService,
    private userService: UserService,
    private settingsService: SettingsService) { }

  ngOnInit() {
    this.getProductsList();
  }

  ngAfterViewInit() {
    let inputs = document.getElementsByTagName('tbody');
  }

  getFormatDate(date) {
    if (date) {
      const dateMoment: any = moment(date);
      return dateMoment.format('DD/MM/YYYY');
    }
    return '';
  }

  getProductsList() {
    this.productsService.getProductsShop(1).subscribe((response) => {
      if(response.body) {
        this.productsActive = response.body.productosActivos;
        console.log(this.productsActive);
        this.productsInactive = response.body.productosInactivos;
        this.dataSource = new MatTableDataSource(this.productsActive);
       /* this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'city': return item.city.name;
            case 'country': return item.city.state.country.name;
            case 'company': return item.company.name;
            default: return item[property];
          }
        };*/
        this.dataSource.sort = this.sort;
      }
    },
    (error) =>  console.log(error));
  }

}
