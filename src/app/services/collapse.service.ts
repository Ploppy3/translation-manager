import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollapseService {

  public onCollapseAll$ = new EventEmitter<void>();

  constructor() { }
}
