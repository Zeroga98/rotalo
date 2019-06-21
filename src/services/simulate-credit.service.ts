import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class SimulateCreditService {
readonly urlSapi = this.configurationService.getBaseSapiUrl();
private readonly initialQuota = 'initialQuota';
private readonly months = 'months';

constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }

  simulateCredit(infoVehicle): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =  this.urlSapi + '/sufi/simular';
    return this.http.post(url, infoVehicle, { headers: headers }).toPromise();
  }

  sendSimulateCredit(infoVehicle) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url =  this.urlSapi + '/sufi/enviar';
    return this.http.post(url, infoVehicle, { headers: headers }).toPromise();
  }

  setInitialQuota(_initialQuota) {
    localStorage.setItem(this.initialQuota, _initialQuota);
  }

  getInitialQuota() {
    return localStorage.getItem(this.initialQuota);
  }

  setMonths(_months){
    localStorage.setItem(this.months, _months);
  }

  getMonths(){
    return localStorage.getItem(this.months);
  }


}
