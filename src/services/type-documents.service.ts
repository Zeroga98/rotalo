import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TypeDocumentsService {
  readonly url = this.configurationService.getBaseUrl() + '/v1/type_documents';
  constructor(private http: HttpClient,
    private configurationService: ConfigurationService) { }

    getTypeDocument(): Promise<any> {
      const url = `${this.url}`;
      return this.http.get(url).toPromise().then((response: any) => response.data);
  }

}
