import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
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
    private changeDetector: ChangeDetectorRef,
    private configurationService: ConfigurationService
  ) { }
  ngOnInit() {
    this.location = window.location.href;
    this.getShowBanner(this.location);
    if (window.location.href.includes(ROUTES.SHOPS.LINK)) {
      this.loadBannersPublic(this.configurationService.storeIdPublic);
    } if (window.location.href.includes(ROUTES.SHOPSPRIVATE.LINK)) {
      this.loadBannersPrivate(this.configurationService.storeIdPrivate);
    } if (window.location.href.includes(ROUTES.MICROSITE.LINK)) {
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
      this.changeDetector.markForCheck();
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
      this.changeDetector.markForCheck();
    });
  }

  loadBannersPrivate(idTienda) {
    this.settingsService.getBannersShopPrivate(idTienda).subscribe(response => {
      if (response.body) {
        if (response.body.bannerHomeTienda) { this.setFormHomeShop(response.body.bannerHomeTienda); }
        if (response.body.bannerPromocional && response.body.bannerPromocional.length > 0) { this.setInitialFormPromo(response.body); }
        if (response.body.bannersCategoria && response.body.bannersCategoria.length > 0) { this.setInitialFormCategories(response.body); }
      }
      this.srcBannerHomeTienda = this.bannerHomeTienda.controls['urlBannerDesktop'].value;
      this.changeDetector.markForCheck();
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
    let routeHome = `${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}`;
    if (window.location.href.includes(ROUTES.SHOPSPRIVATE.LINK)) {
      routeHome = `${ROUTES.SHOPSPRIVATE.LINK}/${ROUTES.SHOPSPRIVATE.FEED}`;
    } else if (window.location.href.includes(ROUTES.SHOPS.LINK)) {
      routeHome = `${ROUTES.SHOPS.LINK}/${ROUTES.SHOPS.FEED}`;
    }
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
