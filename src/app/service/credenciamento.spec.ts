import { TestBed } from '@angular/core/testing';

import { Credenciamento } from './credenciamento';

describe('Credenciamento', () => {
  let service: Credenciamento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Credenciamento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
