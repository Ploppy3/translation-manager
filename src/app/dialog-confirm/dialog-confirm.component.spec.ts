import { TestBed } from '@angular/core/testing';
import { MaterialModule } from "../material/material.module";
import { DialogConfirmComponent } from './dialog-confirm.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { firebaseConfig } from "../firebaseConfig";
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
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
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    DialogConfirmComponent,
  ],
  providers: [
    AngularFireAuth,
    AngularFireDatabase,
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
    dialog = TestBed.get(MatDialog);
  });

  it('should create', () => {
    let dialogRef = dialog.open(DialogConfirmComponent);
    expect(dialogRef).toBeTruthy();
    //const button = overlayContainerElement.querySelector('button');
    //expect(button.textContent).toBe('Annuler');
  });
});
