import { TestBed } from '@angular/core/testing';
import { MaterialModule } from '../material/material.module';
import { DialogConfirmComponent } from './dialog-confirm.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';

const TEST_DIRECTIVES = [
  DialogConfirmComponent,
];

@NgModule({
  imports: [
    MaterialModule,
    NoopAnimationsModule,
    FormsModule,
  ],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    DialogConfirmComponent,
  ],
  providers: [
  ],
})
class DialogTestModule { }

describe('DialogConfirmComponent', () => {

  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
      providers: [
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        }
      ]
    });
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    const dialogRef = dialog.open(DialogConfirmComponent);
    expect(dialogRef).toBeTruthy();
  });
});
