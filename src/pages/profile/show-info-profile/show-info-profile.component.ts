import { Component, OnInit } from '@angular/core';
import { CurrentSessionService } from '../../../services/current-session.service';
import { ResumeRotaloCenterService } from '../../../services/resume-rotalo-center.service';
import { HobbiesService } from '../../../services/hobbies.service';

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
  public hobbies: Array<any> = [];
  constructor(private resumeRotaloCenterService: ResumeRotaloCenterService,
    private currentSessionService: CurrentSessionService,
    private hobbiesService: HobbiesService
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
        console.log(state.body.intereses);
        this.hobbies = state.body.intereses;
      },
      error => console.log(error)
    );
  }


  loadResume(userId) {
    /**valor id usuario quemado */
    this.resumeRotaloCenterService.resumeRotaloCenter(userId).subscribe(
      state => {
        this.mainRanking = state.body.calificacionGeneral;
      },
      error => console.log(error)
    );
  }

}
