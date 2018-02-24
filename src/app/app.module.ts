import { TokenInterceptor } from './../commons/interceptors/token.interceptor';
import { appRouter } from './../router/router';
import { ROUTES } from './../router/routes';
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RlTagInputModule} from 'angular2-tag-input';
import { NgxCarouselModule } from 'ngx-carousel';
import { ImageUploadModule } from "angular2-image-upload";
import 'hammerjs';

import { AppComponent } from './app.component';
import { FlashMessageComponent } from '../components/flash-message/flash-message.controller';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SliderComponent } from '../components/slider/slider.component';
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


@NgModule({
  declarations: [
    AppComponent,
    SliderComponent,
    CustomButtonComponent,
    FlashMessageComponent,
    BackArrowComponent,
    TermsModalComponent,
    BackTopComponent,
    NavigationTopComponent,
    SelectCountryComponent,
    SelectStatesComponent,
    SelectCitiesComponent,
    CategoriesMenuComponent,
    SpinnerComponent,
    ProductComponent,
    ToolbarComponent,
    SimpleFormComponent ,
    HomePage,
    SignUpPage,
    ProductsUploadPage,
    ProductsPage,
    SuccessActivationPage,
    LoginPage,
    RecoverPage,
    ConfirmPage,
    ShowPage,
    HobbiesPage,
    EditProfilePage,
    ChangePasswordPage,
    NotificationsSettingsPage,
    ActivacionCuentaPage,
    GroupByPipe,
    ProductsFeedPage,
    DetalleProductoComponent,
    ModalComponent,
    ModalSendMessageComponent,
    StepsPage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    HttpClientModule,
    RlTagInputModule,
    NgxCarouselModule,
    ImageUploadModule.forRoot(),
    RouterModule.forRoot(appRouter)

  ],
  providers: [
    UserService,
    CollectionSelectService,
    ActivationService,
    CategoriesService,
    ProductsService,
    LoginService,
    ConfigurationService,
    CurrentSessionService,
    RecoverService,
    ChangePasswordService,
    UtilsService,
    PreferenceService,
    PhotosService,
    MessagesService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi:true
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
