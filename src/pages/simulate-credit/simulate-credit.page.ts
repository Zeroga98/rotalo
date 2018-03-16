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
import { SettingsService } from "../../services/settings.service";
import { SimulateCreditService } from "../../services/simulate-credit.service";
import { ROUTES } from "../../router/routes";
import { UserService } from "../../services/user.service";
import { UserInterface } from "../../commons/interfaces/user.interface";

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
  const initialFee: number = formValues.value["initial-quota"];
  const priceVehicle: number = formValues.value["credit-value"];
  if (Number(initialFee) > Number(priceVehicle)) {
    return { initialFeeValidation: true };
  }
  return null;
}

function checkValidator(c: AbstractControl): { [key: string]: boolean } | null {
  const checkValues = c;
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
  [x: string]: any;
  rangeTimeToPay = "1";
  simulateForm: FormGroup;
  contactUser: FormGroup;
  product: ProductInterface;
  idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ""));
  showSimulator = true;
  priceVehicle: number;
  showMessageBank: boolean;
  interestRate: number;
  resultCredit: number;
  showModalCredit: boolean;
  currentUser;
  constructor(
    private router: Router,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private simulateCreditService: SimulateCreditService,
    private userService: UserService
  ) {
    this.showModalCredit = false;
  }

  ngOnInit(): void {
    this.simulateForm = this.fb.group(
      {
        "credit-value": [
          "",
          [
            Validators.required,
            princeVehicleValidatorMax,
            princeVehicleValidatorMin
          ]
        ],
        "initial-quota": ["0", [Validators.required, initialFeeValidator]],
        "term-months": ["", Validators.required]
      },
      { validator: feeValidator }
    );

    this.contactUser = this.fb.group({
      "phone-user": [
        "",
        [Validators.required, Validators.minLength(7), Validators.maxLength(10)]
      ],
      "hour-contact": ["", Validators.required],
      "check-authorization": ["", [Validators.required, checkValidator]]
    });
    this.loadProduct();
    this.loadInterestRate();
    this.loadCurrentUser();
  }

  onSubmit() {
    if (!this.formIsInValid) {
      this.simulateCredit();
      this.showSimulator = !this.showSimulator;
    }
  }

  simulateCredit() {
    const priceVehicle = this.simulateForm.get("credit-value").value;
    const initialFee = this.simulateForm.get("initial-quota").value;
    const requestedAmount = priceVehicle - initialFee;
    const interestRate = this.interestRate / 100;
    const rangeTimeToPay = Number(this.rangeTimeToPay);
    const operation_one = (requestedAmount *  interestRate );
    const operation_two = (1 + interestRate);
    const operation_three = Math.pow(operation_two ,  -rangeTimeToPay);
    this.resultCredit = (operation_one / (1 - operation_three)) + ((requestedAmount / 1000000) * 1200);
  }

  creditRequest() {
    delete  this.contactUser.value['check-authorization'];
    const dataVehicle = {
        "id-product": this.idProduct,
        "value-quota": this.resultCredit,
        "type-vehicle": this.product['type-vehicle'],
        "model": this.product['model'],
        "vehicle":this.product['name'],
        "rate": 1
    };
    const params = Object.assign({}, dataVehicle, this.simulateForm.value, this.contactUser.value);
    const infoVehicle = {
      data: {
        type: "simulate_credits",
        attributes: params
      }
    };

    this.simulateCreditService.simulateCredit(infoVehicle).then(response => {
      this.showModalCredit = true;
    })
    .catch(httpErrorResponse => {});
  }

  closeModal() {
     this.showModalCredit = false;
  }

  get formIsInValid(): boolean {
    return this.simulateForm.invalid;
  }

  get formContactValid(): boolean {
    return this.contactUser.invalid;
  }


  isSpinnerShow() {
    return this.product;
  }

  populatePreciVehicle(product): void {
    this.simulateForm.patchValue({
      "credit-value": product.price
    });
  }

  async loadProduct() {
    try {
      this.product = await this.productsService.getProductsById(this.idProduct);
      this.populatePreciVehicle(this.product);
    } catch (error) {}
  }

  populatePhoneUser(phone): void {
    this.contactUser.patchValue({
      "phone-user": phone
    });
  }

  async loadCurrentUser() {
    try {
      this.currentUser = await this.userService.getInfoUser();
      this.populatePhoneUser(this.currentUser.cellphone);
    } catch (error) {}
  }

  loadInterestRate() {
    this.settingsService.getSettings().then(response => {
      const settingObject = response.find(function (setting) { return setting.name === 'tasa_interes_nominal'; });
      let interest = settingObject.value;
      interest = interest.replace(",", ".");
      this.interestRate = Number(interest);
    })
    .catch(httpErrorResponse => {});
  }
}
