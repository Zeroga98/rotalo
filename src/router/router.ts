import { ROUTES } from "./routes";
import { Routes } from "@angular/router";
import { LoginPage } from "./../pages/login/login.page";
import { HomePage } from "../pages/home/home.page";
import { SignUpPage } from "../pages/signup/signup.page";
import { ConfirmPage } from "../pages/reset-password/confirm/confirm.page";
import { RecoverPage } from "../pages/reset-password/recover/recover.page";
import { ShowPage } from '../pages/profile/show/show.page';
import { HobbiesPage } from '../pages/profile/hobbies/hobbies.page';
import { EditProfilePage } from '../pages/profile/edit-profile/edit-profile.page';

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
      { path: ROUTES.PROFILEPASS, component: ConfirmPage },
      { path: ROUTES.HOBBIES, component: HobbiesPage },
      { path: ROUTES.EDITPROFILE, component: EditProfilePage },
      { path: ROUTES.NOTIFICATIONSSETTINGS, component: ConfirmPage },
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
