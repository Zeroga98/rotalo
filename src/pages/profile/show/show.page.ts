import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { UserService } from '../../../services/user.service';
<<<<<<< HEAD

=======
>>>>>>> 3134b85bddca5e4f7b74da4ef1844bdedc08e0f7

@Component({
  selector: 'show-page',
  templateUrl: 'show.page.html',
  styleUrls: ['show.page.scss']
})
export class ShowPage implements OnInit {
<<<<<<< HEAD
  selling: String;
  staged: String;
  userInfo: any;
=======
  public userInfo: any;
  public selling;
  public staged;
>>>>>>> 3134b85bddca5e4f7b74da4ef1844bdedc08e0f7
  constructor(private loginService: LoginService, private userService: UserService) { }

  ngOnInit() {
    this.getUserInfo();
<<<<<<< HEAD
  }

  async getUserInfo() {
    this.userInfo = await this.userService.getInfoUser();
    this.selling = this.userInfo.selling;
    this.staged = this.userInfo.staged;
=======
>>>>>>> 3134b85bddca5e4f7b74da4ef1844bdedc08e0f7
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
