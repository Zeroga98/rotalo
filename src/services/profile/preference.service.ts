import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable()

export class PreferenceService {
  readonly urlSapi = this.configurationService.getBaseSapiUrl();

  constructor(private http: HttpClient,
    private configurationService: ConfigurationService) { }

    getPreference(): Promise<any> {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = `${this.urlSapi}/centro/rotalo/settings`;
      return  this.http.get(url, { headers: headers }).toPromise();
    }

    updatePrefarence(currentPreference): Promise<any> {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = `${this.urlSapi}/centro/rotalo/settings`;
      return  this.http.put(url, currentPreference, { headers: headers }).toPromise();
    }
}