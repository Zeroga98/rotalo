import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { UserService } from '../../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'show-page',
  templateUrl: 'show.page.html',
  styleUrls: ['show.page.scss']
})
export class ShowPage implements OnInit {
  selling: String;
  staged: String;
  userInfo: any;
  photoUrl: String;
  photoProfile: any;
  userName: String;
  constructor(private sanitizer: DomSanitizer, private loginService: LoginService, private userService: UserService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  async getUserInfo() {
    this.userInfo = await this.userService.getInfoUser();
    this.userName =   this.userInfo.name;
    this.selling = this.userInfo.selling;
    this.staged = this.userInfo.staged;
    this.photoUrl = this.userInfo.photo.url;
    this.photoProfile = this.sanitizer.bypassSecurityTrustStyle('url(' + this.photoUrl + ')');
  }

  onLogout() {
    this.loginService.logout();
  }

}
