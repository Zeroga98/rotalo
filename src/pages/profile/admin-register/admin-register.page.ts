import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../router/routes';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'admin-register',
  templateUrl: 'admin-register.page.html',
  styleUrls: ['admin-register.page.scss']
})
export class AdminRegisterPage implements OnInit {

  public registers: Array<any> = [];
  public typeOrders: Array<any> = [];
  public noRegisters;
  public description = '';
  public showModalDescription: boolean;
  public referenceNumber;
  public statusOrder;
  public isEmpty: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private settingsService: SettingsService,
    private currentSessionSevice: CurrentSessionService) {
  }

  ngOnInit(): void {
    const currentUser = this.currentSessionSevice.currentUser();
    if (currentUser['rol'] != 'superuser') {
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    }
    this.loadRegisters();
  }

  loadRegisters() {
    this.settingsService.getPreRegisters().subscribe((response) => {
      this.registers = response.body.preregistros;
      console.log(this.registers);
      if (this.registers && this.registers.length > 0) {
        this.noRegisters = false;
      } else {
        this.noRegisters = true;
      }
    }, (error) => {
      console.log(error);
    });
  }

  async deletePreRegister(id) {
    try {
      const result = confirm('¿Estás seguro de eliminar este registro?');
      if (!result) {
        return;
      }
      const response = await this.settingsService.deleteProduct(id);
      this.loadRegisters();
    } catch (error) {}
  }


  reSendEmail(preregister) {
      const params = {
        'pais':  preregister.documentType.countryId,
        'correo': preregister.email
      };
      this.userService.reSendEmail(params).subscribe(response => {
        alert('¡El correo se envió con éxito!');
      }, error => {
        console.log(error);
      });
  }


  openModal(referencia, estado) {
    this.referenceNumber = referencia;
    this.statusOrder = estado;
    this.showModalDescription = true;
  }

  closeModal() {
    this.showModalDescription = false;
    this.referenceNumber = null;
    this.statusOrder = null;
    this.description = null;
  }
}
