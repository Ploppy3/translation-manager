import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private _snackbarString$ = new Subject<string>();
  public snackbarString$ = this._snackbarString$.asObservable();

  constructor() { }

  public showSnackbar(message: string) {
    this._snackbarString$.next(message);
  }
}
