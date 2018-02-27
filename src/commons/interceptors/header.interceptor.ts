import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request: HttpRequest<any>;
        console.log("MEthod: ", req.method);
        if (this.isNecessaryHeader(req)) {
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

    private isNecessaryHeader(req: HttpRequest<any>): boolean{
      const ablesMethods = ['post', 'put'];
      const method = req.method.toLocaleLowerCase();
      return ablesMethods.includes(method) && !req.url.includes('photos');
    }
}
