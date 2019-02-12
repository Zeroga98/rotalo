import { Component, OnInit } from '@angular/core';
import { DATAPICKER_CONFIG } from '../../../commons/constants/datapicker.config';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent implements OnInit {
  datePickerOptions: IMyDpOptions = DATAPICKER_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
