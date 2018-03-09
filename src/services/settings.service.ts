import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SettingsService {
  readonly url = this.configurationService.getBaseUrl() + '/v1/settings';
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

  getSettings(): Promise<any> {
    return this.http.get(this.url).toPromise().then( (response: any) => response.data);
  }

}
