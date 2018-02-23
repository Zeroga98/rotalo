import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
  public userHobbie: any = "";
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.hobbiesForm = new FormGroup({
      hobbie: new FormControl()
    });
  }

  async loadHobbie() {
    this.userHobbie = await this.userService.getInfoUser();
  }

  onSubmit() {

  }
}
