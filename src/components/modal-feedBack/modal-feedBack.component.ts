import { Component, ElementRef, OnInit, OnDestroy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ModalFeedBackService } from './modal-feedBack.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { CurrentSessionService } from '../../services/current-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'modal-feedBack',
  templateUrl: './modal-feedBack.component.html',
  styleUrls: ['./modal-feedBack.component.scss']
})
export class ModalFeedBackComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() currentUrl: string;
  @Output() success: EventEmitter<any>  = new EventEmitter();
  private element: any;
  public feedBackForm: FormGroup;
  public messageSuccess: boolean;

  constructor(private modalService: ModalFeedBackService,
    private changeDetectorRef: ChangeDetectorRef,
    private currentSessionService: CurrentSessionService,
    private router: Router,
    private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;

    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    if (!this.checkSession()) {
      document.body.appendChild(this.element);
    }

    this.modalService.add(this);
    this.feedBackForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      comment: new FormControl('', [Validators.required])
    });

  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element = undefined;
  }

  onSubmit() {
    this.success.emit(false);
    let countryId = '1';
    const currentUrl = window.location.href;
    if (currentUrl.includes('gt')) {
      countryId = '9';
    } else {
      countryId = '1';
    }

    if (this.checkSession()) {
      this.feedBackForm.patchValue({ email: this.currentSessionService.currentUser().email });
    }

    if (this.feedBackForm.valid) {
      const email = this.feedBackForm.get('email').value;
      const comment = this.feedBackForm.get('comment').value;
      let idTienda = 0;

      if (this.currentUrl && this.currentUrl.includes('microsite')) {
        idTienda = 1;
      } else if (this.currentUrl && this.currentUrl.includes('tiendainmueble')) {
        idTienda = 34;
      }

      const params = {
        'correo': email,
        'mensaje': comment,
        'idPais': parseInt(countryId),
        'destino': this.currentUrl && this.currentUrl.includes('microsite') || this.currentUrl && this.currentUrl.includes('tiendainmueble')
        ? 'tienda' : 'admin',
        'idTienda': idTienda
      };
      this.modalService.sendEmail(params) .subscribe(
        state => {
          this.messageSuccess = true;
          this.success.emit(true);
          this.feedBackForm.reset();
          this.changeDetectorRef.markForCheck();
        },
        error => console.log(error)
      );
    } else {
      this.messageSuccess = false;
      this.success.emit(false);
      this.validateAllFormFields(this.feedBackForm);
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

  open(): void {
   // this.element.style.display = 'block';
   this.messageSuccess = false;
   this.success.emit(false);
   this.feedBackForm.reset();
    this.element.classList.add('md-show');
   // document.body.classList.add('modal-open');
  }

  close(): void {
   // this.element.style.display = 'none';
   this.success.emit(false);
    this.feedBackForm.reset();
    this.element.classList.remove('md-show');
    // document.body.classList.remove('modal-open');
  }

  public checkSession() {
    return this.currentSessionService.currentUser();
  }

}
