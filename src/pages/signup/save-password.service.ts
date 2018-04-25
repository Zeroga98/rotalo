import { Injectable } from '@angular/core';

@Injectable()
export class SavePasswordService {
private passwordSave: String;
constructor() { }

 setPassword(password){
  this.passwordSave = password;
 }

 getPassword(): String{
   return this.passwordSave;
 }

}
