import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LoansService {
  //private readonly url = this.configurationService.getBaseUrl() + '/loan_requests';
  constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

  /*loanWithSufi(amount: number | string): Promise<any> {
    const params = this.buildParams(amount);
    return this.http.post(this.url, params).toPromise();
  }*/

  private buildParams(amount: number | string) {
    return {
      data: {
        attributes: {
          amount: amount
        },
        type: 'loan-requests'
      }
    };
  }
}
