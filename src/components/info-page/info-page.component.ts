import { Component, OnInit, Input } from '@angular/core';
import { ROUTES } from '../../router/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss']
})
export class InfoPageComponent implements OnInit {
  [x: string]: any;
  imgName: String;
  titleInfo: String;
  descriptionInfo: String;
  descriptionInfo2: String;
  descriptionInfo3: String;

  @Input() selectValue: String;
  @Input() idProduct: String;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.selectInformation(this.selectValue);
  }

  selectInformation(key) {
    switch (key) {
      case 'success':
        this.imgName = 'icono_check';
        this.titleInfo = '¡Tu pago se ha realizado con éxito!';
        this.descriptionInfo = `Ya le notificamos al vendedor de la transacción.
        Recuerda que la entrega será realizada según lo que
        hayas acordado con el vendedor.`;
        break;

        case 'expire':
        this.imgName = 'icono_error';
        this.titleInfo = '¡Te estábamos esperando! El pago ha caducado.';
        this.descriptionInfo = `El pago ha caducado. El servicio de pago a través de
        Nequi debe completarse antes de 15 minutos.
        Debes volver a comenzar el proceso de compra para
        completar todo el proceso. Recuerda estar atento a
        las notificaciones en tu celular.`;
        break;

        case 'error':
        this.imgName = 'icono_error';
        this.titleInfo = 'Algo salió mal.';
        this.descriptionInfo = `La transacción no fue completada con éxito.
        Por favor vuelve a comenzar el proceso de pago. Si
        el problema persiste y no logras realizar la compra
        ponte en contacto con el equipo de Rótalo al
        correo: info@rótalo.co`;
        break;
      default:
        break;
    }
  }

  redirectPage() {
    switch (this.selectValue) {
      case 'success':
        this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
        ]);
        break;

        case 'expire':
        this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${
          ROUTES.PRODUCTS.SHOW
        }/${this.idProduct}`]);
        break;

        case 'error':
        this.router.navigate([`${ROUTES.PRODUCTS.LINK}/${
          ROUTES.PRODUCTS.SHOW
        }/${this.idProduct}`]);
        break;

      default:
        this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
        ]);
        break;
    }
  }


}
