import { TermsPage } from './../pages/terms/terms.page';
import { StepsPage } from './../pages/steps/steps.page';
import { ActivacionCuentaPage } from './../pages/activacion-cuenta/activacion-cuenta.page';
import { ROUTES } from './routes';
import { Routes } from '@angular/router';
import { HomePage } from '../pages/home/home.page';
import { SignUpPage } from '../pages/signup/signup.page';
import { ProductsFeedPage } from '../pages/products-feed/products-feed.page';
import { ProductsUploadPage } from '../pages/products-upload/products-upload.page';
import { ProductsPage } from '../pages/products/products.page';
import { ConfirmPage } from '../pages/reset-password/confirm/confirm.page';
import { RecoverPage } from '../pages/reset-password/recover/recover.page';
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
import { LoggedGuardService } from '../services/login/logged-guard.service';
import { SimulateCreditPage } from '../pages/simulate-credit/simulate-credit.page';
import { ChangePage } from '../pages/reset-password/change/change.page';
import { ValidateSessionService } from './guards/validate-session.service';
import { RotaloCenterPage } from '../pages/rotalo-center/rotalo-center.page';
import { RotaloCenterComponent } from '../components/general-info-rotalo-center/info-rotalo-center.component';
import { ChatPageComponent } from '../pages/chat-page/chat-page.component';
import { ErrorPageComponent } from '../components/error-page/error-page.component';
import { ProfileMenu } from '../pages/profile/profile-menu/profile-menu';
import { ShowInfoProfileComponent } from '../pages/profile/show-info-profile/show-info-profile.component';
import { FrequentlyAskedQuestionsComponent } from '../pages/frequently-asked-questions/frequently-asked-questions.component';
import { NotificationConfirmation } from '../pages/notification-confirmation/notification-confirmation';
import { LoginPage } from '../pages/login/login.page';
import { FinanceBamComponent } from '../components/financeBam/financeBam.component';
import { ProductsPromoPage } from '../pages/products-promo/products-promo.page';

export const appRouter: Routes = [
  {
    path: ROUTES.HOME,
    component: HomePage,
    canActivate: [ValidateSessionService],
  },
  {
    path: ROUTES.SIGNUP,
    component: SignUpPage
  },
  {
    path: ROUTES.LOGINMOBILE,
    component: LoginPage
  },
  {
    path: ROUTES.ROTALOCENTER,
    component: RotaloCenterPage,
    canActivate: [AuthGuardService],
    children: [
      { path: ROUTES.MENUROTALOCENTER.INFOROTALOCENTER, component: RotaloCenterComponent },
      { path: ROUTES.MENUROTALOCENTER.NOTIFICATIONSSETTINGS, component: NotificationsSettingsPage },
      { path: ROUTES.MENUROTALOCENTER.SOLD, component: SoldPage },
      { path: `${ROUTES.MENUROTALOCENTER.MESSAGES}`,
        component: ChatPageComponent,
        children: [
          { path: ROUTES.MENUROTALOCENTER.FEEDBACK, component: ChatPageComponent },
        ]
      },
      {
        path: ROUTES.MENUROTALOCENTER.SELLING,
        component: SellingPage,
      },
      {
        path: '',
        redirectTo: ROUTES.ROTALOCENTER,
        pathMatch: 'full'
      }
    ]
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
          path: `${ROUTES.PRODUCTS.BUY}/:id`,
          component: BuyProductPage,
        },
        {
          path: `${ROUTES.PRODUCTS.SIMULATECREDIT}/:id`,
          component: SimulateCreditPage,
        },
        {
          path: `${ROUTES.PRODUCTS.FINANCEBAM}/:id`,
          component: FinanceBamComponent,
        },
        {
          path: ROUTES.PRODUCTS.ERROR,
          component: ErrorPageComponent,
        },
        {
          path: ROUTES.PRODUCTS.PROMO,
          component: ProductsPromoPage,
        },
        {
            path: '',
            redirectTo: ROUTES.PRODUCTS.FEED,
            pathMatch: 'full'
        },
    ]
  },
  {
    path: ROUTES.TERMS,
    component: TermsPage
  },
  {
    path: ROUTES.RESETPASS,
    children: [
      { path: ROUTES.RECOVER, component: RecoverPage },
      { path: ROUTES.CONFIRM, component: ConfirmPage },
      { path: `${ROUTES.CHANGE}/:id`, component: ChangePage },
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
    component: ProfileMenu,
    children: [
      { path: ROUTES.SHOW, component: ShowInfoProfileComponent },
      { path: ROUTES.PROFILEPASS, component: ChangePasswordPage },
      { path: ROUTES.HOBBIES, component: HobbiesPage },
      { path: ROUTES.EDITPROFILE, component: EditProfilePage },
      {
        path: '',
        redirectTo: ROUTES.PROFILE,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: ROUTES.FAQ,
    component: FrequentlyAskedQuestionsComponent
  },

  {
    path: ROUTES.NOTIFICATIONCONFIRMATION,
    component: NotificationConfirmation
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
