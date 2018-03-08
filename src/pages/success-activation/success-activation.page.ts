import { ROUTES } from "./../../router/routes";
import { Router } from "@angular/router";
import { UserService } from "./../../services/user.service";
import { Component, OnInit } from "@angular/core";
import { CurrentSessionService } from "../../services/current-session.service";

@Component({
  selector: "success-activation",
  templateUrl: "./success-activation.page.html",
  styleUrls: ["./success-activation.page.scss"]
})
export class SuccessActivationPage implements OnInit {
  errorLogin: String;
  userId: String;
  constructor(
    private userService: UserService,
    private currentSessionService: CurrentSessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadIdUser();
  }

  loadIdUser() {
    this.userId = this.currentSessionService.getIdUser();
  }

  async save(evt) {
    try {
      const hobbies = evt.value.field;
      const params = {
        data: {
          id: this.userId,
          attributes: { hobbies },
          type: "users"
        }
      };
      this.userService
        .updateUser(params)
        .then(response => {
          this.router.navigate([`${ROUTES.STEPS}`]);
        })
        .catch(httpErrorResponse => {
          if (httpErrorResponse.status === 403) {
          }
          if (httpErrorResponse.status === 422) {
            this.errorLogin = httpErrorResponse.error.errors[0].title;
          }
          if (httpErrorResponse.status === 0) {
            this.errorLogin =
              "¡No hemos podido conectarnos! Por favor intenta de nuevo.";
          }
        });
    } catch (error) {}
  }
}
