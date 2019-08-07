import { Component, OnInit } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';
import { FrequentlyAskedQuestionsService } from '../../services/frequently-asked-questions.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

@Component({
  selector: 'app-frequently-asked-questions',
  templateUrl: './frequently-asked-questions.component.html',
  styleUrls: ['./frequently-asked-questions.component.scss']
})
export class FrequentlyAskedQuestionsComponent implements OnInit {
  public showHeader = false;
  public introduction: String;
  public questions;
  constructor(private currentSessionService: CurrentSessionService,
    private router: Router,
    private frequentlyAskedQuestionsService: FrequentlyAskedQuestionsService) {
    if (this.currentSessionService.currentUser()) {
      this.showHeader = true;
    }
  }
  ngOnInit() {
    this.loadfrequentlyAskedQuestions();
  }

  loadfrequentlyAskedQuestions() {
    this.frequentlyAskedQuestionsService.getFrequentlyAskedQuestions(1).subscribe(
      response => {
        this.introduction = response.introduccion;
        this.questions = response.faqs;
      },
      error => {
        console.log(error);
        this.redirectErrorPage();
      }
    );
  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

}
