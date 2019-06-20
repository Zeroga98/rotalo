import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { PhotosService } from '../../../services/photos.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UtilsService } from '../../../util/utils.service';

@Component({
  selector: 'app-admin-banners-shop',
  templateUrl: './admin-banners-shop.component.html',
  styleUrls: ['./admin-banners-shop.component.scss']
})
export class AdminBannersShopComponent implements OnInit {

  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  public errorChange = '';
  public successChange = false;
  public bannerHomeTienda;

  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private photosService: PhotosService,
    public dialog: MatDialog,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.loadBanners();
    this.setFormHomeShop(this.getInitialConfigHomeShop());

  }


  loadBanners() {
    this.settingsService.getBannersList().subscribe(response => {
      if (response.body) {
      }
    });
    const configHomeShop = {
        'idLogo': 123,
        'urlLogo': 'https://www.google.com/logo',
        'idBannerDesktop': 456,
        'urlBannerDestkop': 'https://www.google.com/logo',
        'idBannerMobile': 789,
        'urlBannerMobile': 'https://www.google.com/logo'
    };
    this.setFormHomeShop(configHomeShop);
  }

  private setFormHomeShop(config) {
    this.bannerHomeTienda= this.formBuilder.group({
      'idLogo': [config.idLogo, [Validators.required]],
      'urlLogo': [config.urlLogo, [Validators.required]],
      'idBannerDesktop': [config.idBannerDesktop, [Validators.required]],
      'urlBannerDestkop': [config.urlBannerDestkop, [Validators.required]],
      'idBannerMobile': [config.idBannerMobile, [Validators.required]],
      'urlBannerMobile': [config.urlBannerMobile, [Validators.required]]
    });
  }

  private getInitialConfigHomeShop() {
    const config =  {
      'idLogo': '',
      'urlLogo': '',
      'idBannerDesktop': '',
      'urlBannerDestkop': '',
      'idBannerMobile': '',
      'urlBannerMobile': ''
    };
    return config;
  }

  onUploadImageFinished(event, element, type) {
    if (event.file.type == 'image/jpeg'
    || event.file.type == 'image/jpg'
    || event.file.type == 'image/png'
    || event.file.type == 'image/gif') {
      if (event.file.size < 5000000) {
        this.photosService.uploadPhoto(event.file).subscribe((response) => {
          if (type == 'desktop') {
            element.patchValue({ 'urlBannerDestkop': response.urlPhoto });
            element.patchValue({ 'idBannerDesktop': response.photoId });
          } else if (type == 'mobile') {
            element.patchValue({ 'urlBannerMobile': response.urlPhoto });
            element.patchValue({ 'idBannerMobile': response.photoId });
          } else if (type == 'logo') {
            element.patchValue({ 'urlLogo': response.urlPhoto });
            element.patchValue({ 'idLogoe': response.photoId });
          }

        }, (error) => {
          console.log(error);
        });
      }
    }
  }

  onDrop(event, imageInput) {
    imageInput.onFileChange(event.dataTransfer.files);
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOver(event, imageInput) {
    imageInput.onFileOver(true);
    event.stopPropagation();
    event.preventDefault();
  }

  uploadFiles(imageInput) {
    const element: HTMLElement = imageInput.inputElement.nativeElement as HTMLElement;
    element.click();
  }

  onRemovePreviewImage(event, type) {
    event.deleteAll();
    if (type == 'desktop') {
    } else if (type == 'mobile') {
    }
  }

  openDialog(country, element) {

  }



}
