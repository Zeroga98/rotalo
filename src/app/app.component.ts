import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{

	constructor(private router: Router){}

	ngOnInit(): void {
    moment.locale('es');
	}

}
