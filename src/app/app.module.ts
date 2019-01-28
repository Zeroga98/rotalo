import { TokenInterceptor } from './../commons/interceptors/token.interceptor';
import { appRouter } from './../router/router';
import { ROUTES } from './../router/routes';
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { ChangePage } from '../pages/reset-password/change/change.page';
import { ValidateSessionService } from '../router/guards/validate-session.service';
import { RemoveDigitsPipe } from '../commons/pipes/removeDigits.pipe';
import { ModalTipsComponent } from '../components/modal-tips/modal-tips.component';
import { FeedService } from '../pages/products-feed/feed.service';
import { ToolbarService } from '../components/toolbar/toolbar.service';
import { MyDatePickerModule } from 'mydatepicker';
import { SavePasswordService } from '../pages/signup/save-password.service';
import { RotaloCenterPage } from '../pages/rotalo-center/rotalo-center.page';
import { RotaloCenterComponent } from '../components/general-info-rotalo-center/info-rotalo-center.component';
import { ChatPageComponent } from '../pages/chat-page/chat-page.component';
import { ChatThreadsComponent } from '../components/chat-threads/chat-threads.component';
import { ChatWindowComponent } from '../components/chat-window/chat-window.component';
import { ChatThreadComponent } from '../components/chat-thread/chat-thread.component';
import { ConfirmPurchaseComponent } from '../components/confirm-purchase/confirm-purchase.component';
import { InfoPageComponent } from '../components/info-page/info-page.component';
import { ModalBuyInfoComponent } from '../components/modal-buy-info/modal-buy-info.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { ClockAnimationComponent } from '../components/clock-animation/clock-animation.component';
import { ErrorPageComponent } from '../components/error-page/error-page.component';
import { ResumeRotaloCenterService } from '../services/resume-rotalo-center.service';
import { BarRatingModule } from 'ngx-bar-rating';
import { ShowStarComponent } from '../components/show-star/show-star.component';
import { ShareInfoChatService } from '../components/chat-thread/shareInfoChat.service';
import { ProfileMenu } from '../pages/profile/profile-menu/profile-menu';
import { ShowInfoProfileComponent } from '../pages/profile/show-info-profile/show-info-profile.component';
import { HobbiesService } from '../services/hobbies.service';
import { FrequentlyAskedQuestionsComponent } from '../pages/frequently-asked-questions/frequently-asked-questions.component';
import { AccordionComponent } from '../components/accordion/accordion.component';
import { FrequentlyAskedQuestionsService } from '../services/frequently-asked-questions.service';
import { ModalFeedBackService } from '../components/modal-feedBack/modal-feedBack.service';
import { FeedBackComponent } from '../components/feedBack/feedBack.component';
import { ModalFeedBackComponent } from '../components/modal-feedBack/modal-feedBack.component';
import { NotificationConfirmation } from '../pages/notification-confirmation/notification-confirmation';
import { ModalShareProductComponent } from '../components/modal-shareProduct/modal-shareProduct.component';
import { ModalShareProductService } from '../components/modal-shareProduct/modal-shareProduct.service';
import { ModalUploadProductComponent } from '../components/modal-uploadProduct/modal-uploadProduct.component';
import { ModalUploadProductService } from '../components/modal-uploadProduct/modal-uploadProduct.service';
import { ModalTicketComponent } from '../components/modal-ticket/modal-ticket.component';
import { ModalTicketService } from '../components/modal-ticket/modal-ticket.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { NavigationTopLoginComponent } from '../components/navigation-top-login/navigation-top-login.component';
import { CompanySliderComponent } from '../components/company-slider/company-slider.component';
import { ModalVideoService } from '../components/modal-video/modal-video.service';
import { ModalVideoComponent } from '../components/modal-video/modal-video.component';
import { FinanceBamComponent } from '../components/financeBam/financeBam.component';
import { ProductsPromoPage } from '../pages/products-promo/products-promo.page';
import { FeedPromoService } from '../pages/products-promo/feedPromo.service';
import { PromoAnimationComponent } from '../components/promo-animation/promo-animation.component';
import { ModalPromoComponent } from '../components/modal-promo/modal-promo.component';
import { ModalPromoProductService } from '../components/modal-promo/modal-promoProduct.service';
import { FeaturedProductsComponent } from '../pages/profile/featured-products/featured-products.component';

