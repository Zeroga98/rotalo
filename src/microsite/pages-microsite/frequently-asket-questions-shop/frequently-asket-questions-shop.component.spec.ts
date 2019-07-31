/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FrequentlyAsketQuestionsShopComponent } from './frequently-asket-questions-shop.component';

describe('FrequentlyAsketQuestionsShopComponent', () => {
  let component: FrequentlyAsketQuestionsShopComponent;
  let fixture: ComponentFixture<FrequentlyAsketQuestionsShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequentlyAsketQuestionsShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentlyAsketQuestionsShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
