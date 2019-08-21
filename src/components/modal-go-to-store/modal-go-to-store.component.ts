import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ROUTES } from '../../router/routes';

@Component({
  selector: 'modal-go-to-store',
  templateUrl: './modal-go-to-store.component.html',
  styleUrls: ['./modal-go-to-store.component.scss']
})
export class ModalGoToStoreComponent implements OnInit {

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ModalGoToStoreComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  goToShop() {
    this.router.navigate([
      `${ROUTES.SHOPSPRIVATE.LINK}/${ROUTES.SHOPSPRIVATE.FEED}`
    ]);
    this.dialogRef.close();
  }

}
