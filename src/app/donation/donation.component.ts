import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss'],
})
export class DonationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DonationComponent>,
  ) { }

  ngOnInit() {
  }

}
