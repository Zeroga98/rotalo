import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';

@Injectable()
export class ChangePasswordService {

constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }

  changePass(currentUser): Promise<any> {
    const jsonApiHeaders = this.configurationService.getJsonApiHeaders();
    const url =  this.configurationService. getBaseUrl() + '/passwords';
    const headers = new HttpHeaders(jsonApiHeaders);
    return this.http.put(url, currentUser, { headers: headers }).toPromise();
  }

  changePassProfile(currentUser): Promise<any> {
    const jsonApiHeaders = this.configurationService.getJsonApiHeaders();
    const url =  this.configurationService. getBaseUrl() + '/passwords/change';
    const headers = new HttpHeaders(jsonApiHeaders);
    return this.http.post(url, currentUser, { headers: headers }).toPromise();
  }

}
