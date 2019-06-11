import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { ROUTES } from '../../../router/routes';
import { CurrentSessionService } from '../../../services/current-session.service';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { PhotosService } from '../../../services/photos.service';

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
  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  public selectedFile = null;
  public selectedFileName = '';
  public selectedFilesImages = [];
  public messageError = '';
  public success = false;
  public error = false;
  public loading = false;
  public checkFile = [false, false];
  public maxFiles = [];
  constructor(private userService: UserService,
    private photosService: PhotosService,
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

  isInProccess() {
   /* if(this.historicalProducts) {
      for (let i = 0; i < this.historicalProducts.length; i++) {
        return this.historicalProducts[i].estado == 'En proceso';
      }
    }*/
    return false;
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

  onFileChanged(event) {
    this.checkFile[0] = true;
    this.messageError = '';
    this.success = false;
    this.error = false;
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.loading = true;
      if (this.selectedFile.name.includes('.xls') || this.selectedFile.name.includes('.xlsx')) {
        this.selectedFileName = this.selectedFile.name;
      } else {
        this.loading = false;
        this.error = true;
        this.messageError = 'Formato de archivo no admitido ' + this.selectedFile.name;
      }

    }

  }

  onFileChangedImages(event) {
  this.messageError = '';
  this.success = false;
  this.error = false;
  this.maxFiles = [];
  this.selectedFilesImages = event.target.files;
    if (this.selectedFilesImages.length > 0) {
      this.loading = true;
      if (this.maxSizeFiles().length > 0) {
        this.loading = false;
        this.error = true;
        this.messageError = 'Alguna de tus imágenes está un poco pesadas. Debe ser máximo de 10MB.';
        this.maxFiles = this.maxSizeFiles();
      } else {
        this.productsService.uploadPhotosShop(this.selectedFilesImages).subscribe((response) => {
          this.checkFile[1] = true;
          this.loading = false;
          this.messageError = '';
          this.error = false;
        }, (error) => {
          this.loading = false;
          this.error = true;
          if (error.error && error.error.message) {
            this.messageError = error.error.message;
          }
        });
      }
    }

  }

  maxSizeFiles() {
    const files = []
    if(this.selectedFilesImages) {
      for (let i = 0; i < this.selectedFilesImages.length; i++) {
        if (this.selectedFilesImages[i].size >=  10000000) {
          files.push(this.selectedFilesImages[i]);
        }
      }
    }
    return files;
  }

  proccessProducts() {
    this.messageError = '';
    this.success = false;
    this.error = false;
    this.loading = true;
    if(this.checkFile[0] && this.checkFile[1]) {
      const params = {
        'idTienda': 1,
        'nombreArchivo': this.selectedFileName
      };
      this.productsService.proccessProducts(params).subscribe((response)=> {
        this.loading = false;
        this.messageError = '';
        this.error = false;
        this.success = true;
        this.getProductsHistorical();
        console.log(response);
      }, (error)=> {
        this.loading = false;
        this.error = true;
        if (error.error && error.error.message) {
          this.messageError = error.error.message;
        }
      });
    }
  }

}
