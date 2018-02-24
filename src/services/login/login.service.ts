import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from '../../services/configuration.service';


@Injectable()
export class LoginService {
  currentUser = null;
  constructor(private http: HttpClient,
    private configurationService: ConfigurationService) {
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }

  loginUser(currentUser): Promise<any> {
    const url =  this.configurationService. getBaseUrl() + '/v1/sessions';
    return this.http.post(url, currentUser).toPromise();
  }
}
