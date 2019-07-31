/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TermsShopComponent } from './terms-shop.component';

describe('TermsShopComponent', () => {
  let component: TermsShopComponent;
  let fixture: ComponentFixture<TermsShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
