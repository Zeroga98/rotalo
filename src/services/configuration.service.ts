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

   /*api = {
      'protocol': "https",
      'server': "api.rotalo.co",
       'inactivityLimit': 86400 // seconds
  };*/

  api = {
    'protocol': "https",
    'server': "api.dev.rotalo.co:1443/gateway/v1",
     'inactivityLimit': 86400 // seconds
  };

  sapi = {
    'protocol': "https",
    'server': "api.dev.rotalo.co:1443/gateway",
     'inactivityLimit': 86400 // seconds
  };

  jsonApiSapiHeaders = {
    'Accept': "application/json",
    "Content-Type": "application/json"
  };

  jsonApiHeaders = {
    'Accept': "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json"
  };

  constructor() {}

  getBaseUrl(): string {
    return this.api.protocol + '://' + this.api.server;
  }

  getBaseSapiUrl(): string {
    return this.api.protocol + '://' + this.sapi.server;
  }

  getJsonApiHeaders() {
    return this.jsonApiHeaders;
  }

  getJsonSapiHeaders() {
    return this.jsonApiSapiHeaders;
  }

}
