import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'terms-shop-component',
  templateUrl: './terms-shop-component.component.html',
  styleUrls: ['./terms-shop-component.component.scss']
})
export class TermsShopComponentComponent implements OnInit {
  private currentUrl = '';
  public terms = '';
  @Input() showTitle = true;
  constructor(private settingsService: SettingsService, private changeDetector: ChangeDetectorRef) {
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