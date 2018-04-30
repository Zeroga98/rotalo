import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from "./configuration.service";

@Injectable()
export class ResumeRotaloCenterService {
  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService
  ) {}

  resumeRotaloCenter(idUser) {
    const url = this.configurationService.getBaseSapiUrl() + `/centro/rotalo/resumenes`;
    let jsonNequiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonNequiHeaders = Object.assign(jsonNequiHeaders, {userid: idUser} );
    console.log(jsonNequiHeaders);
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.httpClient
      .get(url, { headers: headers })
      .map((response: any) => response);
  }
}
