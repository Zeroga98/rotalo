import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { PhotosService } from '../../../services/photos.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CommunitiesModalComponent } from './communities-modal/communities-modal.component';
import { UtilsService } from '../../../util/utils.service';
import { CollectionSelectService } from '../../../services/collection-select.service';
import { StatesModalComponent } from './states-modal/states-modal.component';

@Component({
  selector: 'admin-banners',
  templateUrl: './admin-banners.component.html',
  styleUrls: ['./admin-banners.component.scss']
})
export class AdminBannersComponent implements OnInit {
  public formBannerColombia;
  public formBannerGuatemala;
  public bannersColombia;
  public bannersGuatemala;
  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  public colombiaPositions = [1];
  public guatemalaPositions = [1];
  public communitiesColombia;
  public communitiesGuatemala;
  public errorChange = '';
  public successChange = false;
  public colombiaStates;
  public guatemalaStates;

  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private photosService: PhotosService,
    public dialog: MatDialog,
    private utilsService: UtilsService,
    private collectionService: CollectionSelectService,
  ) { }

  ngOnInit() {
    this.getCountries();
    this.loadBanners();
    this.setInitialFormColombia(this.getInitialConfig(1));
    this.setInitialFormGuatemala(this.getInitialConfig(9));
    this.getCommunitiesBanner();
  }

  loadBanners() {
    this.settingsService.getBannersList().subscribe(response => {
      if (response.body) {

       response.body.banners[0].map((item) => {
          item['communities-ids'] = [];
          item['states-ids']  = [];
          item.comunidades.map((community) => {
            item['communities-ids'].push(community.id);
          });
          item.departamentos.map((state) => {
            item['states-ids'].push(state.id.toString());
            state.marca = true;
          });
        });

        response.body.banners[1].map((item) => {
          item['communities-ids'] = [];
          item['states-ids'] = [];
          item.comunidades.map((community) => {
              item['communities-ids'].push(community.id);
          });
          item.departamentos.map((state) => {
            item['states-ids'].push(state.id.toString());
            state.marca = true;
          });
        });

        this.bannersColombia = response.body.banners[0];
        this.bannersGuatemala = response.body.banners[1];

        const bannersColombia = {
          banner: response.body.banners[0]
        };
        const bannersGuatemala = {
          banner: response.body.banners[1]
        };
        this.setInitialFormColombia(bannersColombia);
        this.setInitialFormGuatemala(bannersGuatemala);
      }
    });
  }



  private setInitialFormColombia(config) {
    this.formBannerColombia = this.formBuilder.group({
      banners: this.formBuilder.array(
        this.createItem(config.banner)
      )
    });
  }

  private setInitialFormGuatemala(config) {
    this.formBannerGuatemala = this.formBuilder.group({
      banners: this.formBuilder.array(
        this.createItem(config.banner)
      )
    });
  }

  private createItem(bannersForm) {
    const banners = bannersForm.map(banner => {
      return this.formBuilder.group({
        id: [banner.id],
        'country-id': [banner['country-id'], [Validators.required]],
        link: [banner.link],
        position: [banner.position, [Validators.required]],
        'id-photo-desktop': [banner['id-photo-desktop'], [Validators.required]],
        'id-photo-mobile': [banner['id-photo-mobile'], [Validators.required]],
        'url-photo-desktop': [banner['url-photo-desktop'], [Validators.required]],
        'url-photo-mobile': [banner['url-photo-mobile'], [Validators.required]],
        'communities-ids': [banner['communities-ids']],
        'states-ids': [banner['states-ids']],
      });
    });
    return banners;
  }

  private getInitialConfig(country) {
    const banner = {
      banner: [
        {
          id: null,
          'country-id': country,
          link: null,
          position: 1,
          'id-photo-desktop': null,
          'id-photo-mobile': null,
          'url-photo-desktop': null,
          'url-photo-mobile': null,
          'communities-ids': [-1],
          'states-ids': [-1]
        }
      ]
    };
    return banner;
  }

  private initialCommunity(country) {
    const banner = {
      id: null,
      'country-id': country,
      link: null,
      position: 1,
      'id-photo-desktop': null,
      'id-photo-mobile': null,
      'url-photo-desktop': null,
      'url-photo-mobile': null,
      'communities-ids': [-1],
      'states-ids': [-1]
    };
    return banner;
  }

  private createBasicItem(banner) {
    return this.formBuilder.group({
      id: [banner.id],
      'country-id': [banner['country-id'], [Validators.required]],
      link: [banner.link],
      position: [banner.position, [Validators.required]],
      'id-photo-desktop': [banner['id-photo-desktop'], [Validators.required]],
      'id-photo-mobile': [banner['id-photo-mobile'], [Validators.required]],
      'url-photo-desktop': [banner['url-photo-desktop'], [Validators.required]],
      'url-photo-mobile': [banner['url-photo-mobile'], [Validators.required]],
      'communities-ids': [banner['communities-ids']],
      'states-ids': [banner['states-ids']]
    });
  }

  addBannerColombia(country): void {
    this.bannersColombia = this.formBannerColombia.get('banners') as FormArray;
    this.bannersColombia.push(this.createBasicItem(this.initialCommunity(country)));
  }

  addBannerGuatemala(country): void {
    this.bannersGuatemala = this.formBannerGuatemala.get('banners') as FormArray;
    this.bannersGuatemala.push(this.createBasicItem(this.initialCommunity(country)));
  }

  removeBannerColombia(id) {
   const banners = this.formBannerColombia.get('banners').controls;
    if (banners.length > 1) {
      this.formBannerColombia.get('banners').controls = banners.filter((item, index) => {
        if (index != id) {
          return item;
        }
      });
    }
  }

  removeBannerGuatemala(id) {
    const banners = this.formBannerGuatemala.get('banners').controls;
    if (banners.length > 1) {
      this.formBannerGuatemala.get('banners').controls = banners.filter((item, index) => {
        if (index != id) {
          return item;
        }
      });
    }
  }

  removeBannerById (id, element, country) {
    this.successChange = false;
    this.errorChange = '';
    if (element &&  element.controls.id.value) {
      this.settingsService.deleteBanner(element.get('id').value).subscribe((response) => {
        if (country == 'Colombia') {
          this.removeBannerColombia(id);
        } else if (country == 'Guatemala') {
          this.removeBannerGuatemala(id);
        }
      }, (error) => {
        this.errorChange = error.error.message;
        this.utilsService.goToTopWindow(20, 600);
        console.log(error);
      });
    } else {
      if (country == 'Colombia') {
        this.removeBannerColombia(id);
      } else if (country == 'Guatemala') {
        this.removeBannerGuatemala(id);
      }
    }

  }

  get numberPositionsColombia() {
    this.colombiaPositions = [];
    const banners = this.formBannerColombia.get('banners').controls;
    for (let i = 1; i <= banners.length; i++) {
      this.colombiaPositions.push(i);
    }
    return this.colombiaPositions;
  }

  get numberPositionsGuatemala() {
    this.guatemalaPositions = [];
    const banners = this.formBannerGuatemala.get('banners').controls;
    for (let i = 1; i <= banners.length; i++) {
      this.guatemalaPositions.push(i);
    }
    return this.guatemalaPositions;
  }

  getCommunitiesBanner() {
    const bannerid = {
      'bannerid': null
    };
    this.settingsService.getCommunitiesBanner(bannerid).subscribe((response) => {
      if (response.body) {
        response.body.paises.map((community) => {
          if (community.nombre == 'Colombia') {
            this.communitiesColombia = community.comunidades;
          } else if (community.nombre == 'Guatemala') {
            this.communitiesGuatemala = community.comunidades;
          }
        });
      }
    }, (error) => {
      console.log(error);
    });
  }


  async getCountries() {
    try {
      await this.collectionService.isReady();
      this.getStatesColombia();
      this.getStatesGuatemala();
    } catch (error) {
      console.error(error);
    }
  }

  async getStatesColombia() {
    try {
      this.colombiaStates = await this.collectionService.getStatesById(1);
    } catch (error) {
      console.error(error);
    }
  }

  async getStatesGuatemala() {
    try {
      this.guatemalaStates = await this.collectionService.getStatesById(9);
    } catch (error) {
      console.error(error);
    }
  }

  onUploadImageFinished(event, element, type) {
    if (event.file.type == 'image/jpeg'
    || event.file.type == 'image/jpg'
    || event.file.type == 'image/png'
    || event.file.type == 'image/gif') {
      if (event.file.size < 5000000) {
        this.photosService.uploadPhoto(event.file).subscribe((response) => {
          if (type == 'desktop') {
            element.patchValue({ 'url-photo-desktop': response.urlPhoto });
            element.patchValue({ 'id-photo-desktop': response.photoId });
          } else if (type == 'mobile') {
            element.patchValue({ 'url-photo-mobile': response.urlPhoto });
            element.patchValue({ 'id-photo-mobile': response.photoId });
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

  onRemovePreviewImage(event, element, type) {
    event.deleteAll();
    if (type == 'desktop') {
      element.patchValue({ 'url-photo-desktop': null });
      element.patchValue({ 'id-photo-desktop': null });
    } else if (type == 'mobile') {
      element.patchValue({ 'url-photo-mobile': null });
      element.patchValue({ 'id-photo-mobile': null });
    }
  }

  openDialog(country, element): void {
    const communitiesIds = element.get('communities-ids').value;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.maxHeight = '500px';
    dialogConfig.width = '70%';
    dialogConfig.height = '70%';
    dialogConfig.autoFocus = false;
    if (country == 'Colombia') {
      dialogConfig.data = [];
      const communities = [
        {
          id: -1,
          nombre: 'Todas',
          marca: false
        }
      ];
      this.communitiesColombia.map((response) => {
        const item = {
          id: response.id,
          nombre: response.nombre,
          marca: response.marca
        };
        communities.push(item);
      });
      communities.map((item) => {
        if (communitiesIds.includes(item.id)) {
          item.marca = true;
        }
      });
      dialogConfig.data = communities;
    } else if (country == 'Guatemala') {
      dialogConfig.data = [];
      const communities = [{
        id: -1,
        nombre: 'Todas',
        marca: false
      }];
      this.communitiesGuatemala.map((response) => {
        const item = {
          id: response.id,
          nombre: response.nombre,
          marca: response.marca
        };
        communities.push(item);
      });
      communities.map((item) => {
        if (communitiesIds.includes(item.id)) {
          item.marca = true;
        }
      });
      dialogConfig.data = communities;
    }
    const dialogRef = this.dialog.open(CommunitiesModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        element.patchValue({ 'communities-ids': result });
      }
    });
  }

  openDialogState(country, element): void {
    const statesIds = element.get('states-ids').value;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.maxHeight = '500px';
    dialogConfig.width = '70%';
    dialogConfig.height = '70%';
    dialogConfig.autoFocus = false;
    dialogConfig.data = [];
    const states = [
      {
        id: -1,
        nombre: 'Todos',
        marca: false
      }
    ];
    if (country == 'Colombia') {
      this.colombiaStates.map((response) => {
        const item = {
          id: response.id,
          nombre: response.name,
          marca: false
        };
        states.push(item);
      });

      states.map((item) => {
        if (statesIds.includes(item.id)) {
          item.marca = true;
        }
      });

    } else if (country == 'Guatemala') {
      this.guatemalaStates.map((response) => {
        const item = {
          id: response.id,
          nombre: response.name,
          marca: false
        };
        states.push(item);
      });

      states.map((item) => {
        if (statesIds.includes(item.id)) {
          item.marca = true;
        }
      });

    }

    dialogConfig.data = states;
    const dialogRef = this.dialog.open(StatesModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        element.patchValue({ 'states-ids': result });
      }
    });
  }


  uploadBannerColombia () {
    this.successChange = false;
    this.errorChange = '';
   // if (!this.formBannerColombia.invalid) {
      const body = {
        data: this.formBannerColombia.value.banners
      };
      this.settingsService.uploadBanner(body).subscribe((response) => {
      /*  this.successChange = true;
        this.utilsService.goToTopWindow(20, 600);*/
        alert('Cambios guardados correctamente');
        location.reload();
      }, (error) => {
        this.errorChange = error.error.message;
        this.utilsService.goToTopWindow(20, 600);
        console.log(error);
      });
   // }
  }

  uploadBannerGuatemala () {
    this.successChange = false;
    this.errorChange = '';
   // if (!this.formBannerGuatemala.invalid) {
      const body = {
        data: this.formBannerGuatemala.value.banners
      };
      this.settingsService.uploadBanner(body).subscribe((response) => {
        /*this.successChange = true;
        this.utilsService.goToTopWindow(20, 600);*/
        alert('Cambios guardados correctamente');
        location.reload();
      }, (error) => {
        this.errorChange = error.error.message;
        this.utilsService.goToTopWindow(20, 600);
        console.log(error);
      });
   // }
  }


}
;
