import { ROUTES } from "./routes";
import { Routes } from "@angular/router";
import { LoginPage } from "./../pages/login/login.page";
import { HomePage } from "../pages/home/home.page";
import { SignUpPage } from "../pages/signup/signup.page";
import { ConfirmPage } from "../pages/reset-password/confirm/confirm.page";
import { RecoverPage } from "../pages/reset-password/recover/recover.page";

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
    path: '',
    redirectTo: ROUTES.HOME,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ROUTES.HOME
  }
];
