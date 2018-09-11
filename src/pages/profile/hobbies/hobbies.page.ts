import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { HobbiesService } from "../../../services/hobbies.service";
import { CurrentSessionService } from "../../../services/current-session.service";
import { UtilsService } from "../../../util/utils.service";
import { SettingsService } from "../../../services/settings.service";


@Component({
  selector: "app-hobbies",
  templateUrl: "hobbies.page.html",
  styleUrls: ["hobbies.page.scss"]
})
export class HobbiesPage implements OnInit {
  public errorChange: String;
  public messageChange: String;
  public userHobbie: any;
  private userId;
  public hobbies: Array<any> = [];
  private numberHobbies = 0;
 // public maxHobbies: number = 5;
  public minHobbies: number = 1;
  public disableButton;
  constructor(
    private userService: UserService,
    private currentSessionService: CurrentSessionService,
    private hobbiesService: HobbiesService,
    private utilsService: UtilsService,
    private settingsService: SettingsService
  ) {
   // this.loadMaxMinNumHobbies();
  }

  ngOnInit() {
    this.loadIdUser();
    this.loadHobbies();
    this.disableButton = true;
  }

 /* loadMaxMinNumHobbies() {
    this.settingsService.getSettings().then(response => {
      if (response) {
        const minObj = response.find(function (setting) { return setting.name === 'min_interests_to_add'; });
        const maxObJ = response.find(function (setting) { return setting.name === 'max_interests_to_add'; });
        console.log(maxObJ.value);
        this.maxHobbies = Number(maxObJ.value);
        this.minHobbies = Number(minObj.value);
      }
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
    this.disableButton = false;
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

  /*checkMaxNumberHobbies(): boolean {
    if (this.numberHobbies < this.maxHobbies) {
      return false;
    }
    return true;
  }*/

  isValidateNumberHobbies(): boolean {
    if (
    //  this.numberHobbies <= this.maxHobbies &&
      this.numberHobbies >= this.minHobbies &&  !this.disableButton
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
      const params = Object.assign({}, {intereses: arrayHobbies });
      this.hobbiesService.sendHobbies(params, this.userId).subscribe(
        state => {
          this.messageChange = 'Sus intereses se han guardado correctamente.';
          this.utilsService.goToTopWindow(20, 600);
        },
        error => {
          this.messageChange = '';
          if (error.status === 403) {
          }
          if (error.status === 422) {
            this.errorChange = error.error.errors[0].title;
          }
          if (error.status === 0) {
            this.errorChange = '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
          }
          this.utilsService.goToTopWindow(20, 600);
        }
      );
    }

  }
}
