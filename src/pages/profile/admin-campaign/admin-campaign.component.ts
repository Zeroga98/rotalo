import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';

@Component({
  selector: 'admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToUploadCampaign() {
    this.router.navigate([
      `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.UPLOAD}`
    ]);
  }

}
