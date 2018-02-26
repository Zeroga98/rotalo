import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CurrentSessionService } from '../../services/current-session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private currentSessionService: CurrentSessionService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const request = req.clone({
            setHeaders: {
                Authorization: this.getToken()
            }
        });
        return next.handle(request);
    }

    private getToken(): string {
<<<<<<< HEAD
      return this.currentSessionService.authToken();
=======
      return this.currentSessionService.authToken() || 'PyxRby2giXFjzjPcGoeS';
>>>>>>> 3134b85bddca5e4f7b74da4ef1844bdedc08e0f7
    }
}
