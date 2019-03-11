import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'report-publication',
  templateUrl: './report-publication.component.html',
  styleUrls: ['./report-publication.component.scss']
})
export class ReportPublicationComponent implements OnInit , AfterViewInit {
  private params;
  public reportForm: FormGroup;
  public showSuccess = false;

  constructor(private dialogRef: MatDialogRef<ReportPublicationComponent>,
  @Inject(MAT_DIALOG_DATA) data,   private fb: FormBuilder, private productsService: ProductsService) {
    this.params = data;
   }

  ngOnInit() {
    this.reportForm = this.fb.group({
      option: [false, [Validators.required]],
      comentario: ['']
    });
  }

  ngAfterViewInit() {
  }

  save() {
    this.showSuccess = false;
    if (!this.reportForm.invalid) {
      let razon = 'Esta persona ya no trabaja en la empresa';
      if (this.reportForm.get('option').value) {
        razon = 'El contenido es inapropiado';
      }
      const params = {
        'idProducto': this.params.toString(),
        'razon': razon,
        'comentario': this.reportForm.get('comentario').value,
    };

     this.productsService.reportProduct(params).subscribe((response) => {
        this.showSuccess = true;
        this.gapush(
          'send',
          'event',
          'Productos',
          'ClicReportaAqui',
          'EnvioExitoso'
        );
      },
      (error) => {
        console.log(error);
      });
    } else {
      this.validateAllFormFields(this.reportForm);
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

  gapush(method, type, category, action, label) {
    const paramsGa = {
      event: 'pushEventGA',
      method: method,
      type: type,
      categoria: category,
      accion: action,
      etiqueta: label
    };
    window['dataLayer'].push(paramsGa);
  }

  close() {
    this.dialogRef.close();
  }

  changeRadioButton() {
    const comment = this.reportForm.get('comentario');
    comment.reset();
    comment.clearValidators();
    comment.updateValueAndValidity();
    if (this.reportForm.get('option').value) {
      comment.setValidators([Validators.required]);
    }
  }


}
