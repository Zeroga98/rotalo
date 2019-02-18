import { Component, OnInit } from "@angular/core";
import { SettingsService } from "../../../services/settings.service";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "admin-banners",
  templateUrl: "./admin-banners.component.html",
  styleUrls: ["./admin-banners.component.scss"]
})
export class AdminBannersComponent implements OnInit {
  public formBannerColombia;
  public formBannerGuatemala;
  public bannersColombia;
  public bannersGuatemala;

  public colombiaPositions = [1];
  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loadBanners();
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
      console.log(response);
      if(response.body) {

      }
    }, (error) => {
      console.log(error);
    });
  }

}
