import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrentSessionService } from '../../../services/current-session.service';
import { Router } from '@angular/router';
import { FrequentlyAskedQuestionsService } from '../../../services/frequently-asked-questions.service';
import { ROUTES } from '../../../router/routes';

@Component({
  selector: 'frequently-asket-questions-shop',
  templateUrl: './frequently-asket-questions-shop.component.html',
  styleUrls: ['./frequently-asket-questions-shop.component.scss']
})
export class FrequentlyAsketQuestionsShopComponent implements OnInit {
  public showHeader = false;
  public introduction: String;
  public questions;
  constructor(private currentSessionService: CurrentSessionService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private frequentlyAskedQuestionsService: FrequentlyAskedQuestionsService) {
      if (this.currentSessionService.currentUser()) {
        this.showHeader = true;
      }
    }

    ngOnInit() {
      this.loadfrequentlyAskedQuestions();
    }

    loadfrequentlyAskedQuestions() {
      this.frequentlyAskedQuestionsService.getFrequentlyAskedQuestions(2).subscribe(
        response => {
          this.introduction = response.introduccion;
          this.questions = response.faqs;
          this.changeDetector.markForCheck();
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
