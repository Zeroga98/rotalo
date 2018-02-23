import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-hobbies",
  templateUrl: "hobbies.page.html",
  styleUrls: ["hobbies.page.scss"]
})
export class HobbiesPage implements OnInit {
  public hobbiesForm: FormGroup;
  public errorChange: String;
  public messageChange: String;
  public userHobbie: any;
  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.hobbiesForm = this.fb.group({
      hobbie: ""
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
      hobbie: user.hobbies
    });
  }

  onSubmit() {
    console.log('onSubmit');
  }
}
