import { TokenInterceptor } from './../commons/interceptors/token.interceptor';
import { appRouter } from './../router/router';
import { ROUTES } from './../router/routes';
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RlTagInputModule} from 'angular2-tag-input';
import { NgxCarouselModule } from 'ngx-carousel';
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
    HomePage,
    SignUpPage,
    ProductsUploadPage,
    ProductsPage,
    LoginPage,
    RecoverPage,
    ConfirmPage,
    ShowPage,
    HobbiesPage,
    EditProfilePage,
    ChangePasswordPage,
    NotificationsSettingsPage,
    GroupByPipe,
    ProductsFeedPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    HttpClientModule,
    RlTagInputModule,
    NgxCarouselModule,
    RouterModule.forRoot(appRouter)

  ],
  providers: [
    UserService,
    CollectionSelectService,
    CategoriesService,
    ProductsService,
    LoginService,
    ConfigurationService,
    CurrentSessionService,
    RecoverService,
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
