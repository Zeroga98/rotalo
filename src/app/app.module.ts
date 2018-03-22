import { TokenInterceptor } from './../commons/interceptors/token.interceptor';
import { appRouter } from './../router/router';
import { ROUTES } from './../router/routes';
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RlTagInputModule} from 'angular2-tag-input';
import { NgxCarouselModule } from 'ngx-carousel';
import { ImageUploadModule } from 'angular2-image-upload';
import 'hammerjs';

import { AppComponent } from './app.component';
import { FlashMessageComponent } from '../components/flash-message/flash-message.controller';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomePage } from '../pages/home/home.page';
import { BackArrowComponent } from '../components/back-arrow/back-arrow.component';
import { CustomButtonComponent } from '../components/custom-button/custom-button.component';
import { TermsModalComponent } from '../components/terms-modal/terms-modal.page';
import { SignUpPage } from '../pages/signup/signup.page';
import { LoginPage } from '../pages/login/login.page';
import { ConfirmPage } from '../pages/reset-password/confirm/confirm.page';
import { RecoverPage } from '../pages/reset-password/recover/recover.page';
import { ShowPage } from '../pages/profile/show/show.page';
import { HobbiesPage } from '../pages/profile/hobbies/hobbies.page';
import { EditProfilePage } from '../pages/profile/edit-profile/edit-profile.page';
import { ChangePasswordPage } from '../pages/profile/change-password/change-password.page';
import { NotificationsSettingsPage } from '../pages/profile/notifications-settings/notifications-settings.page';
import { GroupByPipe } from '../commons/pipes/groupBy.pipe';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';

import { ProductsFeedPage } from '../pages/products-feed/products-feed.page';
import { BackTopComponent } from '../components/back-top/back-top.component';
import { NavigationTopComponent } from '../components/navigation-top/navigation-top.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SelectCountryComponent } from '../components/select-country/select-country.component';
import { CollectionSelectService } from '../services/collection-select.service';
import { SelectStatesComponent } from '../components/select-states/select-states.component';
import { SelectCitiesComponent } from '../components/select-cities/select-cities.component';
import { ProductsService } from '../services/products.service';
import { NormalizeInterceptor } from '../commons/interceptors/normalize.interceptor';
import { ProductComponent } from '../components/product/product.component';
import { LoginService } from '../services/login/login.service';
import { AuthGuardService } from '../services/login/auth-guard.service';
import { ConfigurationService } from '../services/configuration.service';
import { CurrentSessionService } from '../services/current-session.service';
import { RecoverService } from '../services/reset-password/recover.service';
import { UserService } from '../services/user.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { CategoriesMenuComponent } from '../components/categories-menu/categories-menu.component';
import { CategoriesService } from '../services/categories.service';
import { ProductsUploadPage } from '../pages/products-upload/products-upload.page';
import { ProductsPage } from '../pages/products/products.page';
import { ChangePasswordService } from '../services/profile/changePassword.service';
import { PreferenceService } from '../services/profile/preference.service';
import { DetalleProductoComponent } from '../pages/detalle-producto/detalle-producto.component';
import { PhotosService } from '../services/photos.service';
import { HeadersInterceptor } from '../commons/interceptors/header.interceptor';
import { UtilsService } from '../util/utils.service';
import { ActivacionCuentaPage } from '../pages/activacion-cuenta/activacion-cuenta.page';
import { ActivationService } from '../services/activation.service';
import { SimpleFormComponent } from '../components/simple-form/simple-form.component';
import { SuccessActivationPage } from '../pages/success-activation/success-activation.page';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalSendMessageComponent } from '../components/modal-send-message/modal-send-message.component';
import { MessagesService } from '../services/messages.service';
import { StepsPage } from '../pages/steps/steps.page';
import { SufiTePrestaModalComponent } from '../components/sufi-te-presta-modal/sufi-te-presta-modal.component';
import { OfferModalComponent } from '../components/offer-modal/offer-modal.component';
import { OfferService } from '../services/offer.service';
import { BuyProductPage } from '../pages/buy-product/buy-product.page';
import { BuyService } from '../services/buy.service';
import { MsgCongratulationComponent } from '../components/msg-congratulation/msg-congratulation.component';
import { FormProductComponent } from '../components/form-product/form-product.component';
import { ProductEditPage } from '../pages/product-edit/product-edit.page';
import { ModalMessageComponent } from '../components/modal-message/modal-message.component';
import { DetailProductComponent } from '../components/detail-product/detail-product.component';
import { SoldPage } from '../pages/profile/sold/sold.page';
import { SellingPage } from '../pages/profile/selling/selling.page';
import { LoansService } from '../services/loans.service';
import { NotificationsService } from '../services/notifications.service';
import { LoggedGuardService } from '../services/login/logged-guard.service';
import { SimulateCreditPage } from '../pages/simulate-credit/simulate-credit.page';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MasonryModule, AngularMasonry } from 'angular2-masonry';

