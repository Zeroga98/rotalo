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
import { CarMicrositePage } from '../microsite/pages-microsite/car-microsite/car-microsite.page';
import { ProductsMicrositePage } from '../microsite/pages-microsite/products-microsite/products-microsite.page';
import { DetalleProductoMicrositioComponent } from '../microsite/pages-microsite/detalle-producto-microsite/detalle-producto-microsite.component';
import { ResponseMicrositePage } from '../microsite/pages-microsite/response-microsite/response-microsite.page';
import { adminOrdersPage } from '../pages/profile/admin-orders/admin-orders.page';
import { FeaturedProductsComponent } from '../pages/profile/featured-products/featured-products.component';
import { AdminRegisterPage } from '../pages/profile/admin-register/admin-register.page';
import { AdminCampaignComponent } from '../pages/profile/admin-campaign/admin-campaign.component';
import { CampaignUploadComponent } from '../pages/profile/campaign-upload/campaign-upload.component';
import { CampaignEditComponent } from '../pages/profile/campaign-edit/campaign-edit.component';
import { AdminBannersComponent } from '../pages/profile/admin-banners/admin-banners.component';
import { NotificationsMobileComponent } from '../pages/notifications-mobile/notifications-mobile.component';
import { TermsCompaniesComponent } from '../components/terms-companies/terms-companies.component';
import { FilterProductsComponent } from '../pages/filter-products/filter-products.component';
import { DetailOrderComponent } from '../pages/profile/detail-order/detail-order.component';
import { MenuMobileComponent } from '../pages/menu-mobile/menu-mobile.component';
import { CategoriesComponent } from '../pages/categories-page/categories.component';
import { AdminUsersComponent } from '../pages/profile/admin-users/admin-users.component';
import { EditUsersComponent } from '../pages/profile/edit-users/edit-users.component';
import { ProductsShopComponent } from '../pages/profile/products-shop/products-shop.component';
import { UploadProductsComponent } from '../pages/profile/upload-products/upload-products.component';
import { AdminBannersShopComponent } from '../pages/profile/admin-banners-shop/admin-banners-shop.component';
import { PreviewProductMicrositeComponent } from '../microsite/components-microsite/preview-product-microsite/preview-product-microsite.component';
import { ProductsUploadMicrositeComponent } from '../microsite/pages-microsite/products-upload-microsite/products-upload-microsite.component';
import { ProductsEditMicrositeComponent } from '../microsite/pages-microsite/products-edit-microsite/products-edit-microsite.component';
import { HomeShopComponent } from '../microsite/pages-microsite/home-shop/home-shop.component';
import { DetailProductShopComponent } from '../microsite/components-microsite/detail-product-shop/detail-product-shop.component';
import { ProductsHomePage } from '../microsite/pages-microsite/products-shop/products-shop.page';
import { DetailPageShopComponent } from '../microsite/pages-microsite/detail-page-shop/detail-page-shop.component';
import { TermsShopComponent } from '../microsite/pages-microsite/terms-shop/terms-shop.component';
import { FrequentlyAsketQuestionsShopComponent } from '../microsite/pages-microsite/frequently-asket-questions-shop/frequently-asket-questions-shop.component';
import { ProductsShopPrivateComponent } from '../microsite/pages-microsite/products-shop-private/products-shop-private.component';
import { HomeShopPrivateComponent } from '../microsite/pages-microsite/home-shop-private/home-shop-private.component';
import { DetailPageShopPrivateComponent } from '../microsite/pages-microsite/detail-page-shop-private/detail-page-shop-private.component';
import { ActivationEmailComponent } from '../pages/activation-email/activation-email.component';
import { FavoritesComponent } from '../pages/profile/favorites/favorites.component';

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
      {
        path: `${ROUTES.MENUROTALOCENTER.MESSAGES}`,
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
        path: ROUTES.MENUROTALOCENTER.LIKES,
        component: FavoritesComponent,
      },
      {path: ROUTES.MENUROTALOCENTER.ADMINORDERS, component: adminOrdersPage },
      {path: ROUTES.MENUROTALOCENTER.ADMINREGISTER, component: AdminRegisterPage },
      {path: ROUTES.MENUROTALOCENTER.FEATUREDPRODUCT, component: FeaturedProductsComponent},
      {path: ROUTES.MENUROTALOCENTER.CAMPAIGN, component: AdminCampaignComponent},
      {path: ROUTES.MENUROTALOCENTER.UPLOAD, component: CampaignUploadComponent},
      {path: `${ROUTES.MENUROTALOCENTER.UPLOAD}/:id`, component: CampaignEditComponent},
      {path: ROUTES.MENUROTALOCENTER.BANNER, component: AdminBannersComponent},
      {path: `${ROUTES.MENUROTALOCENTER.DETAILORDERS}/:id`, component: DetailOrderComponent},
      {path: ROUTES.MENUROTALOCENTER.ADMINUSERS, component: AdminUsersComponent},
      {path: `${ROUTES.MENUROTALOCENTER.EDITUSERS}/:id`, component: EditUsersComponent},
      {path: `${ROUTES.MENUROTALOCENTER.PRODUCTSSHOP}/:id`, component: ProductsShopComponent},
      {path: `${ROUTES.MENUROTALOCENTER.UPLOADPRODUCTS}/:id`, component: UploadProductsComponent},
      { path: ROUTES.MENUROTALOCENTER.PROFILEPASS, component: ChangePasswordPage },
      { path: ROUTES.MENUROTALOCENTER.HOBBIES, component: HobbiesPage },
      { path: ROUTES.MENUROTALOCENTER.EDITPROFILE, component: EditProfilePage },
      { path: ROUTES.SHOW, component: ShowInfoProfileComponent },
      {path: `${ROUTES.MENUROTALOCENTER.SHOPBANNERS}/:id`, component: AdminBannersShopComponent},
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
        path: `${ROUTES.PRODUCTS.FILTERS}` ,
        component: FilterProductsComponent,
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
   /*   {
        path: `${ROUTES.PRODUCTS.SIMULATECREDIT}`,
        component: SimulateCreditPage,
      },
      {
        path: `${ROUTES.PRODUCTS.SIMULATECREDIT}/:id`,
        component: SimulateCreditPage,
      },
      {
        path: `${ROUTES.PRODUCTS.SIMULATECREDIT}/:id/:storeId`,
        component: SimulateCreditPage,
      },*/
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
        path: ROUTES.PRODUCTS.MOBILENOTIFICATIONS,
        component: NotificationsMobileComponent,
      },
      {
        path: ROUTES.PRODUCTS.MOBILEMENU,
        component: MenuMobileComponent,
      },
      {
        path: ROUTES.MICROSITE.LINK,
        canActivate: [AuthGuardService],
        children: [
          {
            path: ROUTES.MICROSITE.FEED,
            component: ProductsMicrositePage,
          },
          {
            path: ROUTES.MICROSITE.DETAIL,
            component: DetalleProductoMicrositioComponent,
          },
          {
            path: `${ROUTES.MICROSITE.DETAIL}/:id`,
            component: DetalleProductoMicrositioComponent,
          },
          {
            path: `${ROUTES.MICROSITE.UPLOAD}/:idShop`,
            component: ProductsUploadMicrositeComponent,
          },
          {
            path: `${ROUTES.MICROSITE.UPLOAD}/:idShop/:id`,
            component: ProductsEditMicrositeComponent,
          },
          {
            path: ROUTES.MICROSITE.CAR,
            component: CarMicrositePage,
          },
          {
            path: ROUTES.MICROSITE.RESPONSE,
            component: ResponseMicrositePage,
          },
          {
            path: `${ROUTES.MICROSITE.PREVIEW}/:idShop/:id`,
            component: PreviewProductMicrositeComponent,
          },
          {
            path: '',
            redirectTo: ROUTES.MICROSITE.FEED,
            pathMatch: 'full'
          },
          {
            path: '**',
            redirectTo: ROUTES.MICROSITE.FEED,
            pathMatch: 'full'
          }
        ]
      },
      {
        path: ROUTES.PRODUCTS.CATEGORIES,
        component: CategoriesComponent,
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
    path: `${ROUTES.TERMS}/:id`,
    component: TermsPage,
  },
  {
    path: ROUTES.TERMSCOMPANIES,
    component: TermsCompaniesComponent
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
    path: `${ROUTES.ACTIVATIONROTALO}/:country/:email`,
    component: ActivationEmailComponent
  },
  {
    path: `${ROUTES.FAQ}/:id`,
    component: FrequentlyAskedQuestionsComponent
  },
  {
    path: ROUTES.NOTIFICATIONCONFIRMATION,
    component: NotificationConfirmation
  },

