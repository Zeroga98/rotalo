import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-conversation',
  templateUrl: './delete-conversation.component.html',
  styleUrls: ['./delete-conversation.component.scss']
})
export class DeleteConversationComponent implements OnInit , AfterViewInit {
  private params;

  constructor(private dialogRef: MatDialogRef<DeleteConversationComponent>,
  @Inject(MAT_DIALOG_DATA) data) {
    this.params = data;
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  save() {
    this.dialogRef.close(this.params);
  }

  close() {
    this.dialogRef.close();
  }

}
