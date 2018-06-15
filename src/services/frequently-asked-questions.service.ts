import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class FrequentlyAskedQuestionsService {

  constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }
  readonly urlSapi = this.configurationService.getBaseSapiUrl();

  getFrequentlyAskedQuestions() {
    let jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    jsonSapiHeaders = Object.assign(jsonSapiHeaders);
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = this.urlSapi + '/general/faq?pais=1';
    return this.http.get(url, { headers: headers }).map((response: any) => response.body);
  }

}