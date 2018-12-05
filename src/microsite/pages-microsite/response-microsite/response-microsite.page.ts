import { Component, OnInit } from '@angular/core';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';


@Component({
  selector: 'response-microsite.page',
  templateUrl: './response-microsite.page.html',
  styleUrls: ['./response-microsite.page.scss']
})

export class ResponseMicrositePage implements OnInit {
  success = true;
  loading = false;
  titleSuccess = "¡Felicitaciones!";
  titleError = "¡Malas noticias!";
  subtitleSuccess = "Tu compra fue increiblemente exitosa";
  subtitleError = "Tu compra no se pudo procesar, vuelve a intentarlo";
  title: string;
  subtitle: string;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    if (this.success) {
      this.title = this.titleSuccess;
      this.subtitle = this.subtitleSuccess;
    } else {
      this.title = this.titleError;
      this.subtitle = this.subtitleError;
    }
  }

  goToMicrosite() {
    this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.MICROSITE.LINK}/${ROUTES.MICROSITE.FEED}`]);
  }
}
