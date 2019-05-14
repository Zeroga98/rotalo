import { NavigationService } from './../../pages/products/navigation.service';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CollectionSelectService } from '../../services/collection-select.service';

@Component({
  selector: 'select-states',
  templateUrl: './select-states.component.html',
  styleUrls: ['./select-states.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectStatesComponent implements OnChanges, OnInit {
  @Input() country: any = {};
  @Input() initialValue;
  @Output() selected: EventEmitter<Object> = new EventEmitter();
  states: Array<any> = [];
  currentState: string = '';
  defaultOption: string = 'Estado/Provincia*';

  constructor(
    private collectionService: CollectionSelectService,
    private changeDetectorRef: ChangeDetectorRef,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.updateDefaultOption();
  }

  ngOnChanges() {
    this.getStates();
  }

  async getStates() {

    this.updateDefaultOption();
    if (this.country && this.country.id) {
      this.currentState = '';
      this.states = await this.collectionService.getStatesById(this.country.id);
      if (this.initialValue) {
        if (this.country.id === this.initialValue.country.id) {
          const name = this.initialValue.name;
          const id = this.initialValue.id;
          this.currentState = id;
          this.selected.emit({ name, id });
        } else {
          const name = '';
          const id = '';
          this.currentState = '';
          this.selected.emit({ name, id });
        }
      } else {
        const name = '';
        const id = '';
        this.currentState = '';
        this.selected.emit({ name, id });
      }
      this.changeDetectorRef.markForCheck();
    }
  }

  onSelect(ev) {
    let name;
    if (ev.target.selectedOptions) {
      name = ev.target.selectedOptions[0].text;
    } else {
      name = ev.target.options[ev.target.selectedIndex].text;
    }
    const id = ev.target.value;
    this.selected.emit({ name, id });
    this.changeDetectorRef.markForCheck();
  }

  updateDefaultOption() {
    const options =  ['Estado/Provincia*', 'Departamento*', 'Provincia*'];
    const currentCountryId = this.navigationService.getCurrentCountryId() ? this.navigationService.getCurrentCountryId() : 0;
    this.defaultOption = options[this.navigationService.getCurrentCountryId()];
    if (this.country && this.country.id) {
      if (this.country.id == 1) {
        this.defaultOption = options[this.country.id];
      } else {
        this.defaultOption = options[0];
      }
    } else {
      this.defaultOption = options[1];
    }
    this.changeDetectorRef.markForCheck();
  }
}
