import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TypeDocumentsService } from '../../../services/type-documents.service';



function validateNameUser(
  name: AbstractControl
): { [key: string]: boolean } | null {
  const nameValue = name.value;
  const arrayName = nameValue.split(' ').filter(function (v) { return v !== ''; });
  if (arrayName.length == 1) {
    return { nameError: true };
  }
  return null;
}


@Component({
  selector: 'modal-form-register',
  templateUrl: './modal-form-register.component.html',
  styleUrls: ['./modal-form-register.component.scss']
})
export class ModalFormRegisterComponent implements OnInit {
public typeDocumentsFilter ;
public registerForm: FormGroup;
private currentUrl;
public idCountry;
public country = 'Colombia';
public errorMessage = '';
public errorMessageId;
public errorMessageDoc;
public errorTypeDocument = false;
public documentId;

  constructor(
    private fb: FormBuilder,
    private typeDocumentsService: TypeDocumentsService,
    private dialogRef: MatDialogRef<ModalFormRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    }

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombres: ['', [Validators.required, validateNameUser]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      tipoDocumento: ['', Validators.required],
      nroDocumento: ['', [
        Validators.required
      ]],
      celular: ['', [Validators.required]]
    });

    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('gt')) {
      this.loadTypeDocument(9);
      this.country = 'Guatemala';
    } else {
      this.loadTypeDocument(1);
      this.country = 'Colombia';
    }
  }

  loadTypeDocument(idCountry) {
    const countryDocument = {
      'pais': idCountry
    };
    this.typeDocumentsService.getTypeDocument(countryDocument).subscribe((response) => {
      if (response.status == 0) {
        this.typeDocumentsFilter = response.body.documentType;
      }
    }, (error) => {
      console.log(error);
    });
  }

  setValidationPhone(country): void {
    if (country) {
      const idCountry = country;
      const phoneNumberControl = this.registerForm.get('cellphone');
      switch (idCountry) {
        case 'Colombia': {
          phoneNumberControl.setValidators([Validators.required]);
          this.registerForm.get('cellphone').setValidators([Validators.required]);
          phoneNumberControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{10}$/)
          ]);
          break;
        }
        case 'Guatemala': {
          phoneNumberControl.setValidators([
            Validators.required,
            Validators.pattern(/^\d{8}$/)
          ]);
          this.errorMessageId = 'El campo no cumple el formato.';
          break;
        }
        default: {
          phoneNumberControl.setValidators([Validators.required]);
          break;
        }
      }
      phoneNumberControl.updateValueAndValidity();
    }
  }

  validateTypeDocument() {
    if (this.registerForm.get('tipoDocumento').value) {
      this.errorTypeDocument = false;
    }
  }

  findNameDocumentType() {
    let data;
    if (this.typeDocumentsFilter) {
      data = this.typeDocumentsFilter.find(resource => {
        return resource.id == this.documentId;
      });
    }
    return data;
  }

  setValidationId(): void {
    if (this.country) {
      const idDocumentControl = this.registerForm.get('id-number');
      const documentObject = this.findNameDocumentType();
      let documentName;
      if (documentObject) {
        documentName = documentObject['abrev'];
        idDocumentControl.clearValidators();
      }
      switch (this.country) {
        case 'Colombia': {
          if (documentName == 'CC') {
            idDocumentControl.setValidators([
              // Validators.pattern('^((\\d{6})|(\\d{8})|(\\d{10})|(\\d{12}))?$'),
              Validators.maxLength(10),
              Validators.pattern('^[0-9]+$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName == 'CE') {
            idDocumentControl.setValidators([
              Validators.minLength(3),
              Validators.maxLength(15),
              Validators.pattern('^[0-9]+$'),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de cédula.';
          } else if (documentName == 'PA') {
            idDocumentControl.setValidators([
              Validators.minLength(5),
              Validators.maxLength(36),
              Validators.required
            ]);
            this.errorMessageId =
              'El campo no cumple con el formato de Pasaporte.';
          }
          break;
        }
        case 'Guatemala': {
          idDocumentControl.setValidators([
            // Validators.pattern('^[0-9]{4}\\s?[0-9]{5}\\s?[0-9]{4}$'),
            Validators.pattern('^[0-9]{13}$'),
            Validators.required
          ]);
          this.errorMessageId = 'El campo no cumple el formato.';
          break;
        }
        default: {
          idDocumentControl.setValidators([Validators.required]);
          break;
        }
      }
      idDocumentControl.updateValueAndValidity();
    }
  }

  close() {
    this.dialogRef.close();
  }

  get formIsInValid() {
    return this.registerForm.invalid;
  }

  removeError() {
    this.errorMessage = '';
    this.errorMessageDoc = '';
  }

}
