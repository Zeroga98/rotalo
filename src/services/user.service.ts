import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserInterface } from "./../commons/interfaces/user.interface";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../services/configuration.service";
import { CurrentSessionService } from "../services/current-session.service";

@Injectable()
export class UserService {
  currentUser: UserInterface;
  idUser: string;
  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService,
    private currentSessionService: CurrentSessionService
  ) {
    this.idUser = this.currentSessionService.getIdUser();
  }

  async getCommunityUser(): Promise<any> {
    try {
      if (!this.currentUser) {
        this.currentUser = await this.getUser();
      }
      return this.currentUser.company.community;
    } catch (error) {}
  }

  async getInfoUser(): Promise<any> {
    try {
      if (!this.currentUser) {
        this.currentUser = await this.getUser();
      }
      return this.currentUser;
    } catch (error) {}
  }

  updateUser(currentUser): Promise <any> {
    const jsonApiHeaders = this.configurationService.getJsonApiHeaders();
    const url = this.configurationService.getBaseUrl() + '/v1/users/' + this.idUser;
    const headers = new HttpHeaders(jsonApiHeaders);
    return this.httpClient.put(url, currentUser, { headers: headers }).toPromise();
  }

  private getUser(): Promise<any> {
    const url = this.configurationService.getBaseUrl() + '/v1/users/' + this.idUser;
    return this.httpClient
      .get(url)
      .map((response: any) => response.data)
      .toPromise()
      .catch(err => console.error(err));
  }
}
