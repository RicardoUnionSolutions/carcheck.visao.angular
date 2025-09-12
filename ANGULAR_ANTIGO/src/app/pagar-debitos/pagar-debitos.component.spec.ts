/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PagarDebitosComponent } from './pagar-debitos.component';

describe('PagarDebitosComponent', () => {
  let component: PagarDebitosComponent;
  let fixture: ComponentFixture<PagarDebitosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagarDebitosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagarDebitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
