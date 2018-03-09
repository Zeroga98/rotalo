import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class SimulateCreditService {

constructor(private http: HttpClient,
  private configurationService: ConfigurationService) { }

  simulateCredit(infoVehicle): Promise<any> {
    const url =  this.configurationService. getBaseUrl() + '/v1/simulate_credits';
    return this.http.post(url, infoVehicle).toPromise();
  }

}
