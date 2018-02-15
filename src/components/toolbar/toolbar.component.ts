import { UserService } from './../../services/user.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
	@Output() selectedCommunity: EventEmitter<any> = new EventEmitter();
	tags: any = [];
	community: any;

	constructor(private userService: UserService) { }

	async ngOnInit() {
		this.community = await this.userService.getCommunityUser()
	}

	changeSelectComunidad(evt){
		const name = evt.target.selectedOptions[0].text;
        const id = evt.target.value;
		this.selectedCommunity.emit({name, id});
	}
}
