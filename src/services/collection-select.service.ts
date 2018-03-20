import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ConfigurationService } from "../services/configuration.service";

@Injectable()
export class CollectionSelectService {
    collection: Array<any> = [];
    includes: Array<any> = [];
    states: Array<any> = [];
    constructor(private http: HttpClient, private configurationService: ConfigurationService) {}

    async isReady() {
        try {
            const response = await this.getCollection();
            this.collection = response.data;
            return this.collection;
        } catch (error) {
            return error;
        }
    }

    getCountries(): Promise<any> {
        return new Promise ((resolve, reject) => {
            const countries = this.collection.map( value => {
                return {
                    id: value.id,
                    name: value.name,
                };
            });
            resolve(countries);
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
        return cities.map( city => {
            return {
                id: city.id,
                name: city.name
            };
        });
    }

    getStateById(id: number) {
        return new Promise((resolve, reject) => {
            const states = this.states.filter( value => {
                return value.id == id;
            });
            resolve(states[0]);
        });
    }

    getCountryById(id: number): Promise <any> {
        return new Promise((resolve, reject) => {
            const country = this.collection.filter( value => {
                return value.id == id;
            });
            resolve(country[0]);
        });
    }

    private getCollection(filterActive: string = 'true'): Promise<any> {
        const url = this.configurationService.getBaseUrl() + '/v1/locations/';
        return this.http.get(url, {
            params: {
                'filter[active]': filterActive
            },
        }).toPromise();
    }
}
