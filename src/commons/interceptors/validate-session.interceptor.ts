import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CurrentSessionService } from '../../services/current-session.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ValidateSessionInterceptor implements HttpInterceptor {

    constructor(private currentSession: CurrentSessionService, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).catch ((error, caught) => {
            if(error.status === 401) {
                this.currentSession.clearSession();
                this.router.navigate([`/`]);
            }
            return Observable.throw(error);
        });
    }
}
