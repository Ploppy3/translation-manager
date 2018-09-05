import { Component, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/snackbar.service';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { UpdateComponent } from 'src/app/update/update.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private snackbarService: SnackbarService,
    private snackbar: MatSnackBar,
    private update: SwUpdate,
  ) { }

  ngOnInit() {
    // --------------------------------------------------------------
    this.update.available.subscribe(event => {
      console.log('available', event.available, 'current', event.current);
      this.snackbar.openFromComponent(UpdateComponent);
    });
    this.update.activated.subscribe(event => {
      console.log('current', event.current, 'previous', event.previous);
    });
    // --------------------------------------------------------------
    this.snackbarService.snackbarString$.subscribe(message => {
      this.snackbar.open(message, null, { duration: 2000 });
    });
  }
}
