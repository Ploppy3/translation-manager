import { TestBed, inject } from '@angular/core/testing';

import { ConfirmDialogService } from 'src/app/confirm-dialog.service';

describe('ConfirmDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmDialogService]
    });
  });

  it('should be created', inject([ConfirmDialogService], (service: ConfirmDialogService) => {
    expect(service).toBeTruthy();
  }));
});
