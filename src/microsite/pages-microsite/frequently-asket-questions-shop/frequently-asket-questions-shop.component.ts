import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrentSessionService } from '../../../services/current-session.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  private currentUrl = '';
  public params;
  constructor(
    private route: ActivatedRoute,
    private currentSessionService: CurrentSessionService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
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

    get isGuatemala() {
      if (this.currentUrl.includes('gt')) {
        return true;
      }
      return false;
    }

    loadfrequentlyAskedQuestions(params) {
      this.frequentlyAskedQuestionsService.getFrequentlyAskedQuestions(params).subscribe(
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
