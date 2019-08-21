
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class SettingsService {
  //readonly url = this.configurationService.getBaseUrl() + '/settings';
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  public idTerms;
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

  getTypeOrders() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes/estados`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  getOrders(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes`;
    return this.http.get(url, { headers: headers , params: params}).pipe(map((response: any) => response));
  }

  getShipping() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes/transportadoras`;
    return this.http.get(url, { headers: headers}).pipe(map((response: any) => response));
  }

  updateOrden(params, id) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes/${id}/guias`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  getPreRegisters() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/preregistro`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  changeStatusOrders(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ordenes/actualizar`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  deleteProduct(id: number | string): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/preregistro/${id}`;
    return this.http
      .delete(url, { headers: headers })
      .toPromise();
  }

  createCampaign(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  updateCampaign(params, id) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/${id}`;
    return this.http.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  loadCampaign(id) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/${id}`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getCampaignsList() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  changeStateCampaign(idCampaign, params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/states/${idCampaign}`;
    return this.http.put(url , params, { headers: headers }).pipe(map((response: any) => response));
  }

  deleteCampaign(idCampaign) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/campaigns/${idCampaign}`;
    return this.http.delete(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getBannersList() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getCommunitiesBanner(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/comunidades`;
    return this.http.post(url , params, { headers: headers }).pipe(map((response: any) => response));
  }

  uploadBanner(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/actualizar`;
    return this.http.put(url , params, { headers: headers }).pipe(map((response: any) => response));
  }

  deleteBanner(idBanner) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/eliminar/${idBanner}`;
    return this.http.put(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getBannersHomeList() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/home`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getTerms() {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/terminos/condiciones/reciente`;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response));
  }

  acceptTerms(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/terminos/condiciones/aceptar`;
    return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  setIdterms(idTerms) {
    this.idTerms = idTerms;
  }

  getIdterms() {
    return this.idTerms;
  }

  getCommpanyList(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/perfil/empresas`;
    return this.http.put(url , params, { headers: headers }).pipe(map((response: any) => response));
  }

  getBannersShop(idShop) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/tienda/${idShop}`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getBannersShopPublic(idShop) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/storesbanners/${idShop}`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  getBannersShopPrivate(idShop) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/storesbannersprivates/${idShop}`;
    return this.http.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  deleteBannerShop(idBanner) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/tienda/eliminar/${idBanner}`;
    return this.http.put(url , { headers: headers }).pipe(map((response: any) => response));
  }

  uploadBannerShop(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/banners/tienda/actualizar`;
    return this.http.put(url , params, { headers: headers }).pipe(map((response: any) => response));
  }

}
