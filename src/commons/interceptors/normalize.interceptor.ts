import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class NormalizeInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).map( (evt: HttpEvent<any> ) => {
            let newResponse: HttpEvent<any> ;
            if (this.isNecessaryNormalize(req)) {
              if (evt instanceof HttpResponse && evt.body) {
                this.normalizeResponse(evt.clone());
                this.cleanAttributes(evt.clone());
              }
            }
            return evt;
        });
    }
    /**Valida si el request es de la API de nequi---en este caso no se debe aplicar el interceptor**/
    private isNecessaryNormalize(req: HttpRequest<any>): boolean {
      return !req.url.includes('nequi');
    }

    private normalizeResponse(response: HttpResponse<any>) {
      if (response.body) {
        const body = response.body;
        const data: Array<any> = response.body.data;
        const includes: Array<any> = response.body.included;
        this.fillDataWithRelationships(this.checkData(data), includes);
      }
    }
    private cleanAttributes(response: HttpResponse<any>) {
      if (response.body) {
        let data: Array<any> = this.checkData(response.body.data);
        response.body.data = data.map( item => {
            item.attributes.id = item.id;
            return item.attributes;
        });
        response.body.data = response.body.data.length == 1 ? response.body.data[0] : response.body.data;
      }
    }
    private fillDataWithRelationships(data, includes){
        return data.map( item => {
            const keys = Object.keys(item.relationships || {});
            keys.forEach( key => {
                let relacioneToAdd = [];
                let relaciones = item.relationships[key].data;
                Array.isArray(relaciones) ? '' : relaciones = [relaciones];
                relaciones.forEach(element => {
                    let newResource = this.getInfoInclude(element, includes);
                    relacioneToAdd.push(newResource);
                });
                let value = this.fillDataWithRelationships(relacioneToAdd, includes);
                item.attributes[key] = value.length == 1 ? value[0] : value;
            });
            item.attributes.id = item.id;
            item = item.attributes;
            return item;
        });
    }
    private getInfoInclude(value, includes){
        return includes.find(resource => {
            return resource.id == value.id && resource.type == value.type;
        });
    }

    private checkData(data:any){
        return Array.isArray(data) ? data : [data];
    }
}
