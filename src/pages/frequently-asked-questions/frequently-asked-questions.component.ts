import { Component, OnInit } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';
import { FrequentlyAskedQuestionsService } from '../../services/frequently-asked-questions.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  private currentUrl = '';
  public params;
  constructor(
    private route: ActivatedRoute,
    private currentSessionService: CurrentSessionService,
    private router: Router,
    private frequentlyAskedQuestionsService: FrequentlyAskedQuestionsService) {
    if (this.currentSessionService.currentUser()) {
      this.showHeader = true;
    }
    this.currentUrl = window.location.href;
  }
  ngOnInit() {
    let params = {};
    let pais = 1;
    if (this.isGuatemala) {
      pais = 9;
    }
    this.route.params.subscribe(p => {
      this.params = p;
      let tienda;
      if (this.params['id']) {
        tienda = this.params['id'];
        params = {
          pais: pais,
          tienda: tienda
        };
      }
      this.loadfrequentlyAskedQuestions(params);
    });
  }

  loadfrequentlyAskedQuestions(params) {
    this.frequentlyAskedQuestionsService.getFrequentlyAskedQuestions(params).subscribe(
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

  get isGuatemala() {
    if (this.currentUrl.includes('gt')) {
      return true;
    }
    return false;
  }

  redirectErrorPage() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.ERROR}`]);
  }

}
