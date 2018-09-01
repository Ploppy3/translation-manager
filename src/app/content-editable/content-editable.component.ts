import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { createViewChildren } from '@angular/compiler/src/core';

@Component({
  selector: 'app-content-editable',
  templateUrl: './content-editable.component.html',
  styleUrls: ['./content-editable.component.scss']
})
export class ContentEditableComponent implements OnInit {

  public var: string;
  private span: HTMLSpanElement;

  @Output() change = new EventEmitter<string>();
  @ViewChild('span') _spanRef: ElementRef;

  @Input('variable') set setVariable(value: string) {
    this.var = value;
    requestAnimationFrame(() => {
      this.span.textContent = this.var;
    });
  }

  constructor() { }

  ngOnInit() {
    this.span = this._spanRef.nativeElement;
  }

  public onChange() {
    console.log('change spotted');

    this.change.next(this.span.textContent);
  }

}
