import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable()
export class PreferenceService {
  readonly urlSapi = this.configurationService.getBaseSapiUrl();

  constructor(private http: HttpClient,
    private configurationService: ConfigurationService) { }

    getPreference(): Promise<any> {
      //const url =  this.configurationService. getBaseUrl() + '/preferences';
      //return  this.http.get(url).toPromise();

      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = `${this.urlSapi}/centro/rotalo/settings`;
      /*const url = `http://localhost:2024/api/v1/centro/rotalo/settings`;*/
      return this.http.get(url, { headers: headers }).toPromise();
    }

    updatePrefarence(currentPreference): Promise<any> {
      /*const jsonApiHeaders = this.configurationService.getJsonApiHeaders();
      const url =  this.configurationService. getBaseUrl() + '/preferences';
      const headers = new HttpHeaders(jsonApiHeaders);
      return  this.http.put(url, currentPreference, { headers: headers }).toPromise();*/

      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = `${this.urlSapi}/centro/rotalo/settings`;
      /*const url = `http://localhost:2024/api/v1/centro/rotalo/settings`;*/
      return  this.http.put(url, currentPreference, { headers: headers }).toPromise();
    }

}
