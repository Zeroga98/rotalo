import { ProductsFeedPage } from './../pages/products-feed/products-feed.page';
import { LoginPage } from './../pages/login/login.page';
import { ROUTES } from './routes';
import { Routes } from '@angular/router';
import { HomePage } from '../pages/home/home.page';
import { SignUpPage } from '../pages/signup/signup.page';

export const appRouter: Routes = [
    {
        path: ROUTES.HOME,
        component: HomePage
    },
    {
        path: ROUTES.SIGNUP,
        component: SignUpPage
    },
    {
        path: ROUTES.PRODUCTS_FEED,
        component: ProductsFeedPage
    },
    {
        path: ROUTES.LOGIN,
        component: LoginPage
    },
    {
        path: '',
        redirectTo: ROUTES.HOME,
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ROUTES.HOME,
    }
];
