
import {map} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TypeDocumentsService {
  readonly url = this.configurationService.getBaseUrl() + '/type_documents';
  private readonly urlSapi = this.configurationService.getBaseSapiUrl();
  constructor(private http: HttpClient,
    private configurationService: ConfigurationService) { }
/*
    getTypeDocument(): Promise<any> {
      const url = `${this.url}`;
      return this.http.get(url).toPromise().then((response: any) => response.data);
    }
*/
    getTypeDocument(params) {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const urlSapi = `${this.urlSapi}`;
      const url = urlSapi + '/preregistro/tipodocumentos';
      return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
    }

}
