import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MessagesService } from '../../services/messages.service';
import { ModalFeedBackService } from '../modal-feedBack/modal-feedBack.service';
import { ProductsService } from '../../services/products.service';
import { ROUTES } from '../../router/routes';
import { ProductsMicrositeService } from '../../microsite/services-microsite/back/products-microsite.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TermsDialogComponent } from '../../pages/home/terms-modal/terms-dialog.component';
import { ModalReactivateUserComponent } from '../modal-reactivate-user/modal-reactivate-user.component';
import { ModalGoToStoreComponent } from '../modal-go-to-store/modal-go-to-store.component';
import { ModalAlertComponent } from '../modal-alert/modal-alert.component';


@Component({
  selector: 'navigation-top-login',
  templateUrl: './navigation-top-login.component.html',
  styleUrls: ['./navigation-top-login.component.scss']
})
export class NavigationTopLoginComponent implements    OnInit, AfterViewInit {
  public loginForm: FormGroup;
  public errorLogin: String;
  private userCountry: any;
  @ViewChild('email') email: ElementRef;
  @ViewChild('pass') pass: ElementRef;
  public readonly shop: string = `/${ROUTES.SHOPS.LINK}`;

  constructor(
    private loginService: LoginService,
    private currentSessionService: CurrentSessionService,
    private changeRef: ChangeDetectorRef,
    private router: Router,
    private userService: UserService,
    private messagesService: MessagesService,
    private modalFeedBackService: ModalFeedBackService,
    private productsService: ProductsService,
    private productsMicrositeService: ProductsMicrositeService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });

  }

  ngAfterViewInit(): void {

  }

  goToHome() {
    const url = `${ROUTES.HOME}`;
    `/${url}` === this.router.url
      ? location.reload()
      : this.router.navigate([url]);
  }

  markAsTouched(control) {
    control.markAsTouched();
    this.errorLogin = '';
  }

  gapush(method, type, category, action, label) {
    const paramsGa = {
      event: 'pushEventGA',
      method: method,
      type: type,
      categoria: category,
      accion: action,
      etiqueta: label
    };
    window['dataLayer'].push(paramsGa);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email').value.toLowerCase();
      const password = this.loginForm.get('password').value;
      this.login(email, password);
    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
       control.markAsDirty({ onlySelf: true });
       control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  checkNotificationHobbies(idUser) {
    this.messagesService.checkNotificationHobbies(idUser)
     .subscribe(
       state => {
       },
       error => console.log(error)
     );
   }


   openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
   // dialogConfig.height = '600px';
    dialogConfig.width = '55%';
    dialogConfig.disableClose = true;
 //   dialogConfig.autoFocus = false;
    dialogConfig.data = this.loginForm.get('email').value.toLowerCase();
    const dialogRef = this.dialog.open(TermsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.onSubmit();
    });
  }

  openDialogReactivate(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
   // dialogConfig.height = '600px';
    dialogConfig.width = '55%';
    // dialogConfig.disableClose = true;
 //   dialogConfig.autoFocus = false;
    dialogConfig.data = this.loginForm.get('email').value.toLowerCase();
    const dialogRef = this.dialog.open(ModalReactivateUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // this.onSubmit();
    });
  }

   login(userEmail: string, password: string) {
     const user = {
       user: userEmail.toLowerCase(),
       password: password,
       ipAddress: '127.0.0.0'
     };
     this.loginService.logOutClearSession(user.user).subscribe(data => {
       if (data.status === 200) {
         this.loginService.loginSapiUser(user)
           .then(response => {
             if (response.status === 200) {
               this.gapush(
                 'send',
                 'event',
                 'Ingreso',
                 'ClicLogin',
                 'IngresarExitosamente'
               );
               const saveInfo = {
                 'auth-token': response.body.data.token,
                 email: response.body.data.userProperties.email,
                 id: response.body.data.userProperties.roles[0],
                 rol: response.body.data.userProperties.roles[1],
                 'id-number': response.body.data.userProperties.identification,
                 name: response.body.data.userProperties.fullname,
                 photo: {
                   id: ' ',
                   url: ' '
                 }
               };

               this.modalFeedBackService.close('custom-modal-1');
               this.currentSessionService.setSession(saveInfo);
               this.currentSessionService.getIdUser();
               this.setUserCountry(saveInfo);
               this.checkNotificationHobbies(saveInfo.id);
             }
             if (response.status === 401) {
               this.errorLogin = 'Usuario o contraseña incorrecto.';
               this.changeRef.markForCheck();
             }
             if (response.status === 500) {
               this.errorLogin =
                 '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
               this.changeRef.markForCheck();
             }
             if (response.status === 700) {
              this.errorLogin = response.message;
              this.reSendEmail(userEmail);
              this.changeRef.markForCheck();
            }
            if (response.status === 800) {
              this.errorLogin = 'Tu cuenta fue desactivada, comunícate con info@rotalo.com.co para darte más información.';
              this.changeRef.markForCheck();
            }
            if (response.status === 801) {
              this.openDialogReactivate();
              //this.changeRef.markForCheck();
            }

            if (response.status === 9999) {
              this.openDialog();
            }

           })
           .catch(httpErrorResponse => {
             console.error(httpErrorResponse);
             if (httpErrorResponse.status === 401) {
               this.errorLogin = 'No puede tener más de 1 sesión activas.';
             }
             if (httpErrorResponse.status === 403) {
             }
             if (httpErrorResponse.status === 422) {
               this.errorLogin = httpErrorResponse.error.errors[0].title;
             }
             if (httpErrorResponse.status === 0) {
               this.errorLogin =
                 '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
             }
             this.changeRef.markForCheck();
           });
       }
     });
   }


   reSendEmail (email) {
    let idCountry;
    const currentUrl = window.location.href;
    if (currentUrl.includes('gt')) {
      idCountry = 9;
    } else {
      idCountry = 1;
    }
      const params = {
        'pais': idCountry,
        'correo': email
      };
      this.userService.reSendEmail(params).subscribe(response => {
      }, error => {
        console.log(error);
      });
  }

   async setUserCountry(userInfo) {
     try {
       const user = await this.userService.getInfoUser();
       this.userCountry = user.city.state.country.id;
       const userLogin = Object.assign({}, userInfo, {
         countryId: this.userCountry
       });
       this.currentSessionService.setSession(userLogin);
       if (this.productsService.getUrlDetailProduct()) {
        window.location.replace(this.productsService.getUrlDetailProduct());
      } else if (this.productsMicrositeService.getUrlShop()) {
        window.location.replace(this.productsMicrositeService.getUrlShop());
      } else {
        this.router.navigate([
          `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
        ]);

        let showBancolombiaProducts = false;
        user && user.company && user.company.name == 'Bancolombia' ?
        showBancolombiaProducts = true : showBancolombiaProducts = false;
       /* if (showBancolombiaProducts) {
          this.openDialogGoToStore();
        }*/

       const currentUrl = window.location.href;
        if (!currentUrl.includes('gt') &&
        user && user.company && user.company.name == 'Bancolombia' &&
        user && user.city && user.city.state && (user.city.state.id == '1' || user.city.state.id == 1 )) {
          this.openDialogAlert();
        }
      }
     } catch (error) {
       console.error(error);
     }
   }

   openDialogGoToStore(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '900px';
    dialogConfig.width = '55%';
    dialogConfig.panelClass = 'store-dialog-container-class';
  //  dialogConfig.minHeight = '350px';
    // dialogConfig.disableClose = true;
    // dialogConfig.data = this.loginForm.get('email').value.toLowerCase();
    const dialogRef = this.dialog.open(ModalGoToStoreComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogAlert(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '680px';
    dialogConfig.width = '55%';
    dialogConfig.panelClass = 'alert-class';
  //  dialogConfig.minHeight = '350px';
    // dialogConfig.disableClose = true;
    // dialogConfig.data = this.loginForm.get('email').value.toLowerCase();
    const dialogRef = this.dialog.open(ModalAlertComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

   get isColombia() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('gt')) {
      return false;
    }
    return true;
   }


}
