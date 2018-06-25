import { Injectable } from "@angular/core";
import { ConfigurationService } from "../../services/configuration.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ModalFeedBackService {
  private modals: any[] = [];
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open();
  }

  close(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }


  sendEmail(params) {
    const headersSapi = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(headersSapi);
    const url = this.urlSapi + '/general/contactanos';
    return this.http
      .post(url, params , { headers: headers })
      .map((response: any) => response);
  }

}
