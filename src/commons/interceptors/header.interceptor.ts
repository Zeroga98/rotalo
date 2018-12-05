import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request: HttpRequest<any>;
        /** Deuda Tecnica Verificar otra forma de evitar que en servicio de photos no incluya los headers */
        if (this.isNecessaryHeader(req)) {
            request = req.clone({
                setHeaders: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                }
            });
        }else {
            request = req.clone();
        }
        return next.handle(request);
    }

    private isNecessaryHeader(req: HttpRequest<any>): boolean{
      const ablesMethods = ['post', 'put'];
      const method = req.method.toLocaleLowerCase();
          /**Valida si el request es de la API de nequi---en este caso no se debe aplicar el interceptor**/
      return ablesMethods.includes(method) && !req.url.includes('photos') && !req.url.includes('auth')
      && !req.url.includes('nequi')
      && !req.url.includes('sapi')
      && !req.url.includes('refer')
      && !req.url.includes('perfil')
      && !req.url.includes('productos')
      && !req.url.includes('centro')
      && !req.url.includes('general')
      && !req.url.includes('ofertas')
      && !req.url.includes('convenios')
      && !req.url.includes('categorias')
      && !req.url.includes('preregistro')
      && !req.url.includes('registro')
      && !req.url.includes('credenciales')
      && !req.url.includes('compras')
      && !req.url.includes('creditos')
      && !req.url.includes('carrito')
      && !req.url.includes('orden');
    }
}
