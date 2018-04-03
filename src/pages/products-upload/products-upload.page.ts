import { ProductsService } from "../../services/products.service";
import { Router } from "@angular/router";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ROUTES } from "../../router/routes";
import { UserService } from "../../services/user.service";

@Component({
  selector: "roducts-upload",
  templateUrl: "./products-upload.page.html",
  styleUrls: ["./products-upload.page.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsUploadPage implements OnInit {
  constructor(
    private productsService: ProductsService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {}

  async publishPhoto(event) {
    try {
      const response = await this.productsService.saveProducts(event);
      this.gapush('send', 'event', 'Ofertas', 'ClicFormularioOferta', 'SubirOfertaExitosa');
      this.userService.updateInfoUser();
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  gapush(method, type, category, action, label) {
    const paramsGa = {
      method: method,
      type: type,
      category: category,
      action: action,
      label: label
    };
    window['dataLayer'].push(paramsGa);
    console.log(window);
  }
}
