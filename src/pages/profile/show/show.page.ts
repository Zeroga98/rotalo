import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { UserService } from '../../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CountryInterface } from '../../../components/select-country/country.interface';
import { CurrentSessionService } from '../../../services/current-session.service';

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
  defaultCountry: CountryInterface;
  constructor(private sanitizer: DomSanitizer, private loginService: LoginService, private userService: UserService,
    private currentSession: CurrentSessionService) {
    this.defaultCountry = { id: this.currentSession.currentUser()['countryId'] };
   }

  ngOnInit() {
    this.getUserInfo();
  }

  async getUserInfo() {
    try {
      this.userInfo = await this.userService.getInfoUser();
      this.setUserinfo();
    } catch (error) {
      console.error(error);
    }
  }

  setUserinfo() {
    this.userName =   this.userInfo.name;
    this.selling = this.userInfo.selling;
    this.staged = this.userInfo.staged;
    if (this.userInfo.photo) {
      this.photoUrl = this.userInfo.photo.url;
      this.photoProfile = this.sanitizer.bypassSecurityTrustStyle('url(' + this.photoUrl + ')');
    }
  }

  onLogout() {
    location.reload();
    this.loginService.logout();
  }

}
