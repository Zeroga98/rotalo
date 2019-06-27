import {
    Component,
    OnInit,
    ViewChild,
    ElementRef
  } from '@angular/core';
  import { SettingsService } from '../../../services/settings.service';
  import { FormBuilder, Validators, FormArray } from '@angular/forms';

  @Component({
    selector: 'banner-latienda',
    templateUrl: 'banner-latienda.component.html',
    styleUrls: ['banner-latienda.component.scss']
  })
  export class BannerLatiendaComponent implements OnInit {
    

    public bannerHomeTienda;
    public bannersCategoriaForm;
    public bannerPromocionalForm;
    public location;
    public showBannersPromo = false;
    constructor(
      private settingsService: SettingsService,
      private formBuilder: FormBuilder
    ) { }
    ngOnInit() {
      this.location = window.location.href;
      console.log(this.location);
      this.getShowBanner(this.location)     
      
      this.loadBanners();
      this.setFormHomeShop(this.getInitialConfigHomeShop());
    }

    getShowBanner(string: String){
      if(string.indexOf('home')>=0){
        this.showBannersPromo = true;
      }
    }

    loadBanners(){
      this.settingsService.getBannersShop(1).subscribe(response => {
        if (response.body) {
        if (response.body.bannerHomeTienda) {this.setFormHomeShop(response.body.bannerHomeTienda);}
        if (response.body.bannerPromocional && response.body.bannerPromocional.length > 0) {this.setInitialFormPromo(response.body);}
        if (response.body.bannersCategoria && response.body.bannersCategoria.length > 0) {this.setInitialFormCategories(response.body);}
        }
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

    private setFormHomeShop(config) {
      this.bannerHomeTienda = this.formBuilder.group({
        'idLogo': [config.idLogo],
        'urlLogo': [config.urlLogo],
        'idBannerDesktop': [config.idBannerDesktop],
        'urlBannerDesktop': [config.urlBannerDesktop],
        'idBannerMobile': [config.idBannerMobile],
        'urlBannerMobile': [config.urlBannerMobile]
      });
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


  }

  
