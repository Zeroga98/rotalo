import { Component, OnInit} from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-hobbies',
  templateUrl: 'hobbies.page.html',
  styleUrls: ['hobbies.page.scss']
})
export class HobbiesPage implements OnInit {

  public errorChange: String;
  public messageChange: String;
  public userHobbie: any;
  public hobbies: Array<any> = [
    {name: 'Bebés', id: 1, checked: true},
    {name: 'Camping y actividades al aire libre', id: 2, checked: false},
    {name: 'Carpinteria y manualidades', id: 3, checked: true},
    {name: 'Carros', id: 4, checked: false},
    {name: 'Cine', id: 5, checked: false},
    {name: 'Cocina', id: 6, checked: false},
    {name: 'Coleccionar', id: 7, checked: false},
    {name: 'Deporte', id: 8, checked: false},
    {name: 'Eventos y espectáculos', id: 9, checked: false},
    {name: 'Hogar', id: 11, checked: false},
    {name: 'Jardineria', id: 12, checked: false},
  ];
  readonly maxHobbies: number = 3;
  constructor(private userService: UserService) {}

  ngOnInit() {
  }

  fieldsChange(values: any) {
    console.log(values.currentTarget.checked);
  }

  checkMaxNumberHobbies(): boolean {
    let numberHobbies = 0;
    for (const hobby of this.hobbies){
      if (hobby.checked) {
        numberHobbies++;
      }
    }
    if (numberHobbies < this.maxHobbies) {
      return false;
    }
    return true;
  }

  saveHobbies(): void {
  console.log(this.hobbies);
  /*  const infoUser = Object.assign({}, this.hobbiesForm.value);
    const currentUser = {
      'data': {
        'id': this.userHobbie.id,
        'type': 'users',
        'attributes': infoUser
      }
    };

    this.userService.updateUser(currentUser).then(response => {
      this.messageChange = 'Su cuenta se ha actualizado.';
      this.errorChange = '';
      this.userService.updateInfoUser();
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
      });*/
  }

}