/****/

{
  path: ROUTES.SHOPS.LINK,
  component: ProductsHomePage,
  children: [
    {
      path: ROUTES.SHOPS.FEED,
      component: HomeShopComponent,
    },
    {
      path: `${ROUTES.SHOPS.SHOW}/:id`,
      component: DetailPageShopComponent,
    },
    {
      path: ROUTES.SHOPS.TERMS,
      component: TermsShopComponent,
    },
    {
      path: `${ROUTES.SHOPS.TERMS}/:id`,
      component: TermsShopComponent,
    },
    {
      path: ROUTES.SHOPS.FAQ,
      component: FrequentlyAsketQuestionsShopComponent,
    },
    {
      path: `${ROUTES.SHOPS.FAQ}/:id`,
      component: FrequentlyAsketQuestionsShopComponent,
    },
    {
      path: '',
      redirectTo: ROUTES.SHOPS.FEED,
      pathMatch: 'full'
    }
  ]
},
/****/
/*
{
  path: ROUTES.SHOPSPRIVATE.LINK,
  component: ProductsShopPrivateComponent,
  canActivate: [AuthGuardService],
  children: [
    {
      path: ROUTES.SHOPSPRIVATE.FEED,
      component: HomeShopPrivateComponent,
    },
    {
      path: `${ROUTES.SHOPSPRIVATE.SHOW}/:id`,
      component: DetailPageShopPrivateComponent,
    },
    {
      path: ROUTES.SHOPSPRIVATE.TERMS,
      component: TermsShopComponent,
    },
    {
      path: ROUTES.SHOPSPRIVATE.FAQ,
      component: FrequentlyAsketQuestionsShopComponent,
    },
    {
      path: '',
      redirectTo: ROUTES.SHOPSPRIVATE.FEED,
      pathMatch: 'full'
    }
  ]
},*/
/****/
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
