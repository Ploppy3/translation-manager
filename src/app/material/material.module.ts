import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule, MatSnackBarModule, MatDialogModule, MatMenuModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    MatRippleModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule,
  ],
  declarations: []
})
export class MaterialModule { }
