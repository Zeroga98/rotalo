import { Injectable } from "@angular/core";

@Injectable()
export class ConfigurationService {
/*Staging*/

api = {
    protocol: "https",
    server: "apistg.rotalo.co:1443/gateway/v1",
    inactivityLimit: 86400 // seconds
  };

  sapi = {
    protocol: "https",
    server: "apistg.rotalo.co:1443/gateway",
    inactivityLimit: 86400 // seconds
  };

/*Desarrollo*/
/*
api = {
    protocol: "https",
    server: "api.dev.rotalo.co:1443/gateway/v1",
    inactivityLimit: 86400 // seconds
  };

  sapi = {
    protocol: "https",
    server: "api.dev.rotalo.co:1443/gateway",
    inactivityLimit: 86400 // seconds
  };

*/
/*Produccion*/
/*
api = {
    protocol: "https",
    server: "apirtl.rotalo.co/gateway/v1",
    inactivityLimit: 86400 // seconds
  };

  sapi = {
    protocol: "https",
    server: "apirtl.rotalo.co/gateway",
    inactivityLimit: 86400 // seconds
  };
*/
  jsonApiSapiHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  jsonApiHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json"
  };

  jsonNequiHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  constructor() {}

  getBaseUrl(): string {
    return this.api.protocol + "://" + this.api.server;
  }

  getBaseSapiUrl(): string {
    return this.sapi.protocol + "://" + this.sapi.server;
  }

  getJsonApiHeaders() {
    return this.jsonApiHeaders;
  }

  getJsonSapiHeaders() {
    return this.jsonApiSapiHeaders;
  }
}
