import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';

@Component({
  selector: "edit-profile",
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss']
})
export class EditProfilePage implements OnInit {
  public editProfileForm: FormGroup;
  public selectIsCompleted = false;
  public location: Object = {};
  public country: Object = {};
  public state: Object = {};
  constructor() {}

  ngOnInit(): void {
    this.editProfileForm =  new FormGroup({
      name: new FormControl('', [Validators.required]),
      idNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [ Validators.required, Validators.email]),
      cellphone: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.editProfileForm);
  }

}
