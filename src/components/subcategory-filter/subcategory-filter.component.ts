import { ChangeDetectorRef } from '@angular/core';
import { CountryInterface } from './../select-country/country.interface';
import { ChangeDetectionStrategy } from '@angular/core';
import { CurrentSessionService } from './../../services/current-session.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'subcategory-filter',
  templateUrl: './subcategory-filter.component.html',
  styleUrls: ['./subcategory-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubcategoryFilterComponent implements OnInit {
  @Input() config:any;
  @Input() country: CountryInterface;
  @Output() onFilterBySellType: EventEmitter<string> = new EventEmitter();
  @Output() onFilterBySort: EventEmitter<string> = new EventEmitter();
  @Output() onFilterByCity: EventEmitter<any> = new EventEmitter();
  @Output() onFilterByState: EventEmitter<any> = new EventEmitter();

  public state:any = undefined;

  constructor(private currenSession: CurrentSessionService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  filterBySellType(evt, type:string){
    this._removeActiveClass(Array.from(evt.currentTarget.parentNode.children));
    evt.currentTarget.classList.add('active');
    this.onFilterBySellType.emit(type);
  }

  changeSort(evt){
    this.onFilterBySort.emit(evt.currentTarget.value);
  }

  changeState(evt){
    this.state = evt;
    this.onFilterByState.emit(evt);
  }

  changeCity(evt){
    this.onFilterByCity.emit(evt);
  }

  private _removeActiveClass(arrayActions: Array<any>){
    arrayActions.forEach( elem => elem.classList.remove("active"));
  }
}
