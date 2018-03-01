import { ProductsService } from "../../services/products.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ROUTES } from "../../router/routes";
import { UserService } from "../../services/user.service";

@Component({
  selector: "roducts-upload",
  templateUrl: "./products-upload.page.html",
  styleUrls: ["./products-upload.page.scss"]
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
      this.userService.updateInfoUser();
      this.router.navigate([
        `/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`
      ]);
    } catch (error) {
      console.error("Error: ", error);
    }
  }
}
