import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()
export class NavigationService {
    countryChanged: EventEmitter<any> = new EventEmitter();

    constructor() { }

    setCountry(country){
        console.log("Entre a emitir");
        this.countryChanged.emit(country);
    }

}