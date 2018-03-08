import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProductInterface } from "../../commons/interfaces/product.interface";
import { ProductsService } from "../../services/products.service";

/**Validator**/
function princeVehicleValidatorMax(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const priceValue = c.value;
  if (priceValue > 5000000000) {
    return { priceValueMax: true };
  }
  return null;
}

function princeVehicleValidatorMin(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const priceValue = c.value;
  if (priceValue < 10000000) {
    return { priceValueMin: true };
  }
  return null;
}

function initialFeeValidator(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const initialFee = c;
  if (initialFee.value < 0) {
    return { initialFee: true };
  }
  return null;
}

function feeValidator(c: AbstractControl): { [key: string]: boolean } | null {
  const formValues = c;
  const initialFee: number = formValues.value["initial-fee"];
  const priceVehicle: number = formValues.value["price-vehicle"];
  if ( Number(initialFee) > Number(priceVehicle) ) {
    return { initialFeeValidation: true };
  }
  return null;
}

function checkValidator(c: AbstractControl): { [key: string]: boolean } | null {
  const checkValues = c;
  console.log(checkValues);
  if (checkValues.value === "" || checkValues.value === false) {
    return { checkBank: true };
  }
  return null;
}

@Component({
  selector: "simulate-credit",
  templateUrl: "./simulate-credit.page.html",
  styleUrls: ["./simulate-credit.page.scss"]
})
export class SimulateCreditPage implements OnInit {
  rangeTimeToPay = "1";
  simulateForm: FormGroup;
  contactUser: FormGroup;
  product: ProductInterface;
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  showSimulator = true;
  priceVehicle: number;
  showMessageBank: boolean;
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.simulateForm = this.fb.group({
      "price-vehicle": [
        "", [ Validators.required, princeVehicleValidatorMax, princeVehicleValidatorMin]
      ],
      "initial-fee": ["0", [Validators.required, initialFeeValidator]],
      "range-time": ["", Validators.required]
    }, {validator: feeValidator});

    this.contactUser = this.fb.group({
      "phone-user": ["", [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      "contact-time": ["", Validators.required],
      "check-authorization": ["", [Validators.required, checkValidator]]
    });

    this.loadProduct();
  }

  onSubmit() {
    this.showSimulator = !this.showSimulator;
  }

  creditRequest() {
    console.log(this.contactUser);
  }

  get formIsInValid(): boolean {
    return this.simulateForm.invalid;
  }

  get formContactValid(): boolean {
    return this.contactUser.invalid;
  }

  populatePreciVehicle(product): void {
    this.simulateForm.patchValue({
      "price-vehicle": product.price
    });
  }

  isSpinnerShow() {
    return this.product;
  }

  async loadProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
      this.populatePreciVehicle(this.product);
    } catch (error) {}
  }
}
