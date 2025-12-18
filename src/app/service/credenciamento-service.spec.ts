import { TestBed } from '@angular/core/testing';

import { CredenciamentoService } from './credenciamento-service';

describe('CredenciamentoService', () => {
  let service: CredenciamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredenciamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
