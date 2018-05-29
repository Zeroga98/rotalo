import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';

@Injectable()
export class NavigationService {
    countryChanged: EventEmitter<any> = new EventEmitter();
    private currentCountryId: number = 0;
    private messagesUnRead = 0;
    constructor(private currentSession: CurrentSessionService) {
        this.currentCountryId = this.currentSession.currentUser() ? this.currentSession.currentUser()['countryId'] : null;
    }

    setCountry(country){
        this.currentCountryId = country.id;
        this.countryChanged.emit(country);
    }

    getCurrentCountryId(): number {
        return this.currentCountryId;
    }

    setCurrentCountryId(id: number){
        this.currentCountryId = id;
    }

    setMessagesUnRead(message) {
      this.messagesUnRead = message;
    }

    getMessagesUnRead() {
      return this.messagesUnRead;
    }

}
