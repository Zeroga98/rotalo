import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SimulateCreditService } from '../../services/simulate-credit.service';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-modal-contact-sufi',
  templateUrl: './modal-contact-sufi.component.html',
  styleUrls: ['./modal-contact-sufi.component.scss']
})
export class ModalContactSufiComponent implements OnInit {
  public contactUser: FormGroup;
  public showSuccess = false;
  public errorSuccess = false;
  private params;

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private dialogRef: MatDialogRef<ModalContactSufiComponent>,
    private simulateCreditService: SimulateCreditService,
    @Inject(MAT_DIALOG_DATA) data) {
      this.params = data;
    }

  ngOnInit() {
    this.initSufiForm();
  }

  initSufiForm() {
    this.contactUser = this.fb.group({
      'celular': ['', [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      'horarioContacto': ['Mañana', Validators.required],
      'check-authorization': ['', Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  creditRequest() {
    if (this.contactUser.valid && this.contactUser.get('check-authorization').value) {
      const celular = this.contactUser.get('celular').value;
      const horarioContacto = this.contactUser.get('horarioContacto').value;
      let infoVehicle = {
        'celular': celular,
        'horarioContacto': horarioContacto,
        'storeId': this.configurationService.storeIdPrivate
      };
      infoVehicle = Object.assign({}, infoVehicle,  this.params);
      this.simulateCreditService.sendSimulateCreditFeria(infoVehicle).then(response => {
        this.errorSuccess = false;
        this.showSuccess = true;
        this.gapush(
          'send',
          'event',
          'ProductosSufi',
          'ClicQuieroMasInfoSimulador',
          'EnvioExitoso'
        );
      }).catch(httpErrorResponse => {
        console.log(httpErrorResponse);
       });

  } else  {
    this.errorSuccess = true;
    this.showSuccess = false;
  }
}


gapush(method, type, category, action, label) {
  const paramsGa = {
    event: 'pushEventGA',
    method: method,
    type: type,
    categoria: category,
    accion: action,
    etiqueta: label
  };
  window['dataLayer'].push(paramsGa);
}



}
