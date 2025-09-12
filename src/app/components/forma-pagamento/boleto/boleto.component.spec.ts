import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BoletoComponent } from './boleto.component';

describe('BoletoComponent', () => {
  let component: BoletoComponent;
  let fixture: ComponentFixture<BoletoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BoletoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

