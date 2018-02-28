import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable()
export class PreferenceService {

  constructor(private http: HttpClient,
    private configurationService: ConfigurationService) { }

    getPreference(): Promise<any> {
      const url =  this.configurationService. getBaseUrl() + '/v1/preferences';
      return  this.http.get(url).toPromise();
    }

    updatePrefarence(currentPreference): Promise<any> {
      const jsonApiHeaders = this.configurationService.getJsonApiHeaders();
      const url =  this.configurationService. getBaseUrl() + '/v1/preferences';
      const headers = new HttpHeaders(jsonApiHeaders);
      return  this.http.put(url, currentPreference, { headers: headers }).toPromise();
    }

}
