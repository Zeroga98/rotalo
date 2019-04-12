import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class SimulateCreditService {
readonly urlSapi = this.configurationService.getBaseSapiUrl();
initialQuota;
months;

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

  setInitialQuota(initialQuota) {
    this.initialQuota = initialQuota;
  }

  getInitialQuota() {
    return  this.initialQuota;
  }

  setMonths(months){
    this.months = months;
  }

  getMonths(){
    return this.months;
  }


}
