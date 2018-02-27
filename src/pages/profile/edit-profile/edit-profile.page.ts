import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: "edit-profile",
  templateUrl: "edit-profile.page.html",
  styleUrls: ["edit-profile.page.scss"]
})
export class EditProfilePage implements OnInit {
  public editProfileForm: FormGroup;
  public selectIsCompleted = false;
  public location: Object = {};
  public country: Object = {};
  public state: Object = {};
  public city: Object = {};
  public userEdit: any;
  public countryValue: String;
  public stateValue: String;
  public cityValue: String;
  public errorChange: String;
  public messageChange: String;
  public isLoadingInfo: boolean;
  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.isLoadingInfo = true;
    this.editProfileForm = this.fb.group({
      name: ['', [ Validators.required, Validators.maxLength(50)]],
      idNumber: [{value: '', disabled: true}, Validators.required],
      email: ['', [ Validators.required, Validators.email]],
      cellphone: ['', [Validators.required]]
    });
    this.getInfoUser();
  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    this.onInfoRetrieved(this.userEdit);
  }

  onInfoRetrieved(user): void {
    if (this.editProfileForm) {
       this.editProfileForm.reset();
    }
    this.editProfileForm.patchValue({
      name: user.name,
      idNumber: user['id-number'],
      email: user.email,
      cellphone: user.cellphone
    });
    this.countryValue = user.city.state.country;
    this.stateValue = user.city.state;
    this.cityValue = user.city;
    this.isLoadingInfo = false;
  }

  editUser(): void {
    const infoUser = Object.assign({}, this.editProfileForm.value);
    const currentUser = {
      'data': {
        'id': this.userEdit.id,
        'type': 'users',
        'attributes': infoUser
      }
    };
    this.userService.updateUser(currentUser).then(response => {
      this.messageChange = 'Su cuenta se ha actualizado.';
      this.errorChange = '';
      })
      .catch(httpErrorResponse => {
        this.messageChange = '';
        if (httpErrorResponse.status === 403) {
        }
        if (httpErrorResponse.status === 422) {
          this.errorChange = httpErrorResponse.error.errors[0].title;
        }
        if (httpErrorResponse.status === 0) {
          this.errorChange = '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
        }
      });
  }

  onSubmit() {
    this.editUser();
  }
}
