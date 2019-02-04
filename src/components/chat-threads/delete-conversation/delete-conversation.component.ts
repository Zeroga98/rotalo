import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-conversation',
  templateUrl: './delete-conversation.component.html',
  styleUrls: ['./delete-conversation.component.scss']
})
export class DeleteConversationComponent implements OnInit {
  private params;
  constructor(private dialogRef: MatDialogRef<DeleteConversationComponent>,
  @Inject(MAT_DIALOG_DATA) data) {
    this.params = data;
   }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.params);
  }

  close() {
    this.dialogRef.close();
  }

}
