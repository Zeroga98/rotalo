
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class NormalizeInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(map( (evt: HttpEvent<any> ) => {
            let newResponse: HttpEvent<any> ;
            if (this.isNecessaryNormalize(req)) {
              if (evt instanceof HttpResponse && evt.body) {
                this.normalizeResponse(evt.clone());
                this.cleanAttributes(evt.clone());
              }
            }
            return evt;
        }));
    }
    /**Valida si el request es de la API de nequi---en este caso no se debe aplicar el interceptor**/
    private isNecessaryNormalize(req: HttpRequest<any>): boolean {
      const method = req.method.toLocaleLowerCase();

      if (method.includes('put') && req.url.includes('products')) {
        return false;
      }
      return !req.url.includes('auth')
      && !req.url.includes('nequi')
      && !req.url.includes('logout')
      && !req.url.includes('refer')
      && !req.url.includes('perfil')
      && !req.url.includes('productos')
      && !req.url.includes('centro')
      && !req.url.includes('faq')
      && !req.url.includes('comunidades')
      && !req.url.includes('ofertas')
      && !req.url.includes('convenios')
      && !req.url.includes('categorias')
      && !req.url.includes('preregistro')
      && !req.url.includes('registro')
      && !req.url.includes('credenciales')
      && !req.url.includes('compras')
      && !req.url.includes('creditos')
      && !req.url.includes('carrito')
      && !req.url.includes('orden')
      && !req.url.includes('ordenes')
      && !req.url.includes('imagenes')
      && !req.url.includes('campaigns')
      && !req.url.includes('banners')
      && !req.url.includes('password')
      && !req.url.includes('sufi')
      && !req.url.includes('terminos')
      && !req.url.includes('settings')
      && !req.url.includes('envios-correos')
      && !req.url.includes('contactanos')
      && !req.url.includes('ofertas')
      && !req.url.includes('detalle')
      && !req.url.includes('sugerencias')
      && !req.url.includes('usuarios?')
      && !req.url.includes('activacion')
      && !req.url.includes('cargas')
      && !req.url.includes('ausente')
      && !req.url.includes('storescontact')
      ;
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
          if (item) {
            const keys = Object.keys(item.relationships || {});
            keys.forEach(key => {
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
          }
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
