import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { PhotosService } from '../../../services/photos.service';

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
  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private photosService: PhotosService
  ) {}

  ngOnInit() {
    this.loadBanners();
    this.getCommunitiesCampaign();
    this.setInitialFormColombia(this.getInitialConfig(1));
    this.setInitialFormGuatemala(this.getInitialConfig(3));
    console.log(this.formBannerColombia);
    console.log(this.formBannerGuatemala);
  }

  loadBanners() {
    this.settingsService.getBannersList().subscribe(response => {
      console.log(response);
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
        'country-id': [banner['country-id'], [Validators.required]],
        link: [banner.link],
        position: [banner.position, [Validators.required]],
        'id-photo-desktop': [banner['id-photo-desktop'], [Validators.required]],
        'id-photo-mobile': [banner['id-photo-mobile'], [Validators.required]],
        'url-photo-desktop': [banner['url-photo-desktop'], [Validators.required]],
        'url-photo-mobile': [banner['url-photo-mobile'], [Validators.required]],
        'communities-ids': [banner['communities-ids'], [Validators.required]],
      });
    });
    return banners;
  }

  private getInitialConfig(country) {
    const banner = {
      banner: [
        {
          'country-id': country,
          link: null,
          position: 1,
          'id-photo-desktop': null,
          'id-photo-mobile': null,
          'url-photo-desktop': null,
          'url-photo-mobile': null,
          'communities-ids': []
        }
      ]
    };
    return banner;
  }

  private initialCommunity(country) {
    const banner = {
      'country-id': country,
      link: null,
      position: 1,
      'id-photo-desktop': null,
      'id-photo-mobile': null,
      'url-photo-desktop': null,
      'url-photo-mobile': null,
      'communities-ids': []
    };
    return  banner;
  }

  private createBasicItem(banner) {
    return this.formBuilder.group({
      'country-id': [banner['country-id'], [Validators.required]],
      link: [banner.link],
      position: [banner.position, [Validators.required]],
      'id-photo-desktop': [banner['id-photo-desktop'], [Validators.required]],
      'id-photo-mobile': [banner['id-photo-mobile'], [Validators.required]],
      'url-photo-desktop': [banner['url-photo-desktop'], [Validators.required]],
      'url-photo-mobile': [banner['url-photo-mobile'], [Validators.required]],
      'communities-ids': [banner['communities-ids'], [Validators.required]],
    });
}

  addBannerColombia(country): void {
    this.bannersColombia = this.formBannerColombia.get('banners') as FormArray;
    this.bannersColombia.push(this.createBasicItem(this.initialCommunity(country)));
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

  get numberPositionsColombia () {
    this.colombiaPositions = [];
    const banners = this.formBannerColombia.get('banners').controls;
    for (let i = 1; i <= banners.length; i++) {
      this.colombiaPositions.push(i);
    }
    return this.colombiaPositions;
  }

  getCommunitiesCampaign() {
    const bannerid = {
      'bannerid': null
    };
    this.settingsService.getCommunitiesCampaign(bannerid).subscribe((response) => {
      console.log(response, 'comunidades');
      if (response.body) {

      }
    }, (error) => {
      console.log(error);
    });
  }


  onUploadImageFinished(event, element) {
    console.log(event);
    console.log(element);
    if (event.file.type == 'image/jpg' || event.file.type == 'image/png' || event.file.type == 'image/gif') {
      if (event.file.size < 5000000) {
        this.photosService.uploadPhoto(event.file).subscribe((response) => {
          element = response.urlPhoto;
          console.log(response);
          console.log(element);
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
    console.log(this.formBannerColombia.get('banners').controls);
    const element: HTMLElement = imageInput.inputElement.nativeElement as HTMLElement;
    element.click();
  }


}
