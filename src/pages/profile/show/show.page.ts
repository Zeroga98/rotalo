import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'show-page',
  templateUrl: 'show.page.html',
  styleUrls: ['show.page.scss']
})
export class ShowPage implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  onLogout() {
    this.loginService.logout();
  }
}
