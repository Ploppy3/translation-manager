import { Component, OnInit, HostBinding } from '@angular/core';
import { MatDialogRef } from '@angular/material';

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
