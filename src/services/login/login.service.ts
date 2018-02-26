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
    this.currentSessionService.clearSession();
  }

  loginUser(currentUser): Promise<any> {
    const url =  this.configurationService. getBaseUrl() + '/v1/sessions';
    return this.http.post(url, currentUser).toPromise();
  }
}
