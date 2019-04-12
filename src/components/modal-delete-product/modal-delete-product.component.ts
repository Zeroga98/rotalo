import { Component, OnInit, Inject, Input, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'modal-delete-product',
  templateUrl: './modal-delete-product.component.html',
  styleUrls: ['./modal-delete-product.component.scss']
})
export class ModalDeleteProductComponent implements OnInit, AfterViewInit {
  @Input() id: string;

  private params;
  public deleteProductForm: FormGroup;
  public showSuccess = false;

  constructor(private dialogRef: MatDialogRef<ModalDeleteProductComponent>,
    @Inject(MAT_DIALOG_DATA) data, private fb: FormBuilder, private productsService: ProductsService) {
    this.params = data;
  }

  ngOnInit() {
    this.deleteProductForm = this.fb.group({
      option: ['vendido', [Validators.required]],
      comentario: ['']
    });
  }

  ngAfterViewInit() {
  }

  save() {
    this.showSuccess = false;
    if (!this.deleteProductForm.invalid) {
      let razon = 'Ya vendí mi producto';
      if (this.deleteProductForm.get('option').value == 'otro') {
        razon = 'Otro';
      }
      const params = {
        'productId': this.params.productId,
        'razon': razon,
        'comentario': this.deleteProductForm.get('comentario').value,
      };

      if (this.params.action == 'delete') {
        this.params = 'delete_done';
        this.productsService.deleteProduct(params).subscribe((response) => {
          this.showSuccess = true;
          this.gapush(
            'send',
            'event',
            'Productos',
            'ClicEliminarProducto',
            'EnvioExitoso'
          );
        },
          (error) => {
            console.log(error);
          });
      } else {
        let respuesta = {
          publishAt: '',
          publishUntil: '',
          action: 'update_done'
        }
        const params = {
          'estado': this.params.estado,
          'razon': razon,
          'comentario': this.deleteProductForm.get('comentario').value,
        };
        this.productsService
         .updateProductStatus(this.params.productId, params)
         .then(response => {
           if (response.status == '0') {
              this.params = 'update_done';
              respuesta = {
                  publishAt: response.body.producto['published-at'],
                  publishUntil:  response.body.producto['publish-until'],
                  action: 'update_done'
              }
              this.params = respuesta;
              this.showSuccess = true;
              this.gapush(
                'send',
                'event',
                'Productos',
                'ClicInactivarProducto',
                'EnvioExitoso'
              );
           }
         },
         (error) => {
           console.log(error);
         });
      }
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
    this.dialogRef.close(this.params);
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
