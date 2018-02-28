import { StepsPage } from './../pages/steps/steps.page';
import { ActivacionCuentaPage } from './../pages/activacion-cuenta/activacion-cuenta.page';
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
import { AuthGuardService } from '../services/login/auth-guard.service';
import { SuccessActivationPage } from '../pages/success-activation/success-activation.page';
import { SoldPage } from '../pages/profile/sold/sold.page';
import { BuyProductPage } from '../pages/buy-product/buy-product.page';
import { ProductEditPage } from '../pages/product-edit/product-edit.page';
import { SellingPage } from '../pages/profile/selling/selling.page';
import { NotificationsPage } from '../pages/notifications/notifications.page';

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
    path: ROUTES.NOTIFICATIONS,
    component: NotificationsPage
  },
  {
    path: ROUTES.ACTIVACION,
    component: ActivacionCuentaPage
  },
  {
    path: ROUTES.SUCCESS,
    component: SuccessActivationPage
  },
  {
    path: ROUTES.STEPS,
    component: StepsPage
  },
  {
    path: ROUTES.PRODUCTS.LINK,
    component: ProductsPage,
    canActivate: [AuthGuardService],
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
        path: `${ROUTES.PRODUCTS.UPLOAD}/:id`,
        component: ProductEditPage,
      },
      {
        path: `${ROUTES.PRODUCTS.SHOW}/:id`,
        component: DetalleProductoComponent,
      },
      {
        path: ROUTES.PRODUCTS.SOLD,
        component: SoldPage,
      },
      {
        path: ROUTES.PRODUCTS.SELLING,
        component: SellingPage,
      }
      , {
        path: `${ROUTES.PRODUCTS.BUY}/:id`,
        component: BuyProductPage,
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
    canActivate: [AuthGuardService],
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
