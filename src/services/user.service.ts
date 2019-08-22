
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserInterface } from './../commons/interfaces/user.interface';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';
import { CurrentSessionService } from '../services/current-session.service';
import { UserRequestInterface } from '../commons/interfaces/user-request.interface';

@Injectable()
export class UserService {
  // readonly url: string = `${this.configurationService.getBaseUrl()}/users`;

  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  currentUser: UserInterface;
  idUser: string;
  communities;
  @Output() changePhoto: EventEmitter<any> = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService,
    private currentSessionService: CurrentSessionService
  ) {
  }

  emitChangePhoto(photo) {
    this.changePhoto.emit(photo);
  }

  async getCommunityUser(): Promise<any> {
    try {
      if (!this.currentUser) {
        this.currentUser = await this.getUser();
      }
      return this.currentUser.company.community;
    } catch (error) {}
  }

  updateUser(currentUser): Promise<any> {
    this.idUser = this.currentSessionService.getIdUser();
    const url = `${this.urlSapi}/usuarios`;
    return this.httpClient.put(url, currentUser).toPromise();
  }

  async updateInfoUser() {
    this.currentUser = await this.getUser();
  }

  async getInfoUser(): Promise<any> {
    try {
      if (!this.currentUser) {
        this.currentUser = await this.getUser();
      }
      return this.currentUser;
    } catch (error) {}
  }

  private getUser(): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    this.idUser = this.currentSessionService.getIdUser();
    const url = `${this.urlSapi}/usuarios/${this.idUser}`;
    return this.httpClient
      .get(url, { headers: headers }).pipe(
      map((response: any) => response.data))
      .toPromise()
      .catch(err => console.error(err));
  }

  getInfomationUser(idUser) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/usuarios/${idUser}`;
    return this.httpClient
      .get(url, { headers: headers }).pipe(
      map((response: any) => response.data))
      .toPromise()
      .catch(err => console.error(err));
  }

  getCommunities(): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    this.idUser = this.currentSessionService.getIdUser();
    const url = `${this.urlSapi}/perfil/comunidades`;
    return this.httpClient
    .get(url, { headers: headers }).toPromise();
  }

  setCommunities(communities) {
    this.communities = communities;
  }

  getCommunitiesCurrent() {
    return  this.communities;
  }

  preSignup (params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =
    `${this.urlSapi}/preregistro`;
    return this.httpClient.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  contactUserProduct (params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =
    `${this.urlSapi}/storescontact`;
    return this.httpClient.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  contactUserProductPrivate (params) {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders, { storeId: this.configurationService.storeIdPrivate.toString(),
      productId: params.productId.toString()});
    const headers = new HttpHeaders(jsonSapiHeaders);
    console.log(jsonSapiHeaders);
    const url =
    `${this.urlSapi}/storescontactprivate`;
    return this.httpClient.post(url, {} , { headers: headers }).pipe(map((response: any) => response));
  }

  loadUserInfoCode(code) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/preregistro/${code}`;
    return this.httpClient.get(url , { headers: headers }).pipe(map((response: any) => response));
  }

  reSendEmail (params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =
    `${this.urlSapi}/preregistro/reenvio`;
    return this.httpClient.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

  signup (params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =
    `${this.urlSapi}/registro`;
    return this.httpClient.post(url, params, { headers: headers }).pipe(map((response: any) => response));
  }


  getUsers(params): Promise<any> {
    const url = this.urlSapi + '/usuarios?';
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    return this.httpClient
      .get(url, { headers: headers, params: params})
      .toPromise()
      .then((response: any) => {
       /* if (response.body.totalUsuarios) {
         // this.setTotalProducts(response.body.totalProductos);
        }*/
        return response.body;
      });
  }

  changeStatusUserAdmin(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/usuarios/activacion`;
    return this.httpClient.put(url , params, { headers: headers }).pipe(map((response: any) => response));
  }

  reactivateUser(params){
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/ausente`;
    return this.httpClient.put(url, params, { headers: headers }).pipe(map((response: any) => response));
  }

}
