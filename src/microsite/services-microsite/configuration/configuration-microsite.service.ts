import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationMicrositeService {
  jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'userId': '3172'
  };

  getHeaders() {
    return this.jsonHeaders;
  }
}
