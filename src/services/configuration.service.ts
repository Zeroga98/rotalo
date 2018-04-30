import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {
 /* api = {
    // protocol: 'http',
    'protocol': "https",
    'server': "api.staging.rotalo.co",
    'inactivityLimit': 86400 // seconds
  };*/

 /*
  apiNequi = {
    'protocol': 'https',
    'server': '10.43.1.10:2020',
    'inactivityLimit': 86400 // seconds
  };


  apiSapi = {
    'protocol': 'https',
    'server': '10.43.1.10:1443',
    'inactivityLimit': 86400 // seconds
  };

  api = {
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

  jsonNequiHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With',
    'Access-Control-Allow-Credentials': 'true',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  constructor() {}

  getBaseUrl(): string {
    return this.api.protocol + '://' + this.api.server;
  }

  getBaseSapiUrl(): string {
    return this.sapi.protocol + '://' + this.sapi.server;
  }

  getJsonApiHeaders() {
    return this.jsonApiHeaders;
  }

  getJsonSapiHeaders() {
    return this.jsonApiSapiHeaders;
  }

}
