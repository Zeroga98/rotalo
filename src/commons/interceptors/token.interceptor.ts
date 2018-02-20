import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone({
            setHeaders:{
                Authorization: this.getToken()
            }
        });
        return next.handle(request);
    }

    private getToken():string{
        return 'P5m83ssEmiTndkJAx9sr';
    }
}
