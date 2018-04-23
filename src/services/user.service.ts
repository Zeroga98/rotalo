import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserInterface } from "./../commons/interfaces/user.interface";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../services/configuration.service";
import { CurrentSessionService } from "../services/current-session.service";
import { UserRequestInterface } from "../commons/interfaces/user-request.interface";

@Injectable()
export class UserService {
  readonly url: string = `${this.configurationService.getBaseUrl()}/users`;
  currentUser: UserInterface;
  idUser: string;

  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService,
    private currentSessionService: CurrentSessionService
  ) {
  }

  async getCommunityUser(): Promise<any> {
    try {
      if (!this.currentUser) {
        this.currentUser = await this.getUser();
      }
      return this.currentUser.company.community;
    } catch (error) {}
  }

  updateUser(currentUser): Promise<any> {
    this.idUser = this.currentSessionService.getIdUser();
    const url = `${this.url}/${this.idUser}`;
    return this.httpClient.put(url, currentUser).toPromise();
  }

  async updateInfoUser() {
    this.currentUser = await this.getUser();
  }

  async getInfoUser(): Promise<any> {
    try {
      if (!this.currentUser) {
        this.currentUser = await this.getUser();
      }
      return this.currentUser;
    } catch (error) {}
  }

  saveUser(params: UserRequestInterface): Promise<any> {
    return this.httpClient
      .post(this.url, {
        data: {
          attributes: params,
          type: "users"
        }
      })
      .toPromise();
  }

  private getUser(): Promise<any> {
    this.idUser = this.currentSessionService.getIdUser();
    const url = `${this.url}/${this.idUser}`;
    return this.httpClient
      .get(url)
      .map((response: any) => response.data)
      .toPromise()
      .catch(err => console.error(err));
  }
}
