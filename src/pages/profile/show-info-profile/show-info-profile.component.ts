import { Component, OnInit } from '@angular/core';
import { CurrentSessionService } from '../../../services/current-session.service';
import { ResumeRotaloCenterService } from '../../../services/resume-rotalo-center.service';
import { HobbiesService } from '../../../services/hobbies.service';
import { UserService } from '../../../services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-show-info-profile',
  templateUrl: './show-info-profile.component.html',
  styleUrls: ['./show-info-profile.component.scss']
})
export class ShowInfoProfileComponent implements OnInit {
  private userId;
  private currentUser;
  public email;
  public mainRanking = 0;
  public dateCreated;
  public hobbies: Array<any> = [];
  constructor(private resumeRotaloCenterService: ResumeRotaloCenterService,
    private currentSessionService: CurrentSessionService,
    private hobbiesService: HobbiesService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userId = this.currentSessionService.getIdUser();
    this.currentUser = this.currentSessionService.currentUser();
    if (this.currentUser) {
     this.email = this.currentUser.email;
    }
    this.loadResume(this.userId);
    this.loadHobbies();
  }

  loadHobbies() {
    this.hobbiesService.getHobbies(this.userId).subscribe(
      state => {
        this.hobbies = state.body.intereses;
      },
      error => console.log(error)
    );
  }

  loadResume(userId) {
    this.userService.getInfomationUser(userId).then((response) => {
      const dateMoment: any = moment(response['created-at']);
      this.dateCreated = dateMoment.format('DD MMMM YYYY');
    }) .catch(httpErrorResponse => {
      console.log(httpErrorResponse);
    });
    this.resumeRotaloCenterService.resumeRotaloCenter(userId).subscribe(
      state => {
        this.mainRanking = state.body.calificacionGeneral;
      },
      error => console.log(error)
    );
  }

}
