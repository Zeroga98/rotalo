import { appRouter } from './../router/router';
import { ROUTES } from './../router/routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FlashMessageComponent } from '../components/flash-message/flash-message.controller';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SliderComponent } from '../components/slider/slider.component';
import { LocationSelectComponent } from '../components/location-select/location-select.component';
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


@NgModule({
  declarations: [
    AppComponent,
    SliderComponent,
    CustomButtonComponent,
    FlashMessageComponent,
    BackArrowComponent,
    LocationSelectComponent,
    TermsModalComponent,
    HomePage,
    SignUpPage,
    LoginPage,
    RecoverPage,
    ConfirmPage,
    ShowPage,
    HobbiesPage,
    EditProfilePage,
    ChangePasswordPage,
    NotificationsSettingsPage,
    GroupByPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRouter)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
