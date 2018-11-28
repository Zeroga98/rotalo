import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NavigationTopService {

  private eventSourceCommunity = new BehaviorSubject<any>(null);
  currentEventCommunity = this.eventSourceCommunity.asObservable();

  private eventSourceCategory = new BehaviorSubject<any>(null);
  currentEventCategory = this.eventSourceCategory.asObservable();

  private eventSourceSubCategory = new BehaviorSubject<any>(null);
  currentEventSubCategory = this.eventSourceSubCategory.asObservable();

  constructor() { }
  private autoCompleteOptions: Array<string> = [];

  getAutoCompleteOptions(): Array<string> {
    return this.autoCompleteOptions;
  }

  setAutoCompleteOptions(options: Array<string>) {
    this.autoCompleteOptions = options;
  }

  addOptions(option: string): Array<string> {
    if (this.autoCompleteOptions.indexOf(option) == -1) this.autoCompleteOptions.push(option);
    return this.autoCompleteOptions;
  }

  changeCommunity(event) {
    this.eventSourceCommunity.next(event);
  }

  changeCategory(event) {
    this.eventSourceCategory.next(event);
  }

  changeSubCategory(event) {
    this.eventSourceSubCategory.next(event);
  }

}
