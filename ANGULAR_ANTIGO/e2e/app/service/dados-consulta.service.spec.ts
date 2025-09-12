import { TestBed, inject } from '@angular/core/testing';

import { DadosConsultaService } from './dados-consulta.service';

describe('DadosConsultaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DadosConsultaService]
    });
  });

  it('should be created', inject([DadosConsultaService], (service: DadosConsultaService) => {
    expect(service).toBeTruthy();
  }));
});
