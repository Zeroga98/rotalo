import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { FormBuilder } from '@angular/forms';
import { ROUTES } from './../../../router/routes';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../../services/configuration.service';

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
  public srcBannerHomeTienda;

  constructor(
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private configurationService: ConfigurationService
  ) { }
  ngOnInit() {
    this.location = window.location.href;
    this.getShowBanner(this.location);

    if (window.location.href.includes('tiendainmueble')) {
      this.loadBannersPublic(this.configurationService.storeIdPublic);
    } else {
      this.loadBanners(1);
    }

    this.setFormHomeShop(this.getInitialConfigHomeShop());
    this.setInitialFormPromo(this.getInitialConfigPromo());
  }

  getShowBanner(string: String) {
    if (string.indexOf('home') >= 0) {
      this.showBannersPromo = true;
    }
  }

  loadBanners(idTienda) {
    this.settingsService.getBannersShop(idTienda).subscribe(response => {
      if (response.body) {
        if (response.body.bannerHomeTienda) { this.setFormHomeShop(response.body.bannerHomeTienda); }
        if (response.body.bannerPromocional && response.body.bannerPromocional.length > 0) { this.setInitialFormPromo(response.body); }
        if (response.body.bannersCategoria && response.body.bannersCategoria.length > 0) { this.setInitialFormCategories(response.body); }
      }

      this.srcBannerHomeTienda = this.bannerHomeTienda.controls['urlBannerDesktop'].value;
    });
  }

  loadBannersPublic(idTienda) {
    this.settingsService.getBannersShopPublic(idTienda).subscribe(response => {
      if (response.body) {
        if (response.body.bannerHomeTienda) { this.setFormHomeShop(response.body.bannerHomeTienda); }
        if (response.body.bannerPromocional && response.body.bannerPromocional.length > 0) { this.setInitialFormPromo(response.body); }
        if (response.body.bannersCategoria && response.body.bannersCategoria.length > 0) { this.setInitialFormCategories(response.body); }
      }
      this.srcBannerHomeTienda = this.bannerHomeTienda.controls['urlBannerDesktop'].value;
     /* let j=0;
      for (let i = 0; i < this.bannerPromocionalForm.get('bannerPromocional').controls.length; i++) {
            j++;
      }
      if(j==3) {
        this.showBannersPromo = true;
      }*/
    });
  }

  private getInitialConfigHomeShop() {
    const config = {
      'idLogo': '',
      'urlLogo': '',
      'idBannerDesktop': '',
      'urlBannerDesktop': '',
      'idBannerMobile': '',
      'urlBannerMobile': ''
    };
    return config;
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
        }
      ]
    };
    return bannerPromocional;
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

  goHomeStore() {
    const routeHome = `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}`;
    const categoria = document.createElement('a');
    categoria.href = routeHome;
    categoria.click();
  }

  redirectLink(url) {
    const categoria = document.createElement('a');
    categoria.target = '_blank';
    categoria.href = url;
    categoria.click();
  }

  redirectCategory(idCategoria: number) {
    // console.log('idCategoria: ' + idCategoria);
  }
}
