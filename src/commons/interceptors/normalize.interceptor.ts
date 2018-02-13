import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class NormalizeInterceptor implements HttpInterceptor {

    constructor(){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
        return next.handle(req).map( (evt:HttpEvent<any> ) => {
            let newResponse;
            if(evt instanceof HttpResponse){
                newResponse = this.normalizeResponse(evt.clone());
            }
            return evt;
        });
    }

    private normalizeResponse(response:HttpResponse<any>){
        const body = response.body
        const data: Array<any> = response.body.data;
        const includes: Array<any> = response.body.included;
        const newData = this.fillDataWithRelationships(data, includes);
        return newData;
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
                item.attributes[key] = this.fillDataWithRelationships(relacioneToAdd, includes);
            })
            return item;
        });
    }

    private getInfoInclude(value, includes){
        return includes.find(resource => {
            return resource.id == value.id && resource.type == value.type;
        });
    }
}