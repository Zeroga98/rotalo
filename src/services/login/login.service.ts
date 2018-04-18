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
    return !!(this.currentSessionService.currentUser());
  }

  logout(): void {
    this.logOutService(this.currentSessionService.authToken()) .subscribe(
      resonse => {
        this.currentSessionService.clearSession();
        location.reload();
        console.log(resonse);
      },
      error => {
        this.currentSessionService.clearSession();
        location.reload();
        console.log(error);
      }
    );
  }

  logOutService (token) {
    const url = this.configurationService.getBaseUrlSapi() + `/gateway/sapi/v1/logout` + `?token=${token}`;
    const jsonNequiHeaders = this.configurationService.getJsonNequiHeaders();
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.http.get(url, { headers: headers}).map( (response: any) =>
      response
    );
  }

  loginUser(currentUser): Promise<any> {
    const url =  this.configurationService. getBaseUrl() + '/v1/sessions';
    return this.http.post(url, currentUser).toPromise();
  }
}
