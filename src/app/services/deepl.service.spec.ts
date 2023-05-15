import { TestBed } from '@angular/core/testing';

import { DeeplService } from './deepl.service';

describe('DeeplService', () => {
  let service: DeeplService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeeplService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
