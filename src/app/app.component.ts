import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { UpdateComponent } from 'src/app/update/update.component';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {

  @HostListener('window:beforeunload')
  confirmExit(event: BeforeUnloadEvent) {
    event.preventDefault();
    return event;
  }

  constructor(
    private snackbarService: SnackbarService,
    private snackbar: MatSnackBar,
    private update: SwUpdate,
    private logger: LoggerService,
  ) {
  }

  ngOnInit() {
    // --------------------------------------------------------------
    this.update.available.subscribe(event => {
      this.logger.log(this, 'available', event.available, 'current', event.current);
      this.snackbar.openFromComponent(UpdateComponent);
    });
    this.update.activated.subscribe(event => {
      this.logger.log(this, 'current', event.current, 'previous', event.previous);
    });
    // --------------------------------------------------------------
    this.snackbarService.snackbarString$.subscribe(message => {
      this.snackbar.open(message, null, { duration: 2000 });
    });
  }

  ngDoCheck(): void {
    console.log('check');
  }
}
