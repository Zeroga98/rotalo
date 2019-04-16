import { ROUTES } from './../../router/routes';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CurrentSessionService } from '../../services/current-session.service';
import { HobbiesService } from '../../services/hobbies.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'success-activation',
  templateUrl: './success-activation.page.html',
  styleUrls: ['./success-activation.page.scss']
})
export class SuccessActivationPage implements OnInit {
  errorLogin: String;
  userId: String;
  public messageChange: String;
  public errorChange: String;
  public hobbies: Array<any> = [];
  private numberHobbies = 0;
  public maxHobbies: number = 5;
  public minHobbies: number = 1;
  constructor(
    private userService: UserService,
    private currentSessionService: CurrentSessionService,
    private router: Router,
    private hobbiesService: HobbiesService,
    private settingsService: SettingsService
  ) {
    //this.loadMaxMinNumHobbies();
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.loadIdUser();
    this.loadHobbies();
  }

  /*loadMaxMinNumHobbies() {
    this.settingsService
      .getSettings()
      .then(response => {
        const minObj = response.find(function(setting) {
          return setting.name === 'min_interests_to_add';
        });
        const maxObJ = response.find(function(setting) {
          return setting.name === 'max_interests_to_add';
        });
        this.maxHobbies = Number(maxObJ.value);
        this.minHobbies = Number(minObj.value);
      })
      .catch(httpErrorResponse => {});
  }*/

  loadIdUser() {
    this.userId = this.currentSessionService.getIdUser();
  }

  loadHobbies() {
    this.hobbiesService.getHobbies(this.userId).subscribe(
      state => {
        this.hobbies = state.body.intereses;
        this.countHobbies();
      },
      error => console.log(error)
    );
  }

  countCheck(event) {
    if (event.target.checked) {
      this.numberHobbies++;
    } else {
      this.numberHobbies--;
    }
  }

  countHobbies() {
    let numberHobbies = 0;
    for (const hobby of this.hobbies) {
      if (hobby.seleccionado) {
        numberHobbies++;
      }
    }
    this.numberHobbies = numberHobbies;
  }

  checkMaxNumberHobbies(): boolean {
    if (this.numberHobbies < this.maxHobbies) {
      return false;
    }
    return true;
  }

  isValidateNumberHobbies(): boolean {
    if (
      this.numberHobbies <= this.maxHobbies &&
      this.numberHobbies >= this.minHobbies
    ) {
      return true;
    }
    return false;
  }

  saveHobbies(): void {
    if (this.isValidateNumberHobbies()) {
      let arrayHobbies = [];
      for (const hobby of this.hobbies) {
        if (hobby.seleccionado) {
          arrayHobbies.push(hobby.id);
        }
      }
      const params = Object.assign({}, { intereses: arrayHobbies });
      this.hobbiesService.sendHobbies(params, this.userId).subscribe(
        state => {
          this.router.navigate([`${ROUTES.STEPS}`]);
        },
        error => {
          console.log(error);
          this.messageChange = '';
          if (error.status === 403) {
          }
          if (error.status === 422) {
            this.errorChange = error.error.errors[0].title;
          }
          if (error.status === 0) {
            this.errorChange =
              '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
          }
        }
      );
    }
  }
}
