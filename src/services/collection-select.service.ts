
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ConfigurationService } from "../services/configuration.service";

@Injectable()
export class CollectionSelectService {
    collection: Array<any> = undefined;
    includes: Array<any> = [];
    states: Array<any> = [];
    brandsCars: Array<any> = undefined;
    brandsMoto: Array<any> = undefined;
    readonly urlSapi = this.configurationService.getBaseSapiUrl();
    constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

    async isReady() {
        if(this.collection) return this.collection;
        try {
            const response = await this.getCollection();
            this.collection = response.data;
            return this.collection;
        } catch (error) {
            console.log(error, 'fail get collection');
            return error;
        }
    }

  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.collection) {
        const countries = this.collection.map(value => {
          return {
            id: value.id,
            name: value.name,
          };
        });
        resolve(countries);
      }
    });
  }

    async getStatesById(id: number) {
      const country = await this.getCountryById(id);
        this.states = country.states;
        return this.states.map( state => {
            return {
                id: state.id,
                name: state.name
            };
        });
    }

  async getCitiesById(id: number) {
    const state: any = await this.getStateById(id);
    const cities = state.cities;
    if (cities.length) {
      return cities.map(city => {
        return {
          id: city.id,
          name: city.name
        };
      });
    } else {
      const cityArray = [state.cities];
      return cityArray;
    }
  }

  getStateById(id: number) {
    return new Promise((resolve, reject) => {
      if (this.states) {
        const states = this.states.filter(value => {
          return value.id == id;
        });
        resolve(states[0]);
      }
    });
  }

  getCountryById(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.collection) {
        const country = this.collection.filter(value => {
          return value.id == id;
        });
        resolve(country[0]);
      }
    });
  }

    private getCollection(filterActive: string = 'true'): Promise<any> {
        const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
        const headers = new HttpHeaders(jsonSapiHeaders);
        const url = this.urlSapi + '/general/locations/';
        return this.http.get(url, { headers: headers , params: {'filter[active]': filterActive }, }).toPromise();
    }

    getVehicles(params) {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = this.urlSapi + '/categorias/vehiculos';
      return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
    }

    getSizes(params) {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = this.urlSapi + '/categorias/tallas';
      return this.http.post(url, params, { headers: headers }).pipe(map((response: any) => response));
    }

    setBrandsCars(brands) {
      this.brandsCars = brands;
    }

    getBrandsCars() {
     return this.brandsCars;
    }

    setBrandsMotos(brands) {
      this.brandsMoto = brands;
    }

    getBrandsMotos() {
     return this.brandsMoto;
    }

}
