import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {
 /* api = {
    // protocol: 'http',
    'protocol': "https",
    'server': "api.staging.rotalo.co",
    // server: 'api.rotalo.dev.localhost:3000',
    'inactivityLimit': 86400 // seconds
  };*/
   api = {
      'protocol': "https",
      'server': "api.rotalo.co",
       'inactivityLimit': 86400 // seconds
    };
  jsonApiHeaders = {
    'Accept': "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json"
  };
  constructor() {}

  getBaseUrl(): string {
    return this.api.protocol + '://' + this.api.server;
  }
  getJsonApiHeaders() {
    return this.jsonApiHeaders;
  }
}
