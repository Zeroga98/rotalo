import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'subcategory-filter',
  templateUrl: './subcategory-filter.component.html',
  styleUrls: ['./subcategory-filter.component.scss']
})
export class SubcategoryFilterComponent implements OnInit {
  @Input() config: Object;
  @Output() onFilterBySellType: EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  filterBySellType(evt, type:string){
    this._removeActiveClass(Array.from(evt.currentTarget.parentNode.children));
    evt.currentTarget.classList.add('active');
    this.onFilterBySellType.emit(type);
  }

  private _removeActiveClass(arrayActions: Array<any>){
    arrayActions.forEach( elem => elem.classList.remove("active"));
  }
}
