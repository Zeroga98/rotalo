import { Injectable } from "@angular/core";

@Injectable()
export class CurrentSessionService {
  constructor() {}

  setSession(currentUser: Object): void {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
  clearSession(): void {
    localStorage.setItem('currentUser', JSON.stringify({}));
  }
  currentUser(): any {
    return  localStorage.getItem('currentUser');
  }
  authToken (): string {
    return JSON.parse(this.currentUser()).attributes['auth-token'];
  }
}
