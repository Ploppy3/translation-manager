import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})

export class DialogConfirmComponent implements OnInit {

  public message: string;
  public action: string;

  constructor(
    public dialog: MatDialogRef<DialogConfirmComponent>,
  ) { }

  ngOnInit() {

  }

}
