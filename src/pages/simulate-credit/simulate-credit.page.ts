import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';

import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductInterface } from '../../commons/interfaces/product.interface';
import { ProductsService } from '../../services/products.service';
import { SettingsService } from '../../services/settings.service';
import { SimulateCreditService } from '../../services/simulate-credit.service';
import { ROUTES } from '../../router/routes';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../commons/interfaces/user.interface';

/**Validator**/
function priceVehicleValidatorMax(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const priceValue = c.value;
  if (priceValue > 5000000000) {
    return { priceValueMax: true };
  }
  return null;
}

function priceVehicleValidatorMin(
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
  const initialFee: number = formValues.value['initial-quota'];
  const priceVehicle: number = formValues.value['credit-value'];
  if (Number(initialFee) > Number(priceVehicle)) {
    return { initialFeeValidation: true };
  }
  return null;
}

function checkValidator(c: AbstractControl): { [key: string]: boolean } | null {
  const checkValues = c;
  if (checkValues.value === '' || checkValues.value === false) {
    return { checkBank: true };
  }
  return null;
}

@Component({
  selector: 'simulate-credit',
  templateUrl: './simulate-credit.page.html',
  styleUrls: ['./simulate-credit.page.scss']
})
export class SimulateCreditPage implements OnInit {
  [x: string]: any;
  public rangeTimeToPay = '1';
  public simulateForm: FormGroup;
  public contactUser: FormGroup;
  public product: ProductInterface;
  public idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));
  public showSimulator = false;
  public priceVehicle: number;
  public showMessageBank: boolean;
  public interestRate: number;
  public resultCredit: number;
  public showModalCredit: boolean;
  public currentUser;
  public showPage: boolean;
  public rangeTimetoPayArray: Array<number> = [12, 24, 36, 48, 60, 72, 84];
  public nameUser;
  public typeDocument;
  public documentNumber;
  public userId;
  public email;
  public cellphone;
  public stateName;
  public cityName;
  public simulatePlan;
  public showThirdPlan = false;

  @HostListener('document:click', ['$event']) clickout(event) {
    if (event.target && event.target.className) {
      if (event.target.className == 'opacity') {
        this.closeModal();
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private simulateCreditService: SimulateCreditService,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.showModalCredit = false;
  }

  ngOnInit(): void {
    this.simulateForm = this.fb.group(
      {
        'credit-value': [
          '',
          [
            Validators.required,
            priceVehicleValidatorMax,
            priceVehicleValidatorMin
          ]
        ],
        'initial-quota': ['0', [Validators.required, initialFeeValidator]],
        'term-months': [12, Validators.required]
      },
      { validator: feeValidator }
    );

    this.contactUser = this.fb.group({
      'phone-user': ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]
      ],
      'salary': ['', Validators.required],
      'hour-contact': ['Mañana', Validators.required],
      'check-authorization': ['', [Validators.required, checkValidator]]
    });
    this.loadProduct();
    this.loadInterestRate();
    this.loadCurrentUser();
  }

  onSubmit() {
    if (!this.formIsInValid) {
      this.simulateCredit();
    } else {
      this.validateAllFormFields(this.simulateForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  simulateCredit() {
    const priceVehicle = this.simulateForm.get('credit-value').value;
    const initialFee = this.simulateForm.get('initial-quota').value;
    let termMonths = this.simulateForm.get('term-months').value;
    termMonths = Number(termMonths);
    const infoVehicle = {
      'productId': this.idProduct,
      'valorAFinanciar': priceVehicle,
      'cuotaInicial': initialFee,
      'plazo': termMonths
    };
    this.simulateCreditService.simulateCredit(infoVehicle).then(response => {
      this.showSimulator = true;
      if (this.simulateForm.get('term-months').value != 12) {
        this.showThirdPlan = true;
      }
      this.simulatePlan = response.body;
      this.changeDetectorRef.markForCheck();
    })
    .catch(httpErrorResponse => {});
  }

  creditRequest() {
  }

  closeModal() {
     this.router.navigate([`/${ROUTES.PRODUCTS.LINK}/${ROUTES.PRODUCTS.FEED}`]);
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
      'credit-value': product.price
    });
  }

  loadProduct() {
    this.productsService.getProductsByIdDetail(this.idProduct).subscribe((reponse) => {
      if (reponse.body) {
        this.product = reponse.body.productos[0];
        this.showPage = true;
        this.populatePreciVehicle(this.product);
        this.validateMonths();
        this.changeDetectorRef.markForCheck();
      }
    } ,
    (error) => {
      console.log(error);
    });
  }

  validateMonths() {
    if (this.product) {
      const currentYear = new Date().getFullYear();
      const modelo = this.product['model'];
      const differenceYear = currentYear - modelo;
      let nameBrandMoto;
      if (this.product['vehicle'] && this.product['vehicle'].line.brand) {
        nameBrandMoto = this.product['vehicle'].line.brand.name;
      }

      if (differenceYear >= 5 && differenceYear <= 10 || nameBrandMoto == 'BMW') {
        this.rangeTimetoPayArray = [12, 24, 36, 48, 60];
      }
    }
  }

  populatePhoneUser(phone): void {
    this.contactUser.patchValue({
      'phone-user': phone
    });
  }

  async loadCurrentUser() {
    try {
      this.currentUser = await this.userService.getInfoUser();
      this.nameUser = this.currentUser.name;
      this.typeDocument = this.getDocument(this.currentUser['type-document-id']);
      this.documentNumber = this.currentUser['id-number'];
      this.userId = this.currentUser.id;
      this.email = this.currentUser.email;
      if (this.currentUser.city) {
        this.stateName = this.currentUser.city.state.name;
        this.cityName = this.currentUser.city.name;
      }
      this.populatePhoneUser(this.currentUser.cellphone);
    } catch (error) {}
  }

  getDocument(id) {
    switch (id) {
      case 1: {
        this.typeDocument = 'CC';
        break;
      }
      case 4: {
        this.typeDocument = 'CE';
        break;
      }
      case 5: {
        this.typeDocument = 'PA';
        break;
      }
      case 6: {
        this.typeDocument = 'CIP';
        break;
      }
      case 7: {
        this.typeDocument = 'DPI';
        break;
      }
      default:
        break;
    }

    return this.typeDocument;
  }

  loadInterestRate() {
    this.settingsService.getSettings().then(response => {
      const settingObject = response.find(function (setting) { return setting.name === 'tasa_interes_nominal'; });
      let interest = settingObject.value;
      interest = interest.replace(',', '.');
      this.interestRate = Number(interest);
    })
    .catch(httpErrorResponse => {});
  }
}
