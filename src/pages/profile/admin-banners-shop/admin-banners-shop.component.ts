import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { PhotosService } from '../../../services/photos.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UtilsService } from '../../../util/utils.service';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-admin-banners-shop',
  templateUrl: './admin-banners-shop.component.html',
  styleUrls: ['./admin-banners-shop.component.scss']
})
export class AdminBannersShopComponent implements OnInit {

  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  public errorHomeTienda = '';
  public errorPromocional = '';
  public errorCategorias = '';
  public successChange = false;
  public bannerHomeTienda;
  public bannersCategoriaForm;
  public bannerPromocionalForm;
  public bannersCategorias;
  public categories;
  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private photosService: PhotosService,
    public dialog: MatDialog,
    private utilsService: UtilsService,
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadBanners();
    this.setFormHomeShop(this.getInitialConfigHomeShop());
    this.setInitialFormCategories(this.getInitialConfigCategories());
    this.setInitialFormPromo(this.getInitialConfigPromo());
  }

  loadCategories() {
    this.categoriesService.getCategoriesActiveServer().subscribe((response) => {
      this.categories = response;
    }, (error) => {
      console.log(error);
    });
  }

  loadBanners() {
    this.settingsService.getBannersShop(1).subscribe(response => {
      if (response.body) {
      if (response.body.bannerHomeTienda) {this.setFormHomeShop(response.body.bannerHomeTienda);}
      if (response.body.bannerPromocional && response.body.bannerPromocional.length > 0) {this.setInitialFormPromo(response.body);}
      if (response.body.bannersCategoria && response.body.bannersCategoria.length > 0) {this.setInitialFormCategories(response.body);}
      }
    });
  }

  private setFormHomeShop(config) {
    this.bannerHomeTienda = this.formBuilder.group({
      'idLogo': [config.idLogo, [Validators.required]],
      'urlLogo': [config.urlLogo, [Validators.required]],
      'idBannerDesktop': [config.idBannerDesktop, [Validators.required]],
      'urlBannerDesktop': [config.urlBannerDesktop, [Validators.required]],
      'idBannerMobile': [config.idBannerMobile, [Validators.required]],
      'urlBannerMobile': [config.urlBannerMobile, [Validators.required]]
    });
  }

  private getInitialConfigHomeShop() {
    const config =  {
      'idLogo': '',
      'urlLogo': '',
      'idBannerDesktop': '',
      'urlBannerDesktop': '',
      'idBannerMobile': '',
      'urlBannerMobile': ''
    };
    return config;
  }

  private setInitialFormPromo(config) {
    this.bannerPromocionalForm = this.formBuilder.group({
      bannerPromocional: this.formBuilder.array(
        this.createItemShop(config.bannerPromocional)
      )
    });
  }

  private setInitialFormCategories(config) {
    this.bannersCategoriaForm = this.formBuilder.group({
     bannersCategoria: this.formBuilder.array(
        this.createItem(config.bannersCategoria)
      )
    });
  }

  private createBasicItem(banner) {
    return this.formBuilder.group({
      idBannerCategoria: [banner.idBannerCategoria,  [Validators.required]],
      idBannerDesktop: [banner.idBannerDesktop, [Validators.required]],
      urlBannerDesktop: [banner.urlBannerDesktop,  [Validators.required]],
      idBannerMobile: [banner.idBannerMobile,  [Validators.required]],
      urlBannerMobile: [banner.urlBannerMobile,  [Validators.required]],
      idCategoria: [banner.idCategoria,  [Validators.required]],
    });
  }

  private initialCommunity() {
    const bannersCategoria = {
      'idBannerCategoria': '',
      'idBannerDesktop': '',
      'urlBannerDesktop': '',
      'idBannerMobile': '',
      'urlBannerMobile': '',
      'idCategoria': ''
    };
    return bannersCategoria;
  }

  private getInitialConfigCategories() {
    const bannersCategoria = {
      bannersCategoria: [
        {
          'idBannerCategoria': '',
          'idBannerDesktop': '',
          'urlBannerDesktop': '',
          'idBannerMobile': '',
          'urlBannerMobile': '',
          'idCategoria': ''
        }
      ]
    };
    return bannersCategoria;
  }

  private getInitialConfigPromo() {
    const bannerPromocional = {
      bannerPromocional: [
        {
          'idBannerPromocional': '',
          'idBannerDesktop': '',
          'urlBannerDesktop': '',
          'idBannerMobile': '',
          'urlBannerMobile': '',
          'idCategoria': '',
          'link': ''
        },
        {
          'idBannerPromocional': '',
          'idBannerDesktop': '',
          'urlBannerDesktop': '',
          'idBannerMobile': '',
          'urlBannerMobile': '',
          'idCategoria': '',
          'link': ''
        }
        ,   {
          'idBannerPromocional': '',
          'idBannerDesktop': '',
          'urlBannerDesktop': '',
          'idBannerMobile': '',
          'urlBannerMobile': '',
          'idCategoria': '',
          'link': ''
        }
      ]
    };
    return bannerPromocional;
  }

  private createItemShop(bannersForm) {
    const bannerPromocional = bannersForm.map(banner => {
      return this.formBuilder.group({
        idBannerPromocional: banner.idBannerPromocional,
        idBannerDesktop: banner.idBannerDesktop,
        urlBannerDesktop: banner.urlBannerDesktop,
        idBannerMobile: banner.idBannerMobile,
        urlBannerMobile: banner.urlBannerMobile,
        idCategoria: banner.idCategoria,
        link: banner.link
      });
    });
    return bannerPromocional;
  }

  private createItem(bannersForm) {
    const bannersCategoria = bannersForm.map(banner => {
      return this.formBuilder.group({
        idBannerCategoria: banner.idBannerCategoria,
        idBannerDesktop: banner.idBannerDesktop,
        urlBannerDesktop: banner.urlBannerDesktop,
        idBannerMobile: banner.idBannerMobile,
        urlBannerMobile: banner.urlBannerMobile,
        idCategoria: banner.idCategoria
      });
    });
    return bannersCategoria;
  }

  onUploadImageFinished(event, type) {
    if (event.file.type == 'image/jpeg'
    || event.file.type == 'image/jpg'
    || event.file.type == 'image/png'
    || event.file.type == 'image/gif') {
      if (event.file.size < 5000000) {
        this.photosService.uploadPhoto(event.file).subscribe((response) => {
          if (type == 'desktop') {
            this.bannerHomeTienda.patchValue({ 'urlBannerDesktop': response.urlPhoto });
            this.bannerHomeTienda.patchValue({ 'idBannerDesktop': response.photoId });
          } else if (type == 'mobile') {
            this.bannerHomeTienda.patchValue({ 'urlBannerMobile': response.urlPhoto });
            this.bannerHomeTienda.patchValue({ 'idBannerMobile': response.photoId });
          } else if (type == 'logo') {
            this.bannerHomeTienda.patchValue({ 'urlLogo': response.urlPhoto });
            this.bannerHomeTienda.patchValue({ 'idLogo': response.photoId });
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

  onRemovePreviewImage(event ,type) {
    event.deleteAll();
    if (type == 'desktop') {
      this.bannerHomeTienda.patchValue({ 'urlBannerDesktop': null });
      this.bannerHomeTienda.patchValue({ 'idBannerDesktop': null });
    } else if (type == 'mobile') {
      this.bannerHomeTienda.patchValue({ 'urlBannerMobile': null });
      this.bannerHomeTienda.patchValue({ 'idBannerMobile': null });
    } else if (type == 'logo') {
      this.bannerHomeTienda.patchValue({ 'urlLogo': null });
      this.bannerHomeTienda.patchValue({ 'idLogoe': null });
    }
  }


  removeBannerById (id, element) {
    this.successChange = false;

    if (element && element.controls && element.controls.idBannerCategoria.value) {
      this.settingsService.deleteBannerShop(element.get('idBannerCategoria').value).subscribe((response) => {
        this.removeBanner(id);
      }, (error) => {
        this.errorHomeTienda  = error.error.message;

        console.log(error);
      });
    } else {
      this.removeBanner(id);
    }
  }

  resetFormBanner(id) {
    this.removeBanner(id);
    this.addBanner();
  }

  removeBanner(id) {
    const banners = this.bannersCategoriaForm.get('bannersCategoria').controls;
   //  if (banners.length > 1) {
       this.bannersCategoriaForm.get('bannersCategoria').controls = banners.filter((item, index) => {
         if (index != id) {
           return item;
         }
       });
  //   }
   }

   onRemovePreviewImageDynamic(event, element, type) {
    event.deleteAll();
    if (type == 'desktop') {
      element.patchValue({ 'urlBannerDesktop': null });
      element.patchValue({ 'idBannerDesktop': null });
    } else if (type == 'mobile') {
      element.patchValue({ 'urlBannerMobile': null });
      element.patchValue({ 'idBannerMobile': null });
    }
  }

  onUploadImageFinishedDynamic(event, element, type) {
    if (event.file.type == 'image/jpeg'
    || event.file.type == 'image/jpg'
    || event.file.type == 'image/png'
    || event.file.type == 'image/gif') {
      if (event.file.size < 5000000) {
        this.photosService.uploadPhoto(event.file).subscribe((response) => {
          if (type == 'desktop') {
            element.patchValue({ 'urlBannerDesktop': response.urlPhoto });
            element.patchValue({ 'idBannerDesktop': response.photoId });
          } else if (type == 'mobile') {
            element.patchValue({ 'urlBannerMobile': response.urlPhoto });
            element.patchValue({ 'idBannerMobile': response.photoId });
          }
        }, (error) => {
          console.log(error);
        });
      }
    }
  }

  addBanner(): void {
    this.bannersCategorias = this.bannersCategoriaForm.get('bannersCategoria') as FormArray;
    this.bannersCategorias.push(this.createBasicItem(this.initialCommunity()));
  }


  uploadBanners () {
    this.successChange = false;
    this.errorHomeTienda = '';
    this.errorPromocional = '';
    this.errorCategorias = '';

  //  if(!this.bannerHomeTienda.invalid && !this.bannerPromocionalForm.invalid) {
      const body = {
        bannerHomeTienda: this.bannerHomeTienda.value,
        bannerPromocional: this.bannerPromocionalForm.value.bannerPromocional,
        bannersCategoria: null
      };
      if(this.bannersCategoriaForm.value && this.bannersCategoriaForm.value.bannersCategoria) {
        body.bannersCategoria = this.bannersCategoriaForm.value.bannersCategoria;
      }
      console.log(this.bannersCategoriaForm.value);
      this.settingsService.uploadBannerShop(body).subscribe((response) => {

        alert('Cambios guardados correctamente');
        location.reload();
      }, (error) => {
        if (error.error) {

          if(error.error.status) {
            if(error.error.status == 615 || error.error.status == 616) {
              this.errorHomeTienda = error.error.message;
              const el = document.getElementById('bannerHomeTienda');
              el.scrollIntoView();
            }
            if(error.error.status == 617 || error.error.status == 618 ||
              error.error.status == 619 || error.error.status == 620 ||
              error.error.status == 621 || error.error.status == 626 ) {
                this.errorPromocional = error.error.message;
              const el = document.getElementById('bannerPromocional');
              el.scrollIntoView();
            }
            if(error.error.status == 622 || error.error.status == 623 ||
              error.error.status == 624 || error.error.status == 627) {
              this.errorCategorias = error.error.message;
              const el = document.getElementById('bannersCategoria');
              el.scrollIntoView();
            }

          }

        }

        console.log(error);
      });
    //}

  }


}
