import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { CollectionSelectService } from '../../services/collection-select.service';

@Component({
  selector: 'select-states',
  templateUrl: './select-states.component.html',
  styleUrls: ['./select-states.component.scss']
})
export class SelectStatesComponent implements OnChanges {
  @Input() country: any = {};
  @Output() selected: EventEmitter<Object> = new EventEmitter();
  states: Array<any> = [];

  constructor(private collectionService: CollectionSelectService) { }

  ngOnChanges() {
    this.getStates();
  }

  async getStates() {
    if (this.country && this.country.id) {
        this.states = await this.collectionService.getStatesById(this.country.id);
    }
  }

  onSelect(ev) {
    const name = ev.target.selectedOptions[0].text;
    const id = ev.target.value;
    this.selected.emit({name, id});
  }

}
