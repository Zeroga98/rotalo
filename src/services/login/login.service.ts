import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from '../../services/configuration.service';
import { CurrentSessionService } from '../../services/current-session.service';


@Injectable()
export class LoginService {
  constructor(private http: HttpClient,
    private configurationService: ConfigurationService,
    private currentSessionService: CurrentSessionService) {
  }

  isLoggedIn(): boolean {
    console.log(this.currentSessionService.currentUser());
    return !!(this.currentSessionService.currentUser());
  }

  logout(): void {
    this.currentSessionService.clearSession();
  }

  loginUser(currentUser): Promise<any> {
    const url =  this.configurationService. getBaseUrl() + '/sessions';
    return this.http.post(url, currentUser).toPromise();
  }

  loginSapiUser(currentUser): Promise<any> {
    const jsonApiSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const url =  this.configurationService.getBaseSapiUrl() + '/sapi/v1/auth' ;
    const headers = new HttpHeaders(jsonApiSapiHeaders);
    return this.http.post(url, currentUser, { headers: headers }).toPromise();
  }

}
