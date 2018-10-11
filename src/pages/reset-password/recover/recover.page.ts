import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RecoverService } from '../../../services/reset-password/recover.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';

@Component({
  selector: 'recover-page',
  templateUrl: 'recover.page.html',
  styleUrls: ['recover.page.scss']
})
export class RecoverPage implements OnInit {
  public recoverForm: FormGroup;
  public errorLogin: String;
  constructor(private recoverService: RecoverService,
    private router: Router) { }

  ngOnInit(): void {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)])
    });
  }
  onSubmit() {
    if (this.recoverForm.valid) {
      const email = this.recoverForm.get('email').value;
      this.recover(email);
    }
  }
  recover(userEmail: string) {
    const currentUrl = window.location.href;
    let idCountry;
    if (currentUrl.includes('gt')) {
      idCountry = 9;
    }else {
      idCountry = 1;
    }
    const params = {
     'pais': idCountry,
     'correo': userEmail
    };
    this.recoverService.recoverUser(params).subscribe(
      (response) => {
        this.router.navigate([`/${ROUTES.RESETPASS}/${ROUTES.CONFIRM}`]);
      },
      (error) => {
       this.errorLogin = error.error.message;
      }
    );
  }
}
