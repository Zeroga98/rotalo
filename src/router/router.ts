import { ROUTES } from './routes';
import { Routes } from '@angular/router';
import { LoginPage } from './../pages/login/login.page';
import { HomePage } from '../pages/home/home.page';
import { SignUpPage } from '../pages/signup/signup.page';
import { ProductsFeedPage } from '../pages/products-feed/products-feed.page';
import { ProductsUploadPage } from '../pages/products-upload/products-upload.page';
import { ProductsPage } from '../pages/products/products.page';
import { ConfirmPage } from '../pages/reset-password/confirm/confirm.page';
import { RecoverPage } from '../pages/reset-password/recover/recover.page';
import { ShowPage } from '../pages/profile/show/show.page';
import { HobbiesPage } from '../pages/profile/hobbies/hobbies.page';
import { EditProfilePage } from '../pages/profile/edit-profile/edit-profile.page';
import { ChangePasswordPage } from '../pages/profile/change-password/change-password.page';
import { NotificationsSettingsPage } from '../pages/profile/notifications-settings/notifications-settings.page';
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
    component: ProductsPage,
    children: [
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
    path: ROUTES.RESETPASS,
    children: [
      { path: ROUTES.RECOVER, component: RecoverPage },
      { path: ROUTES.CONFIRM, component: ConfirmPage },
      {
        path: '',
        redirectTo: ROUTES.RECOVER,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: ROUTES.PROFILE,
    children: [
      { path: ROUTES.SHOW, component: ShowPage },
      { path: ROUTES.PROFILEPASS, component: ChangePasswordPage },
      { path: ROUTES.HOBBIES, component: HobbiesPage },
      { path: ROUTES.EDITPROFILE, component: EditProfilePage },
      { path: ROUTES.NOTIFICATIONSSETTINGS, component: NotificationsSettingsPage },
      {
        path: '',
        redirectTo: ROUTES.SHOW,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: ROUTES.HOME,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ROUTES.HOME
  }
];
