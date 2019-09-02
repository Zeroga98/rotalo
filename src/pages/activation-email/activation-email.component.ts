import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'activation-email',
  templateUrl: './activation-email.component.html',
  styleUrls: ['./activation-email.component.scss']
})
export class ActivationEmailComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute) { }
  public country;
  public email;
  public showMessageEmail = false;
  public showMessageError = false;
  public error;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.country = params['country'];
      this.email = params['email'];
    });
  }

  reSendEmail() {
    this.showMessageEmail = false;
     const params = {
        'pais': this.country ? this.country : '',
        'correo': this.email ? this.email : ''
      };
      this.userService.reSendEmail(params).subscribe(response => {
        this.showMessageError = false;
        this.showMessageEmail = true;
      }, error => {
        console.log(error);
        this.showMessageError = true;
        this.showMessageEmail = false;
        if (error.error && error.error.message) {
          this.error = error.error.message;
        }
      });
  }

}
