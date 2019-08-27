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
  public idTienda;
  constructor(private userService: UserService,
    private photosService: PhotosService,
    private currentSession: CurrentSessionService,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idTienda = params['id'];
      this.getProductsHistorical();
    });
  }

  getProductsHistorical() {
    this.productsService.getProductsHistorical(this.idTienda).subscribe((response) => {
      if (response.body) {
        this.historicalProducts = response.body.historialCargasMasivas;

      }
    }, (error) => {
      console.log(error);
    });
  }

  isInProccess() {
   if (this.historicalProducts) {
      for (let i = 0; i < this.historicalProducts.length; i++) {
        return this.historicalProducts[i].estado == 'En proceso';
      }
    }
    return false;
  }

  formatDate(date) {
    if (date) {
      const test = new Date(date);
      const dateMoment: any = moment(test);
      return dateMoment.format('DD/MM/YYYY');
    }
    return '';
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
    this.messageError = '';
    this.success = false;
    this.error = false;
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.loading = true;
      if (this.selectedFile.name.includes('.xls') || this.selectedFile.name.includes('.xlsx')) {
        this.selectedFileName = this.selectedFile.name;
        this.productsService.uploadFileProducts(this.selectedFile, this.idTienda).subscribe((response) => {
          this.checkFile[0] = true;
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
        this.productsService.uploadPhotosShop(this.selectedFilesImages, this.idTienda).subscribe((response) => {
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
    const files = [];
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
    if (this.checkFile[0] && this.checkFile[1]) {
      const params = {
        'idTienda': this.idTienda,
        'nombreArchivo': this.selectedFileName
      };
      this.productsService.proccessProducts(params).subscribe((response)=> {
        this.loading = false;
        this.messageError = '';
        this.error = false;
        this.success = true;
        this.getProductsHistorical();
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
