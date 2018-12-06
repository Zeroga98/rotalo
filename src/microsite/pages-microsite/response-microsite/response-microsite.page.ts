import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';
import { ProductsMicrositeService } from '../../services-microsite/back/products-microsite.service';
import { ShoppingCarService } from '../../services-microsite/front/shopping-car.service';


@Component({
  selector: 'response-microsite.page',
  templateUrl: './response-microsite.page.html',
  styleUrls: ['./response-microsite.page.scss']
})

export class ResponseMicrositePage implements OnInit {

  success = false;
  loading = true;
  titleSuccess = '¡Felicitaciones!';
  titleError = '¡Malas noticias!';
  subtitleSuccess = 'Tu compra fue increíblemente exitosa';
  subtitleError = 'Tu compra no se pudo procesar, vuelve a intentarlo';
  title: string;
  subtitle: string;
  jsonFromWaybox;
  products = [];

  constructor(
    private router: Router,
    private back: ProductsMicrositeService,
    private changeDetectorRef: ChangeDetectorRef,
    private car: ShoppingCarService
  ) { }

  ngOnInit() {
    this.jsonFromWaybox = JSON.parse(localStorage.getItem('jsonFromWaybox'));
    console.log(this.jsonFromWaybox)
    localStorage.removeItem('jsonFromWaybox');
    this.finalizeTransaction();
  }

  goToMicrosite() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`]);
  }

  setTexts() {
    if (this.success) {
      this.title = this.titleSuccess;
      this.subtitle = this.subtitleSuccess;
    } else {
      this.title = this.titleError;
      this.subtitle = this.subtitleError;
    }
  }

  async finalizeTransaction() {
    try {
      // Verificar la cantidad de los productos
      const response = await this.back.finalizarOrden(this.jsonFromWaybox);
      if (this.jsonFromWaybox.transaction.status == "APPROVED") {
        this.showSuccessPage();
        this.cleanShoppingCart();
        this.car.setTotalCartProducts(0);
      } else {
        this.showErrorPage();
      }
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.showErrorPage();
      this.changeDetectorRef.markForCheck();
    }
  }

  showErrorPage() {
    this.loading = false;
    this.success = false;
    this.setTexts();
  }

  showSuccessPage() {
    this.loading = false;
    this.success = true;
    this.setTexts();
  }

  async cleanShoppingCart() {
    try {
      const response_car = await this.back.getCarProducts();
      try {
        const response = await this.back.deleteProductToBD(this.getJsonProducts(response_car));
        this.changeDetectorRef.markForCheck();
      } catch (error) {
        this.changeDetectorRef.markForCheck();
      }
      this.changeDetectorRef.markForCheck();
    } catch (error) {
      this.changeDetectorRef.markForCheck();
    }
    this.changeDetectorRef.markForCheck();
  }


  getJsonProducts(response) {
    this.products = [];
    // Se obtienen todos los productos que tiene el carrito
    response.carroCompras.commerceItems.forEach(element => {
      this.products.push(element);
    });

    // Se crea el json que se envía el servicio de eliminar del carrito hecho por Jairo
    const json = {
      idProductos: []
    };

    // Se llena el json con los productos
    this.products.forEach(element => {
      json.idProductos.push(element.product.id)
    });
    return json;
  }
}

