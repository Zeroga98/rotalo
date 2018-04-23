import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable()
export class RecoverService {

constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }

  recoverUser(user): Promise<any> {
    const jsonApiHeaders = this.configurationService.getJsonApiHeaders();
    const url =  this.configurationService. getBaseUrl() + '/passwords/recover';
    const headers = new HttpHeaders(jsonApiHeaders);
    return this.http.post(url, user, { headers: headers }).toPromise();
  }
}
