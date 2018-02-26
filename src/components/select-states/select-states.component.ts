import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { CollectionSelectService } from '../../services/collection-select.service';

@Component({
  selector: 'select-states',
  templateUrl: './select-states.component.html',
  styleUrls: ['./select-states.component.scss']
})
export class SelectStatesComponent implements OnChanges {
  @Input() country: any = {};
  @Input() initialValue;
  @Output() selected: EventEmitter<Object> = new EventEmitter();
  states: Array<any> = [];
  currentState: String = '';
  constructor(private collectionService: CollectionSelectService) { }

  ngOnChanges() {
    this.getStates();
  }

  async getStates() {
    if (this.country && this.country.id) {
        this.currentState = '';
        this.states = await this.collectionService.getStatesById(this.country.id);
        if (this.initialValue) {
          if (this.country.id === this.initialValue.id) {
            const name  = this.initialValue.name;
            const id = this.initialValue.id;
            this.currentState = id;
            this.selected.emit({name, id});
          }
        }
    }
  }

  onSelect(ev) {
    const name = ev.target.selectedOptions[0].text;
    const id = ev.target.value;
    this.selected.emit({name, id});
  }

}
