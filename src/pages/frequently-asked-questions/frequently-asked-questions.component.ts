import { Component, OnInit } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: 'app-frequently-asked-questions',
  templateUrl: './frequently-asked-questions.component.html',
  styleUrls: ['./frequently-asked-questions.component.scss']
})
export class FrequentlyAskedQuestionsComponent implements OnInit {
  public showHeader = false;
  constructor(private currentSessionService: CurrentSessionService) {
    if (this.currentSessionService.currentUser()) {
      this.showHeader = true;
    }
  }
  ngOnInit() {
  }

}
