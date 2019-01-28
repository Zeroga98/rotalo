
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ResumeRotaloCenterService {
  readonly url = this.configurationService.getBaseSapiUrl() + `/centro/rotalo/resumenes`;
  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService
  ) {}

  resumeRotaloCenter(idUser) {
    let jsonNequiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonNequiHeaders = Object.assign(jsonNequiHeaders, {userid: idUser} );
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.httpClient
      .get(this.url, { headers: headers }).pipe(
      map((response: any) => response));
  }
}
