import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup,  Validators } from '@angular/forms';
@Component({
  selector: 'simulate-credit',
  templateUrl: './simulate-credit.page.html',
  styleUrls: ['./simulate-credit.page.scss']
})
export class SimulateCreditPage implements OnInit {
  rangeTimeToPay = "36";

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.simulateForm = this.fb.group({
      idNumber: [{ value: "", disabled: true }, Validators.required],
      email: ["", [Validators.required, Validators.email]],
      cellphone: ["", [Validators.required]]
    });
  }

}
