import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';
import { SettingsService } from '../../../services/settings.service';
import * as moment from 'moment';

@Component({
  selector: 'admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {
  searchText = '';
  selectState = '';
  selectAllCheck = false;
  states = ['Programada', 'En Curso', 'Terminada', 'Ganada', 'Inactiva'];
  campaigns = [];
  edit: string = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.UPLOAD}/`;
  constructor(private router: Router, private settingsService: SettingsService) { }

  ngOnInit() {
    this.getCampaignsList();
  }

  goToUploadCampaign() {
    this.router.navigate([
      `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.UPLOAD}`
    ]);
  }

  selectAll() {
    const container = document.getElementById('campaigns-wrap');
    const inputs = container.getElementsByClassName('delete');
    this.selectAllCheck = !this.selectAllCheck;
    for (let i = 0; i < inputs.length; ++i) {
      const input = inputs[i] as HTMLInputElement;
      input.checked = this.selectAllCheck;
    }
  }

  getCampaignsList() {
    this.settingsService.getCampaignsList().subscribe((response) => {
      if (response.body) {
        this.campaigns = response.body.campaigns;
        this.campaigns.map((item) => {
          const dateMoment: any = moment(item['createdAt']);
          item['createdAt'] = dateMoment.format('DD/MM/YYYY');
        });
      }
    }, (error) => {
      console.log(error, 'error');
    });
  }

  saveCheck(check, idCampaign) {
    check = !check;
    const param =  {
      active: check
    };
    this.settingsService.changeStateCampaign(idCampaign, param).subscribe((response) => {
      this.getCampaignsList();
    }, (error) => {
      if (error.error) {
        this.getCampaignsList();
        alert(error.error.message);
      }
      console.log(error, 'error');
    });
  }

  deletCampaign () {
    const container = document.getElementById('campaigns-wrap');
    const inputs = container.getElementsByClassName('delete');
    const arrayToDelete = [];
    for (let i = 0; i < inputs.length; ++i) {
      const input = inputs[i] as HTMLInputElement;
      if (input && input.checked == true) {
        arrayToDelete.push(parseInt(input.id));
      }
    }

    if (arrayToDelete.length > 0) {
      arrayToDelete.map((idCampaign) => {
        this.settingsService.deleteCampaign(idCampaign).subscribe((response) => {
          this.getCampaignsList();
        },
        (error) => {
          console.log(error);
        });
      });
    }
  }

  getUrlCampaign (idCampaign) {
    return this.edit + idCampaign;
  }

}
