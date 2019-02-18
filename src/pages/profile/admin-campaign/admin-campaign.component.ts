import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';

@Component({
  selector: 'admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {
  searchText = '';
  selectState = '';
  selectAllCheck = false;

  states = ['En proceso', 'Finalizado'];
  campaigns = [
    {
      titulo: 'la tarjeta Rótalo',
      comunidades: 'Bancolombia, Argos, Grupo Orbis',
      date: '01/03/2018',
      estado: 'En proceso'
    },
    {
      titulo: 'la tarjeta Rótalo',
      comunidades: 'Bancolombia, Argos, Grupo Orbis',
      date: '01/03/2019',
      estado: 'En proceso'
    },
    {
      titulo: 'Otra campaña',
      comunidades: 'Bancolombia, Argos, Grupo Orbis',
      date: '01/03/2018',
      estado: 'Finalizado'
    }
  ];
  constructor(private router: Router) { }

  ngOnInit() {
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
}
