import { CATEGORIES_ICONS } from './../commons/constants/categories-icons.constant';
import { CategoryInterface } from './../commons/interfaces/category.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from "../services/configuration.service";
import {map} from 'rxjs/operators';

@Injectable()
export class CategoriesService {
    categories: Array<CategoryInterface>;
    categoriesActive;

    readonly urlSapi = this.configurationService.getBaseSapiUrl();
    constructor(private httpClient: HttpClient, private configurationService: ConfigurationService) { }

    getCategoriesActive () {
      return this.categoriesActive;
    }

    setCategoriesActive(categoriesActive) {
      this.categoriesActive = categoriesActive;
    }

    getCategoriesActiveServer() {
      const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
      const headers = new HttpHeaders(jsonSapiHeaders);
      const url = this.urlSapi + '/categorias';
      return this.httpClient.get(url, { headers: headers })
      .pipe(map((response: any) => {
        if (response.body.categorias) {
           const newCategories = response.body.categorias.map((category) => {
            const interfaceCategory = {
              id:  category.id,
              name: category.nombre,
              subcategories: this.changeNameSubcategory(category.subcategorias),
              productsActives: category.productosActivos,
              porcentajeMinimoBajoPrecio: category.porcentajeMinimoBajoPrecio,
              url: category.url
            };
            return interfaceCategory;
          });
         return this._asociateIcon(newCategories);
        }
        return response;
      }));
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

    private _asociateIcon(categories: Array<any>): Array<any> {
        return categories.map( (category: any, index: number) => Object.assign(category, CATEGORIES_ICONS[index]));
    }

}
