import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  /**Used to communicate with the root component able to start the change detection */
  public fixLanguages$ = new EventEmitter<void>();
  public markLanguageDirty$ = new EventEmitter<string>();

  constructor() { }
}
