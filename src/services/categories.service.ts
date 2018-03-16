import { CATEGORIES_ICONS } from './../commons/constants/categories-icons.constant';
import { CategoryInterface } from './../commons/interfaces/category.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from "../services/configuration.service";

@Injectable()
export class CategoriesService {
    categories: Array<CategoryInterface>;

    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    async getCategories(): Promise<any>{
        if (!this.categories) {
            this.categories = await this.getCategoriesFromServer();
            this.categories = this._asociateIcon(this.categories);
        }
        return this.categories;
    }

    private getCategoriesFromServer(): Promise<any> {

        const url = this.configurationService.getBaseUrl() + '/v1/categories';
        return this.httpClient
                    .get(url)
                    .map( (response: any) => response.data)
                    .toPromise();
    }

    private _asociateIcon(categories:Array<CategoryInterface>): Array<CategoryInterface>{
        return categories.map( (category: CategoryInterface, index: number) => Object.assign(category, CATEGORIES_ICONS[index]));
    }   

}
