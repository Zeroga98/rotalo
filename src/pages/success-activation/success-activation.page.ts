import { ROUTES } from './../../router/routes';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'success-activation',
	templateUrl: './success-activation.page.html',
	styleUrls: ['./success-activation.page.scss']
})
export class SuccessActivationPage implements OnInit {

	constructor(private userService:UserService, private router:Router) { }

	ngOnInit() {
	}

	async save(evt){
		try {
			const hobbies = evt.value.field;
			const params = {
				data:{
					attributes:{ hobbies },
					type: 'users'
				}
			};
			const response = await this.userService.updateUser(params);
			console.log(response);
			this.router.navigate([`${ROUTES.STEPS}`]);
		} catch (error) {
			
		}
	}

}
