import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {
 api = {
    // protocol: 'http',
    'protocol': "https",
    'server': "api.staging.rotalo.co",
    'inactivityLimit': 86400 // seconds
  };


  apiNequi = {
    'protocol': 'http',
    'server': '10.43.1.10:2020',
    'inactivityLimit': 86400 // seconds
  };

  /*api = {
      'protocol': "https",
      'server': "api.rotalo.co",
       'inactivityLimit': 86400 // seconds
  };*/

  jsonApiHeaders = {
    'Accept': "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json"
  };


  jsonNequiHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  constructor() {}

  getBaseUrl(): string {
    return this.api.protocol + '://' + this.api.server;
  }

  getBaseUrlNequi(): string {
    return this.apiNequi.protocol + '://' + this.apiNequi.server;
  }

  getJsonApiHeaders() {
    return this.jsonApiHeaders;
  }

  getJsonNequiHeaders() {
    return this.jsonNequiHeaders;
  }
}
