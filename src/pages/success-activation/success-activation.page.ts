import { ROUTES } from './../../router/routes';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'success-activation',
	templateUrl: './success-activation.page.html',
	styleUrls: ['./success-activation.page.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessActivationPage implements OnInit {

	constructor(private userService: UserService, private router: Router) { }

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
			this.router.navigate([`${ROUTES.STEPS}`]);
		} catch (error) {

		}
	}

}
