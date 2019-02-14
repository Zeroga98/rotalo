import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'campaign-upload',
  templateUrl: './campaign-upload.component.html',
  styleUrls: ['./campaign-upload.component.scss']
})
export class CampaignUploadComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
  }

  publishPhoto (event) {
    this.settingsService.createCampaign(event).subscribe((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

}
