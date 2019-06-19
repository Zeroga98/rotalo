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
import { Subject, Observable } from 'rxjs';

interface AfterViewInit {
  ngAfterViewInit(): void;
}

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
export class SimulateCreditPage implements OnInit, AfterViewInit {
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
  public infoAccept = [
    {
      answer: `<p>DECLARACIÓN Y AUTORIZACIÓN PARA CONSULTAR, REPORTAR Y COMPARTIR INFORMACIÓN. Autorizo a BANCOLOMBIA S.A. y a las entidades que pertenezcan a su Grupo Empresarial, para que conserven la información aquí suministrada, la compartan entre ellas, me contacten con el fin de ofrecerme sus productos y servicios; y para que, con el fin de evaluar la posibilidad de otorgarme los mismos, consulten y procesen mi información ante las entidades de consulta de bases de datos u Operadores de Información y Riesgo. El resultado del análisis para acceder al producto, le será informado a través de alguno de los medios de contacto que nos ha suministrado.</p>`,
      id: 1,
      question: 'Declaración y autorización para consultar, reportar y compartir información.',
      sequence: 1
    },
    {
      answer: `<p>Esta información es suministrada en atención a la solicitud que has efectuado a Bancolombia S.A., la misma se entrega sólo para fines informativos y no comporta oferta, opción o promesa de contratar a cargo de Bancolombia S.A. Los términos de esta simulación son suministrados con base en las condiciones comerciales y de mercado que han sido establecidas para la fecha en que se realiza. La cuota indicada está compuesta por seguro de vida, intereses y capital. La cuota es fija, la tasa es variable y por lo tanto el plazo estimado. La cuota no incluye seguro del vehículo. <br> Recuerda que para esta simulación se utilizó una tasa representativa del 1.05 % nominal mes vencido, equivalente a 13.35% efectivo anual. <br>Si el plazo que quieres es de 84 meses, ten presente que debes ser empleado o pensionado, o si vas a financiar un usado, puedes ser también independiente, trasportador, profesional independiente o rentista de capital. El carro usado debe tener menos de 5 años de antigüedad. Lo que vas a prestar debe ser menor o igual al 80% del valor comercial del carro. No aplica para marcas chinas o indias.</p>`,
      id: 2,
      question: 'Asegúrate de leer esto ¡Es importante!',
      sequence: 2
    }
  ];
  public infoAcceptMobile = [
    {
      answer: `<p>DECLARACIÓN Y AUTORIZACIÓN PARA CONSULTAR, REPORTAR Y COMPARTIR INFORMACIÓN. Autorizo a BANCOLOMBIA S.A. y a las entidades que pertenezcan a su Grupo Empresarial, para que conserven la información aquí suministrada, la compartan entre ellas, me contacten con el fin de ofrecerme sus productos y servicios; y para que, con el fin de evaluar la posibilidad de otorgarme los mismos, consulten y procesen mi información ante las entidades de consulta de bases de datos u Operadores de Información y Riesgo. El resultado del análisis para acceder al producto, le será informado a través de alguno de los medios de contacto que nos ha suministrado.</p>`,
      id: 3,
      question: 'Declaración y autorización.',
      sequence: 3
    },
    {
      answer: `<p>Esta información es suministrada en atención a la solicitud que has efectuado a Bancolombia S.A., la misma se entrega sólo para fines informativos y no comporta oferta, opción o promesa de contratar a cargo de Bancolombia S.A. Los términos de esta simulación son suministrados con base en las condiciones comerciales y de mercado que han sido establecidas para la fecha en que se realiza. La cuota indicada está compuesta por seguro de vida, intereses y capital. La cuota es fija, la tasa es variable y por lo tanto el plazo estimado. La cuota no incluye seguro del vehículo. <br> Recuerda que para esta simulación se utilizó una tasa representativa del 1.05 % nominal mes vencido, equivalente a 13.35% efectivo anual. <br>Si el plazo que quieres es de 84 meses, ten presente que debes ser empleado o pensionado, o si vas a financiar un usado, puedes ser también independiente, trasportador, profesional independiente o rentista de capital. El carro usado debe tener menos de 5 años de antigüedad. Lo que vas a prestar debe ser menor o igual al 80% del valor comercial del carro. No aplica para marcas chinas o indias.</p>`,
      id: 4,
      question: 'Asegúrate de leer esto ¡Es importante!',
      sequence: 4
    }
  ];

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
        'initial-quota': [this.simulateCreditService.initialQuota != null ? this.simulateCreditService.initialQuota : '0', [Validators.required, initialFeeValidator]],
        'term-months': [this.simulateCreditService.months != null ? Number(this.simulateCreditService.months) : 12, Validators.required]
      },
      { validator: feeValidator }
    );

    this.contactUser = this.fb.group({
      'phone-user': ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]
      ],
      'salary': [0, Validators.required],
      'hour-contact': ['Mañana', Validators.required],
      'check-authorization': ['', [Validators.required, checkValidator]]
    });
    this.loadProduct();
    // this.loadInterestRate();
    this.loadCurrentUser();
    this.sufiRegister();
  }

  ngAfterViewInit() {

    setTimeout(() => {
      if (!this.formIsInValid) {
        this.simulateCredit();
      } else {
        console.log(this.simulateForm);
        this.validateAllFormFields(this.simulateForm);
      }
    }, 300);

  }

  onSubmit() {
    if (!this.formIsInValid) {
      this.simulateCredit();
    } else {
      console.log(this.simulateForm);
      this.validateAllFormFields(this.simulateForm);
    }
  }

  sufiRegister() {
    const params = {
      'idProducto': this.idProduct,
      'fuente': 'sufi'
    };
    this.productsService.sufiRegistro(params).subscribe((response) => {
    },
      (error) => {
        console.log(error);
      });
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
      this.simulatePlan = response.body;
      if (this.simulateForm.get('term-months').value !== 12) {
        this.showThirdPlan = true;
      } else {
        this.showThirdPlan = false;
      }
      this.showSimulator = true;
      this.scrollIntoTable();
      this.changeDetectorRef.markForCheck();
    })
      .catch(httpErrorResponse => { });
  }

  scrollIntoTable() {
    setTimeout(function () {
      const elmnt = document.getElementById('table-simulator');
      elmnt.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 200);
  }

  creditRequest() {
    if (this.contactUser.valid) {
      const priceVehicle = this.simulateForm.get('credit-value').value;
      const initialFee = this.simulateForm.get('initial-quota').value;
      let termMonths = this.simulateForm.get('term-months').value;
      termMonths = Number(termMonths);
      const phone = this.contactUser.get('phone-user').value;
      const salary = this.contactUser.get('salary').value;
      const hourContact = this.contactUser.get('hour-contact').value;

      let infoVehicle = {
        'productId': this.idProduct,
        'valorAFinanciar': priceVehicle,
        'cuotaInicial': initialFee,
        'plazo': termMonths,
        'telefono': phone,
        'horarioDeContacto': hourContact,
        'ingresos': salary
      };
      infoVehicle = Object.assign(infoVehicle, this.simulatePlan);
      this.simulateCreditService.sendSimulateCredit(infoVehicle).then(response => {
        this.showModalCredit = true;
        this.changeDetectorRef.markForCheck();
      })
        .catch(httpErrorResponse => { });
    } else {
      this.validateAllFormFields(this.contactUser);
    }
  }

  closeModal() {
    this.showModalCredit = false;
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

  get formIsInValid(): boolean {
    return this.simulateForm.invalid;
  }

  get formContactValid(): boolean {
    return this.contactUser.invalid;
  }

  get formUntouchedValid(): boolean {
    return this.simulateForm.untouched;
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
    if (this.idProduct) {
      this.productsService.getProductsByIdDetail(this.idProduct).subscribe((reponse) => {
        if (reponse.body) {
          this.product = reponse.body.productos[0];
          this.showPage = true;
          this.populatePreciVehicle(this.product);
          this.validateMonths();
          this.changeDetectorRef.markForCheck();
        }
      },
        (error) => {
          console.log(error);
        });
    }
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
    } catch (error) { }
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

  /*loadInterestRate() {
    this.settingsService.getSettings().then(response => {
      const settingObject = response.find(function (setting) { return setting.name === 'tasa_interes_nominal'; });
      let interest = settingObject.value;
      interest = interest.replace(',', '.');
      this.interestRate = Number(interest);
    })
    .catch(httpErrorResponse => {});
  }*/


}
