import { Injectable, EventEmitter } from '@angular/core';
import { LoggerService } from 'src/app/logger.service';

@Injectable({
  providedIn: 'root'
})

/**Used to communicate with the root component which is able to start the change detection */
export class TranslationService {

  public fixLanguages$ = new EventEmitter<void>();
  public markLanguageDirty$ = new EventEmitter<string>();

  constructor(
    private logger: LoggerService,
  ) {
    this.logger.log(this, 'constructor');
  }
}