import { SettingsService } from '../services/settings.service';
import { SimulateCreditService } from '../services/simulate-credit.service';
import { NotificationsPage } from '../pages/notifications/notifications.page';
import { NavigationService } from '../pages/products/navigation.service';
import { SliderComponent } from '../components/slider/slider.component';
import { StarRatingComponent } from '../components/star-rating/star-rating.component';
import { ModalRateComponent } from '../components/modal-rate/modal-rate.component';
import { RatingNotificationComponent } from '../components/notifications/rating-notification/rating-notification.component';
import { RatingService } from '../services/rating.service';
import { PurchaseAcceptedComponent } from '../components/notifications/purchase-accepted/purchase-accepted.component';
import { TypeDocumentsService } from '../services/type-documents.service';
import { FooterComponent } from '../components/footer/footer.component';
import { TermsComponent } from '../components/terms/terms.component';
import { TermsPage } from '../pages/terms/terms.page';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoaderInterceptor } from '../commons/interceptors/loading-bar.interceptos';
import { SubcategoryFilterComponent } from '../components/subcategory-filter/subcategory-filter.component';
import { ValidateSessionInterceptor } from '../commons/interceptors/validate-session.interceptor';
import { ValidateSessionService } from '../router/guards/validate-session.service';

@NgModule({
  declarations: [
    AppComponent,
    CustomButtonComponent,
    PurchaseAcceptedComponent,
    ModalRateComponent,
    RatingNotificationComponent,
    FlashMessageComponent,
    StarRatingComponent,
    SliderComponent,
    BackArrowComponent,
    TermsModalComponent,
    BackTopComponent,
    NavigationTopComponent,
    MsgCongratulationComponent,
    SelectCountryComponent,
    SelectStatesComponent,
    SelectCitiesComponent,
    CategoriesMenuComponent,
    SpinnerComponent,
    FormProductComponent,
    ProductComponent,
    ToolbarComponent,
    SimpleFormComponent ,
    DetailProductComponent,
    HomePage,
    SignUpPage,
    ProductsUploadPage,
    ProductEditPage,
    ProductsPage,
    SuccessActivationPage,
    LoginPage,
    RecoverPage,
    ConfirmPage,
    BuyProductPage,
    ShowPage,
    HobbiesPage,
    EditProfilePage,
    ChangePasswordPage,
    NotificationsSettingsPage,
    ActivacionCuentaPage,
    GroupByPipe,
    ProductsFeedPage,
    DetalleProductoComponent,
    FooterComponent,
    TermsComponent,
    ModalComponent,
    ModalSendMessageComponent,
    SufiTePrestaModalComponent,
    OfferModalComponent,
    StepsPage,
    ModalMessageComponent,
    DetailProductComponent,
    SoldPage,
    SellingPage,
    TermsPage,
    SimulateCreditPage,
    NotificationsPage,
    SubcategoryFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    HttpClientModule,
    RlTagInputModule,
    NgxCarouselModule,
    MasonryModule,
    InfiniteScrollModule,
    SlimLoadingBarModule.forRoot(),
    ImageUploadModule.forRoot(),
    RouterModule.forRoot(appRouter),
    CurrencyMaskModule
  ],
  providers: [
    UserService,
    CollectionSelectService,
    NotificationsService,
    ActivationService,
    CategoriesService,
    ProductsService,
    LoginService,
    ConfigurationService,
    CurrentSessionService,
    BuyService,
    LoansService,
    OfferService,
    RecoverService,
    ChangePasswordService,
    RatingService,
    UtilsService,
    PreferenceService,
    PhotosService,
    AuthGuardService,
    LoggedGuardService,
    MessagesService,
    SettingsService,
    SimulateCreditService,
    NotificationsService,
    NavigationService,
    TypeDocumentsService,
    ValidateSessionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ValidateSessionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NormalizeInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
