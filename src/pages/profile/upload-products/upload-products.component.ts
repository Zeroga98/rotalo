import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { ROUTES } from '../../../router/routes';
import { CurrentSessionService } from '../../../services/current-session.service';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';

@Component({
  selector: 'app-upload-products',
  templateUrl: './upload-products.component.html',
  styleUrls: ['./upload-products.component.scss']
})
export class UploadProductsComponent implements OnInit {
  public detailOrder;
  public user;
  public terms = `/${ROUTES.TERMS}`;
  public isOwnOrder;
  public sold = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SOLD}`;
  public adminOrders = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINORDERS}`;
  public historicalProducts = [];
  customStyleImageLoader = IMAGE_LOAD_STYLES;
  constructor(private userService: UserService,
    private currentSession: CurrentSessionService,
    private actRoute: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router) { }

  ngOnInit() {
    this.getProductsHistorical();
  }

  getProductsHistorical() {
    this.productsService.getProductsHistorical().subscribe((response) => {
      if (response.body) {
        this.historicalProducts = response.body.historialCargasMasivas;
        console.log(response.body);
      }
    }, (error) => {
      console.log(error);
    });
  }

  formatDate(date) {
    const dateMoment: any = moment(date);
    date = dateMoment.format('DD/MM/YYYY');
    return date;
  }

  getUrlImge(photo) {
      return ('url(' + photo.replace(/ /g, '%20')) + ')';
  }

  getInfoUser(userId) {
    this.userService.getInfomationUser(userId).then((response) => {
      this.user = response;
    }) .catch(httpErrorResponse => {
      console.log(httpErrorResponse);
    });
  }

  refreshRegister() {
    this.getProductsHistorical();
  }

  onUploadImageFinished(event) {
    console.log(event);
  }

  uploadFiles(img) {
    console.log(img);
    const element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

  onFileChanged(event) {
    debugger
    console.log(event);
    const file = event.target.files[0];
    this.productsService.uploadPhotosShop(file).subscribe((response) => {

      console.log(response);
      if (response.body) {
      }
    }, (error) => {
      console.log(error);
    });
  }

}
