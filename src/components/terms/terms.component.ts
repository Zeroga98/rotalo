import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SettingsService } from '../../services/settings.service';


@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  private currentUrl = '';
  public terms = '';
  constructor( private settingsService: SettingsService, private changeDetector: ChangeDetectorRef) {
    this.currentUrl = window.location.href;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.settingsService.getTerms().subscribe((response) => {
      this.terms = response.body.terminoCondicion.content;
      this.settingsService.setIdterms(response.body.terminoCondicion.id);
      this.changeDetector.markForCheck();
    } ,
    (error) => {
      console.log(error);
    });
  }

  get isGuatemala() {
    if (this.currentUrl.includes('gt')) {
      return true;
    }
    return false;
  }

}
