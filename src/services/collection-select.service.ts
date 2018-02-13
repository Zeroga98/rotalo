import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class CollectionSelectService {
    collection: Array<any> = [];
    includes: Array<any> = [];
    states: Array<any> = [];
    constructor(private http: HttpClient) {}

    async isReady() {
        try {
            const response = await this.getCollection();
            this.includes = response.included;
            this.collection = response.data;
            console.log(this.collection);
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
                    name: value.attributes.name
                };
            });
            resolve(countries);
        });
    }

    async getStatesById(id: number) {
        const country = await this.getCountryById(id);
        const idRelationships = this.getIdArrayRelationships(country.relationships.states.data);
        this.states = this.includes.filter( value => {
            return value.type == 'states' && idRelationships.indexOf(value.id) != -1;
        });
        return this.states.map( state => {
            return {
                id: state.id,
                name: state.attributes.name
            };
        });
    }

    async getCitiesById(id: number) {
        const state: any = await this.getStateById(id);
        const idRelationships = this.getIdArrayRelationships(state.relationships.cities.data);
        const cities = this.includes.filter( value => {
            return value.type == 'cities' && idRelationships.indexOf(value.id) != -1;
        });
        return cities.map( city => {
            return {
                id: city.id,
                name: city.attributes.name
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

    private getIdArrayRelationships(relationships: Array<any>): Array<any> {
        return relationships.map( value =>  value.id );
    }

    private getCountryById(id: number): Promise <any> {
        return new Promise((resolve, reject) => {
            const country = this.collection.filter( value => {
                return value.id == id;
            });
            resolve(country[0]);
        });
    }

    private getCollection(filterActive: string = 'true'): Promise<any> {
        const url = 'https://api.staging.rotalo.co/v1/locations/';
        return this.http.get(url, {
            params: {
                'filter[active]': filterActive
            },
        }).toPromise();
    }
}
