import { Injectable, ErrorHandler } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  /**Force stacktrade to be logged using the console.warn() method */
  private forceStackTrace = false;

  constructor(
    private errorHandler: ErrorHandler
  ) {
    this.log(this, 'constructor');
  }

  public log(obj: any, value: any, ...rest: any[]) {
    if (!environment.production) {
      const args = ['%c' + obj.constructor.name, 'color:' + '#1E88E5', value, ...rest];
      if (this.forceStackTrace) {
        console.warn(...args);
      } else {
        console.log(...args);
      }
    }
  }

  public error(error: Error) {
    this.errorHandler.handleError(error);
  }

  public warn(value: any, ...rest: any[]) {
    console.warn(value, ...rest);
  }
}
