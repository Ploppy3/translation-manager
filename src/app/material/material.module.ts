import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
