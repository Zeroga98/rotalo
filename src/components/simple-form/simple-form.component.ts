import { ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EventEmitter, Output, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleFormComponent implements OnInit {
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Input() title:string = '';
  @Input() firstRow:string = '';
  @Input() secondRow:string = '';
  @Input() actionText: string = 'Continuar';
  @Input() textArea: boolean = false;
  @Input() placeholder:string = '';
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      field: new FormControl('', [Validators.required])
    });
  }

  continue() {
    this.next.emit(this.form);
  }

  get formIsInValid(): boolean{
    return this.form.invalid;
  }

}
