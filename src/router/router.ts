import { ProductsFeedPage } from './../pages/products-feed/products-feed.page';
import { LoginPage } from './../pages/login/login.page';
import { ROUTES } from './routes';
import { Routes } from '@angular/router';
import { HomePage } from '../pages/home/home.page';
import { SignUpPage } from '../pages/signup/signup.page';
import { ProductsUploadPage } from '../pages/products-upload/products-upload.page';
import { ProductsPage } from '../pages/products/products.page';
import { DetalleProductoComponent } from '../pages/detalle-producto/detalle-producto.component';

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
        path: ROUTES.PRODUCTS.LINK,
        component:ProductsPage,
        children:[
            {
                path: ROUTES.PRODUCTS.FEED,
                component: ProductsFeedPage,
            },
            {
                path: ROUTES.PRODUCTS.UPLOAD,
                component: ProductsUploadPage,
            },
            {
                path: ROUTES.PRODUCTS.SHOW,
                component: DetalleProductoComponent,
            },
            {
                path: '',
                redirectTo: ROUTES.PRODUCTS.FEED,
                pathMatch: 'full'
            },
        ]
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
