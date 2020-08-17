import { TestBed } from '@angular/core/testing';

import { CollapseService } from './collapse.service';

describe('CollapseService', () => {
  let service: CollapseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollapseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
