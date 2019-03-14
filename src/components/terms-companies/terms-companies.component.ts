import { Component, OnInit } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';

@Component({
  selector: 'terms-companies',
  templateUrl: './terms-companies.component.html',
  styleUrls: ['./terms-companies.component.scss']
})
export class TermsCompaniesComponent implements OnInit {
  public showHeader = false;
  private currentUrl = '';
  constructor(private currentSessionService: CurrentSessionService) {
    this.currentUrl = window.location.href;
    if (this.currentSessionService.currentUser()) {
      this.showHeader = true;
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  get isGuatemala() {
    if (this.currentUrl.includes('gt')) {
      return true;
    }
    return false;
  }

}
