import { ROUTES } from './../../router/routes';
import { Component, ChangeDetectionStrategy } from "@angular/core";


@Component({
    selector: 'home-page',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomePage {
    public readonly termsLink: string = `/${ROUTES.TERMS}`;
    public readonly faqLink: string = `/${ROUTES.FAQ}`;
    singupLink: string = `/${ROUTES.SIGNUP}`;
    loginLink: string = `/${ROUTES.LOGIN}`;
}
