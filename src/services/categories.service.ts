import { CategoryInterface } from './../commons/interfaces/category.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesService {
    categories: CategoryInterface;

    constructor(private httpClient: HttpClient) { }

    async getCategories():Promise<CategoryInterface>{
        if (!this.categories) {
            this.categories = await this.getCategoriesFromServer();
        }
        return this.categories;
    }

    private getCategoriesFromServer():Promise<any>{
        const url = 'https://api.staging.rotalo.co/v1/categories';
        return this.httpClient
                    .get(url)
                    .map( (response: any) => response.data)
                    .toPromise();
    }

}
