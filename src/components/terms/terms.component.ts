import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';


@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  private currentUrl = '';
  constructor( private settingsService : SettingsService) {
    this.currentUrl = window.location.href;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.settingsService.getTerms().subscribe((response) => {
      console.log(response);
    } ,
    (error) => { console.log(error);
    })
  }

  get isGuatemala() {
    if (this.currentUrl.includes('gt')) {
      return true;
    }
    return false;
  }

}
