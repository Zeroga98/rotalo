/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResponseMicrositePage } from './response-microsite.page';

describe('ResponseMicrositePage', () => {
  let component: ResponseMicrositePage;
  let fixture: ComponentFixture<ResponseMicrositePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseMicrositePage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseMicrositePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
