import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-conversation',
  templateUrl: './delete-conversation.component.html',
  styleUrls: ['./delete-conversation.component.scss']
})
export class DeleteConversationComponent implements OnInit , AfterViewInit {
  private params;
  @ViewChild('primary', { read: ElementRef }) primaryButton:ElementRef;

  constructor(private dialogRef: MatDialogRef<DeleteConversationComponent>,
  @Inject(MAT_DIALOG_DATA) data) {
    this.params = data;
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.primaryButton.nativeElement.classList.remove('cdk-focused');
    this.primaryButton.nativeElement.classList.remove('cdk-mouse-focused');
  }

  save() {
    this.dialogRef.close(this.params);
  }

  close() {
    this.dialogRef.close();
  }

}
