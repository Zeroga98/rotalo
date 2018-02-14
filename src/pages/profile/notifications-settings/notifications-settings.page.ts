import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'notifications-settings',
  templateUrl: 'notifications-settings.page.html',
  styleUrls: ['notifications-settings.page.scss']
})
export class NotificationsSettingsPage implements OnInit {
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
    label: 'Notifícame cuando alguien rechaze mi compra.',
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
  constructor() { }

  ngOnInit() {
  }

}
