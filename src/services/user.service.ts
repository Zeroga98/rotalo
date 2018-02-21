import { HttpClient } from '@angular/common/http';
import { UserInterface } from './../commons/interfaces/user.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
    currentUser: UserInterface;

    constructor(private httpClient: HttpClient) { }

    async getCommunityUser(): Promise<any> {
        try {
            if (!this.currentUser) {
                this.currentUser = await this.getUser();
            }
            return this.currentUser.company.community;
        } catch (error) {
        }
    }

    private getUser(): Promise<any> {
        const url =  'https://api.staging.rotalo.co/v1/users/3067';
        return  this.httpClient
                    .get(url)
                    .map((response: any) => response.data)
                    .toPromise()
                    .catch( err => console.error(err));
    }

}
