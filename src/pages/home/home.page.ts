import { ROUTES } from './../../router/routes';
import { Component } from "@angular/core";


@Component({
    selector: 'home-page',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})

export class HomePage {
    singupLink: string = `/${ROUTES.SIGNUP}`;
    loginLink: string = `/${ROUTES.LOGIN}`;
}
