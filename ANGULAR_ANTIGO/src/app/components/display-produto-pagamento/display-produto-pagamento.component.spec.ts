import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProdutoPagamentoComponent } from './display-produto-pagamento.component';

describe('DisplayProdutoPagamentoComponent', () => {
  let component: DisplayProdutoPagamentoComponent;
  let fixture: ComponentFixture<DisplayProdutoPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayProdutoPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayProdutoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
