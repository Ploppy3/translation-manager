import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule, MatSnackBarModule, MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MatRippleModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  declarations: []
})
export class MaterialModule { }
