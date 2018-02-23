import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-hobbies',
  templateUrl: 'hobbies.page.html',
  styleUrls: ['hobbies.page.scss']
})
export class HobbiesPage implements OnInit {
  public hobbiesForm: FormGroup;
  public errorChange: String;
  public messageChange: String;
  public userHobbie: any;
  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.hobbiesForm = this.fb.group({
      hobbies: ''
    });
    this.getHobbie();
  }

  async getHobbie() {
    this.userHobbie = await this.userService.getInfoUser();
    this.onHobbieRetrieved(this.userHobbie);
  }

  onHobbieRetrieved(user): void {
    if (this.hobbiesForm) {
       this.hobbiesForm.reset();
    }
    this.hobbiesForm.patchValue({
      hobbies: user.hobbies
    });
  }

  saveHobbie(): void {
    console.log(this.userHobbie);
    let infoUser = Object.assign({}, this.hobbiesForm.value);
    const currentUser = {
      'data': {
        'id': this.userHobbie.id,
        'type': 'users',
        'attributes': infoUser
      }
    };
    console.log(currentUser);
    this.userService.updateUser(currentUser).then(response => {
      this.messageChange = 'Su cuenta se ha actualizado..';
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
    this.saveHobbie();
  }
}
