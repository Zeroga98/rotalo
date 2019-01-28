import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentSessionService } from '../../services/current-session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private currentSessionService: CurrentSessionService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + this.getToken()
            }
        });
        return next.handle(request);
    }

    private getToken(): string{
        return this.currentSessionService.authToken();
    }
}
