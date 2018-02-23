/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LigthboxSendMessageComponent } from './ligthboxSendMessage.component';

describe('LigthboxSendMessageComponent', () => {
  let component: LigthboxSendMessageComponent;
  let fixture: ComponentFixture<LigthboxSendMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LigthboxSendMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LigthboxSendMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
