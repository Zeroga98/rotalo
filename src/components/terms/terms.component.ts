import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  private currentUrl = '';
  public terms = '';
  public params;
  @Input() showTitle = true;
  constructor( private route: ActivatedRoute, private settingsService: SettingsService, private changeDetector: ChangeDetectorRef) {
    this.currentUrl = window.location.href;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    const params = {
      pais: 1,
    };

    if (this.isGuatemala) {
      params.pais = 9;
    }
    this.route.params.subscribe(p => {
      this.params = p;
    //  let tienda;
   /*   if (this.params['id']) {
        tienda = this.params['id'];
        params = {
          pais: pais,
          tienda: tienda
        };
      }*/

      this.settingsService.getTerms(params).subscribe((response) => {
        if (response.body && response.body.terminoCondicion) {
          this.terms = response.body.terminoCondicion.content;
          this.settingsService.setIdterms(response.body.terminoCondicion.id);
          this.changeDetector.markForCheck();
        }
      } ,
      (error) => {
        console.log(error);
      });

    });
  }

  get isGuatemala() {
    if (this.currentUrl.includes('gt')) {
      return true;
    }
    return false;
  }


}