//Componentes y páginas del micrositio
import { CarMicrositePage } from '../microsite/pages-microsite/car-microsite/car-microsite.page';
import { ProductsMicrositeService } from '../microsite/services-microsite/back/products-microsite.service';
import { ConfigurationMicrositeService } from '../microsite/services-microsite/configuration/configuration-microsite.service';
import { ProductsMicrositePage } from '../microsite/pages-microsite/products-microsite/products-microsite.page';
import { FeedMicrositeService } from '../microsite/pages-microsite/products-microsite/feedMicrosite.service';
import { ProductMicrositeComponent } from '../microsite/components-microsite/product-microsite/product-microsite.component';
import { DetalleProductoMicrositioComponent } from '../microsite/pages-microsite/detalle-producto-microsite/detalle-producto-microsite.component';
import { DetailProductMicrositeComponent } from '../microsite/components-microsite/detail-product-microsite/detail-product-microsite.component';
import { BannerLatiendaComponent } from '../microsite/components-microsite/banner-latienda/banner-latienda.component';
import { ShoppingCarService } from '../microsite/services-microsite/front/shopping-car.service';
import { BackArrowMicrositeComponent } from '../microsite/components-microsite/back-arrow-microsite/back-arrow-microsite.component';
import { NavigationTopService } from '../components/navigation-top/navigation-top.service';
import { MiniProductDetailComponent } from '../microsite/components-microsite/mini-product-detail/mini-product-detail.component';
import { windowService } from '../microsite/services-microsite/front/window.service';
import { ResponseMicrositePage } from '../microsite/pages-microsite/response-microsite/response-microsite.page';
import { adminOrdersPage } from '../pages/profile/admin-orders/admin-orders.page';
import { ModalDetailComponent } from '../microsite/components-microsite/modal-detail/modal-detail.component';
import { ProductRotaloCenterComponent } from '../components/product-rotalo-center/product-rotalo-center.component';
import { SuccessCreditComponent } from '../components/success-credit/success-credit.component';
import { AdminRegisterPage } from '../pages/profile/admin-register/admin-register.page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { NgxMasonryModule } from 'ngx-masonry';


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
    HobbiesPage,
    EditProfilePage,
    ChangePasswordPage,
    NotificationsSettingsPage,
    ActivacionCuentaPage,
    GroupByPipe,
    RemoveDigitsPipe,
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
    SubcategoryFilterComponent,
    ChangePage,
    ModalTipsComponent,
    RotaloCenterPage,
    RotaloCenterComponent,
    ChatPageComponent,
    ChatThreadComponent,
    ChatThreadsComponent,
    ChatWindowComponent,
    ConfirmPurchaseComponent,
    InfoPageComponent,
    ModalBuyInfoComponent,
    ClockAnimationComponent,
    ErrorPageComponent,
    ShowStarComponent,
    ProfileMenu,
    ShowInfoProfileComponent,
    FrequentlyAskedQuestionsComponent,
    AccordionComponent,
    FeedBackComponent,
    ModalFeedBackComponent,
    NotificationConfirmation,
    ModalShareProductComponent,
    ModalUploadProductComponent,
    ModalTicketComponent,
    NavigationTopLoginComponent,
    CompanySliderComponent,
    ModalVideoComponent,
    FinanceBamComponent,
    ProductsPromoPage,
    PromoAnimationComponent,
    ModalPromoComponent,
    DetalleProductoMicrositioComponent,
    CarMicrositePage,
    ProductsMicrositePage,
    ProductMicrositeComponent,
    DetailProductMicrositeComponent,
    BannerLatiendaComponent,
    BackArrowMicrositeComponent,
    MiniProductDetailComponent,
    ResponseMicrositePage,
    adminOrdersPage,
    ModalDetailComponent,
    ProductRotaloCenterComponent,
    SuccessCreditComponent,
    FeaturedProductsComponent,
    AdminRegisterPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    HttpClientModule,
    NgxCarouselModule,
    InfiniteScrollModule,
    MyDatePickerModule,
    SlimLoadingBarModule.forRoot(),
    ImageUploadModule.forRoot(),
    RouterModule.forRoot(appRouter),
    LottieAnimationViewModule.forRoot(),
    CurrencyMaskModule,
    BarRatingModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxMasonryModule
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
    FeedService,
    FeedPromoService,
    ToolbarService,
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
    SavePasswordService,
    ResumeRotaloCenterService,
    ShareInfoChatService,
    HobbiesService,
    FrequentlyAskedQuestionsService,
    ModalFeedBackService,
    ModalShareProductService,
    ModalUploadProductService,
    ModalTicketService,
    ModalVideoService,
    ModalPromoProductService,
    NavigationTopService,
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
    },
    ProductsMicrositeService,
    ConfigurationMicrositeService,
    FeedMicrositeService,
    ShoppingCarService,
    windowService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
