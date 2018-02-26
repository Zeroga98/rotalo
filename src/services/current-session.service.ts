import { Injectable } from "@angular/core";

@Injectable()
export class CurrentSessionService {
  constructor() {}

  setSession(currentUser: Object): void {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
  clearSession(): void {
    localStorage.removeItem('currentUser');
  }
  currentUser(): any {
    return  localStorage.getItem('currentUser') || null;
  }
  authToken (): string {
    if (this.currentUser() !== null) {
      return JSON.parse(this.currentUser())['auth-token'];
    }
    return '';
  }
  getIdUser (): string {
    if (this.currentUser() !== null) {
      return JSON.parse(this.currentUser())['id'];
    }
    return '';
  }
}
