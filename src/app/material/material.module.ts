import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule, MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MatRippleModule,
    MatSnackBarModule,
  ],
  declarations: []
})
export class MaterialModule { }
