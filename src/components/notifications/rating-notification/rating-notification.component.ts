import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { NotificationsInterface } from '../../../commons/interfaces/notifications.interface';

@Component({
  selector: 'rating-notification',
  templateUrl: './rating-notification.component.html',
  styleUrls: ['./rating-notification.component.scss']
})
export class RatingNotificationComponent implements OnInit {
  @Input() notification: NotificationsInterface;
  @Output() rated: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log(this.notification);
  }

  rate(){
    this.rated.emit();
  }

}
