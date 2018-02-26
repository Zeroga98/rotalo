import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'show-page',
  templateUrl: 'show.page.html',
  styleUrls: ['show.page.scss']
})
export class ShowPage implements OnInit {
  selling: String;
  staged: String;
  userInfo: any;
  constructor(private loginService: LoginService, private userService: UserService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  async getUserInfo() {
    this.userInfo = await this.userService.getInfoUser();
    this.selling = this.userInfo.selling;
    this.staged = this.userInfo.staged;
  }

  onLogout() {
    this.loginService.logout();
  }

}
