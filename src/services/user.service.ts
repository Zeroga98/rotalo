
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserInterface } from './../commons/interfaces/user.interface';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';
import { CurrentSessionService } from '../services/current-session.service';
import { UserRequestInterface } from '../commons/interfaces/user-request.interface';

@Injectable()
export class UserService {
  //readonly url: string = `${this.configurationService.getBaseUrl()}/users`;
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

  /*saveUser(params: UserRequestInterface): Promise<any> {
    return this.httpClient
      .post(this.urlSapi, {
        data: {
          attributes: params,
          type: 'users'
        }
      })
      .toPromise();
  }*/

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

}
