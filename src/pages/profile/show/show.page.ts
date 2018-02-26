import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'show-page',
  templateUrl: 'show.page.html',
  styleUrls: ['show.page.scss']
})
export class ShowPage implements OnInit {
  public userInfo: any;
  public selling;
  public staged;
  constructor(private loginService: LoginService, private userService: UserService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  onLogout() {
    this.loginService.logout();
  }

  async getUserInfo() {
    this.userInfo = await this.userService.getInfoUser();
    this.selling = this.userInfo.selling;
    this.staged = this.userInfo.staged;
  }
}
