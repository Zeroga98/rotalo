import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PreferenceService } from '../../../services/profile/preference.service';
import { UtilsService } from '../../../util/utils.service';


@Component({
  selector: 'notifications-settings',
  templateUrl: 'notifications-settings.page.html',
  styleUrls: ['notifications-settings.page.scss']
})
export class NotificationsSettingsPage implements OnInit {
  @ViewChild('f') preferenceForm: NgForm;
  public disableButton;
  preferenceOptions = [{
    category: 'Publicaciones',
    label: 'Notifícame cuando una publicación expire.',
    key: 'product-expired'
  },
  {
    category: 'Conversaciones',
    label: 'Notifícame cuando reciba un mensaje.',
    key: 'new-message'
  },
  {
    category: 'Ofertas',
    label: 'Notifícame cuando reciba una oferta sobre mis productos.',
    key: 'new-offer'
  },
  {
    category: 'Ofertas',
    label: 'Notifícame cuando alguien acepte mis ofertas.',
    key: 'offer-accepted'
  },
  {
    category: 'Ofertas',
    label: 'Notifícame cuando alguien rechaze mis ofertas.',
    key: 'offer-declined'
  },
  {
    category: 'Ofertas',
    label: 'Notifícame cuando alguien retire su oferta sobre uno de mis productos.',
    key: 'offer-regretted'
  },
  {
    category: 'Compras',
    label: 'Notifícame cuando alguien compre alguno de mis productos.',
    key: 'new-purchase'
  },
  {
    category: 'Compras',
    label: 'Notifícame cuando alguien acepte mi compra.',
    key: 'purchase-accepted'
  },
  {
    category: 'Compras',
    label: 'Notifícame cuando alguien rechace mi compra.',
    key: 'purchase-declined'
  },
  {
    category: 'Subastas',
    label: 'Notifícame cuando una de mis subastas finalice.',
    key: 'auction-finished'
  },
  {
    category: 'Subastas',
    label: 'Notifícame cuando haya ganado una subasta.',
    key: 'auction-assigned'
  },
  {
    category: 'Calificaciones',
    label: 'Notifícame cuando deba calificar a un vendedor.',
    key: 'rate-seller'
  },
  {
    category: 'Calificaciones',
    label: 'Notifícame cuando deba calificar a un comprador.',
    key: 'rate-buyer'
  }
];

public errorChange: String;
public messageChange: String;
public preferencesArray: Array<string> = [];
public userId: string;


  constructor(private preferenceService: PreferenceService,
    private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.initPreference();
    this.disableButton = true;
  }

   activateButton () {
      this.disableButton = false;
  }

  initPreference() {
    this.preferenceService.getPreference().then(response => {
      this.preferencesArray = response.body;
      })
      .catch(httpErrorResponse => {
        this.messageChange = '';
        if (httpErrorResponse.status === 403) {
        }
        if (httpErrorResponse.status === 422) {
          this.errorChange = httpErrorResponse.error.errors[0].title;
        }
        if (httpErrorResponse.status === 0) {
          this.errorChange = '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
        }
      });
  }

  updatePreference() {

    const userPreference = {
      'preferences':  this.preferencesArray
    };
    this.preferenceService.updatePrefarence(userPreference).then(response => {
      this.messageChange = 'Sus preferencias se ha guardado correctamente.';
      this.errorChange = '';
      }).catch(httpErrorResponse => {
        this.messageChange = '';
        if (httpErrorResponse.status === 403) {
        }
        if (httpErrorResponse.status === 422) {
          this.errorChange = httpErrorResponse.error.errors[0].title;
        }
        if (httpErrorResponse.status === 0) {
          this.errorChange = '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
        }
      });
  }

  onSubmit() {
    this.updatePreference();
    this.utilsService.goToTopWindow(20, 600);
  }
}
