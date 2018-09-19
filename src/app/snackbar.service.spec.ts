import { TestBed, inject } from '@angular/core/testing';

import { SnackbarService } from 'src/app/snackbar.service';

describe('SnackbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnackbarService]
    });
  });

  it('should be created', inject([SnackbarService], (service: SnackbarService) => {
    expect(service).toBeTruthy();
  }));
});
