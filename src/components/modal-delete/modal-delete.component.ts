import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss']
})
export class ModalDeleteComponent implements OnInit {
  private params;
  constructor(
    private productsService: ProductsService,
    private dialogRef: MatDialogRef<ModalDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.params = data;
   }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  deleteOrderProduct() {
    const params = {
      'idTienda':  this.params.idTienda,
      'idProducto':  this.params.idProducto
    };
    this.productsService.deleteOrderProducts(params).subscribe((response) => {
      this.dialogRef.close();
    }, (error) => {
      console.log(error);
    });
  }

}
