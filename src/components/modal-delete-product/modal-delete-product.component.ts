import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'modal-delete-product',
  templateUrl: './modal-delete-product.component.html',
  styleUrls: ['./modal-delete-product.component.scss']
})
export class ModalDeleteProductComponent implements OnInit , AfterViewInit {
  private params;
  public deleteProductForm: FormGroup;
  public showSuccess = false;

  constructor(private dialogRef: MatDialogRef<ModalDeleteProductComponent>,
  @Inject(MAT_DIALOG_DATA) data,   private fb: FormBuilder, private productsService: ProductsService) {
    this.params = data;
   }

  ngOnInit() {
    this.deleteProductForm = this.fb.group({
      option: [false, [Validators.required]],
      comentario: ['']
    });
  }

  ngAfterViewInit() {
  }

  save() {
    this.showSuccess = false;
    if (!this.deleteProductForm.invalid) {
      let razon = 'Ya vendí mi producto';
      if (this.deleteProductForm.get('option').value == 'proceso') {
        razon = 'Hay alguien en proceso de compra';
      }
      if (this.deleteProductForm.get('option').value == 'otro') {
        razon = 'Otro';
      }
      const params = {
        'idProducto': this.params.toString(),
        'razon': razon,
        'comentario': this.deleteProductForm.get('comentario').value,
    };

     /*this.productsService.reportProduct(params).subscribe((response) => {
        this.showSuccess = true;
        this.gapush(
          'send',
          'event',
          'Productos',
          'ClicEliminaInactiva',
          'EnvioExitoso'
        );
      },
      (error) => {
        console.log(error);
      });*/
    } else {
      this.validateAllFormFields(this.deleteProductForm);
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
    const comment = this.deleteProductForm.get('comentario');
    comment.reset();
    comment.clearValidators();
    comment.updateValueAndValidity();
    if (this.deleteProductForm.get('option').value == 'otro') {
      comment.setValidators([Validators.required]);
    }
  }
}
