
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class FrequentlyAskedQuestionsService {

  constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }
  readonly urlSapi = this.configurationService.getBaseSapiUrl();

  getFrequentlyAskedQuestions(idCountry) {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders);
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/general/faq?pais=' + idCountry;
    return this.http.get(url, { headers: headers }).pipe(map((response: any) => response.body));
  }

}
