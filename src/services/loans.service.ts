import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LoansService {
    private readonly url: string = 'https://api.staging.rotalo.co/v1/loan_requests'
    
    constructor(private http:HttpClient) { }

    loanWithSufi(amount: number | string):Promise<any>{
        const params = this.buildParams(amount);
        console.log("params: ", params);
        return this.http.post(this.url, params).toPromise();
    }

    private buildParams(amount: number | string){
		return {
			data:{
				attributes:{
                    amount: amount
				}, 
				type: 'loan-requests'
			}
		}
	}

}