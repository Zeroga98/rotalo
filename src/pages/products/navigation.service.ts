import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()
export class NavigationService {
    countryChanged: EventEmitter<any> = new EventEmitter();

    constructor() { }

    setCountry(country){
        this.countryChanged.emit(country);
    }

}