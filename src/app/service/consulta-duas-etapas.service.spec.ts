import { TestBed } from '@angular/core/testing';
import { ConsultaDuasEtapasService } from './consulta-duas-etapas.service';

describe('ConsultaDuasEtapasService', () => {
  let service: ConsultaDuasEtapasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultaDuasEtapasService]
    });
    service = TestBed.inject(ConsultaDuasEtapasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit provided object to subscribers', () => {
    const expected = { foo: 'bar' };
    service.atualizacoesConsultaDuasEtapas().subscribe(value => {
      expect(value).toEqual(expected);
    });
    service.publicarAtualizacaoConsultaDuasEtapas(expected);
  });

  it('should notify multiple subscribers', () => {
    const payload = { id: 1 };
    const spy1 = jasmine.createSpy('spy1');
    const spy2 = jasmine.createSpy('spy2');
    service.atualizacoesConsultaDuasEtapas().subscribe(spy1);
    service.atualizacoesConsultaDuasEtapas().subscribe(spy2);
    service.publicarAtualizacaoConsultaDuasEtapas(payload);
    expect(spy1).toHaveBeenCalledWith(payload);
    expect(spy2).toHaveBeenCalledWith(payload);
  });

  it('should not emit past values to new subscribers', () => {
    const earlyPayload = { early: true };
    const lateSpy = jasmine.createSpy('lateSpy');
    service.publicarAtualizacaoConsultaDuasEtapas(earlyPayload);
    service.atualizacoesConsultaDuasEtapas().subscribe(lateSpy);
    expect(lateSpy).not.toHaveBeenCalled();
  });

  it('should propagate null values', () => {
    const spy = jasmine.createSpy('spy');
    service.atualizacoesConsultaDuasEtapas().subscribe(spy);
    service.publicarAtualizacaoConsultaDuasEtapas(null);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('should expose observable without next method', () => {
    const observable = service.atualizacoesConsultaDuasEtapas() as any;
    expect(observable.next).toBeUndefined();
  });
});
