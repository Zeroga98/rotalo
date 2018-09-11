import { CATEGORIES_ICONS } from './../commons/constants/categories-icons.constant';
import { CategoryInterface } from './../commons/interfaces/category.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from "../services/configuration.service";

@Injectable()
export class CategoriesService {
    categories: Array<CategoryInterface>;
    categoriesActive: Array<any>;

    readonly urlSapi = this.configurationService.getBaseSapiUrl();
    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    async getCategories(): Promise<any> {
        if (!this.categories) {
            this.categories = await this.getCategoriesFromServer();
            this.categories = this._asociateIcon(this.categories);
        }
        return this.categories;
    }

    getCategoriesActiveServer() {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = this.urlSapi + '/categorias';
      return this.httpClient.get(url, { headers: headers }).map((response: any) => {
        if (response.body.categorias) {
           const newCategories = response.body.categorias.map((category) => {
            const interfaceCategory = {
              id:  category.id,
              name: category.nombre,
              subcategories: this.changeNameSubcategory(category.subcategorias),
              productsActives: category.productosActivos,
              url: category.url
            };
            return interfaceCategory;
          });
         return this._asociateIcon(newCategories);
        }
        return response;
      } );
    }

    changeNameSubcategory (subcategories) {
       return subcategories.map((subcategory) => {
        const interfaceSubCategory = {
          id:  subcategory.id,
          name: subcategory.nombre,
          productsActives: subcategory.productosActivos,
          url: subcategory.url
        };
        return interfaceSubCategory;
      });
    }

    private getCategoriesFromServer(): Promise<any> {

        const url = this.configurationService.getBaseUrl() + '/categories';
        return this.httpClient
                    .get(url)
                    .map( (response: any) => response.data)
                    .toPromise();
    }

    private _asociateIcon(categories:Array<any>): Array<any>{
        return categories.map( (category: any, index: number) => Object.assign(category, CATEGORIES_ICONS[index]));
    }

}
