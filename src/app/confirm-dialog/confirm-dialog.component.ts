import { Component, OnInit } from '@angular/core';
import { CustomOverlayRef } from 'src/app/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    private customDialogRef: CustomOverlayRef,
  ) { }

  ngOnInit() {
  }

  public close() {
    this.customDialogRef.close();
  }

}
