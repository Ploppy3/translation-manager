import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private _snackbarString$ = new Subject<string>();
  public snackbarString$ = this._snackbarString$.asObservable();

  constructor(
    private logger: LoggerService,
  ) {
    logger.log(this, 'constructor');
  }

  public showMessage(message: string) {
    this._snackbarString$.next(message);
  }
}
