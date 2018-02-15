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
    ProductComponent,
    ToolbarComponent,
    HomePage,
    SignUpPage,
    LoginPage,
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
    CollectionSelectService,
    ProductsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi:true
    },
    {
      provide:HTTP_INTERCEPTORS,
      useClass: NormalizeInterceptor,
      multi: true 
    } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
