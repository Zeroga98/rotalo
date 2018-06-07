import { Component } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';
@Component({
    selector: 'terms-page',
    templateUrl: './terms.page.html',
    styleUrls: ['./terms.page.scss']
})
export class TermsPage{
  public showHeader = false;
  constructor(private currentSessionService: CurrentSessionService) {
    if (this.currentSessionService.currentUser()) {
      this.showHeader = true;
    }
  }
}
