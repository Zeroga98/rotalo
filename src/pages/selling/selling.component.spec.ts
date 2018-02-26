/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SellingComponent } from './selling.component';

describe('SellingComponent', () => {
  let component: SellingComponent;
  let fixture: ComponentFixture<SellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
