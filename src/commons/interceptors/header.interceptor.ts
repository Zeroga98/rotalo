import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request: HttpRequest<any>;
        /** Deuda Tecnica Verificar otra forma de evitar que en servicio de photos no incluya los headers */
        if(req.method.toLocaleLowerCase() == 'post' && !req.url.includes('photos')){
            request = req.clone({
                setHeaders:{
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json'
                }
            });
        }else{
            request = req.clone();
        }
        return next.handle(request);
    }
}