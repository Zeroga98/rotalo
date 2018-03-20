import { Injectable } from "@angular/core";
import { SessionUserInterface } from "../commons/interfaces/session.interface";

@Injectable()
export class CurrentSessionService {
  constructor() {}

  setSession(currentUser: Object): void {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  clearSession(): void {
    localStorage.removeItem('currentUser');
  }

  currentUser():  SessionUserInterface {
    const currentUser: SessionUserInterface = JSON.parse(localStorage.getItem('currentUser'));
    return  currentUser || null;
  }

  authToken (): string {
    if (this.currentUser() !== null) {
      return this.currentUser()['auth-token'];
    }
    return '';
  }
  getIdUser (): string {
    if (this.currentUser() !== null) {
      return `${this.currentUser()['id']}`;
    }
    return '';
  }
}
