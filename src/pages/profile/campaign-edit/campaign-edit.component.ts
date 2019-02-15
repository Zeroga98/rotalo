import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { UtilsService } from '../../../util/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'campaign-edit',
  templateUrl: './campaign-edit.component.html',
  styleUrls: ['./campaign-edit.component.scss']
})
export class CampaignEditComponent implements OnInit {
  public errorChange = '';
  public successChange = false;
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  constructor(private settingsService: SettingsService,
  private router: Router,
  private utilsService: UtilsService) { }
  public campaign;

  ngOnInit() {
    this.loadProduct();
  }

  updateCampaign(event) {
    this.settingsService.createCampaign(event).subscribe((response) => {
      this.successChange = true;
      this.utilsService.goToTopWindow(20, 600);
    }, (error) => {
      this.successChange = false;
      if (error.error && error.error.status) {
        this.errorChange = error.error.message;
      }
      this.utilsService.goToTopWindow(20, 600);
      console.log(error);
    });
  }

  loadProduct() {
    this.settingsService.loadCampaign(this.idProduct).subscribe((reponse) => {
      console.log(reponse);
      if (reponse.body) {
        this.campaign = reponse.body.campaign;
        // this.product = reponse.body.productos[0];
      }
    },
      (error) => {
        console.log(error);
      });
  }

}
