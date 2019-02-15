import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { UtilsService } from '../../../util/utils.service';

@Component({
  selector: 'campaign-upload',
  templateUrl: './campaign-upload.component.html',
  styleUrls: ['./campaign-upload.component.scss']
})
export class CampaignUploadComponent implements OnInit {
  public errorChange = '';
  public successChange = false;
  constructor(private settingsService: SettingsService,  private utilsService: UtilsService) { }

  ngOnInit() {
  }

  uploadCampaign (event) {
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

}
