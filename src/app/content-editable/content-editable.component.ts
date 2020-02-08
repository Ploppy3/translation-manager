import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { createViewChildren } from '@angular/compiler/src/core';
import { LoggerService } from 'src/app/logger.service';

@Component({
  selector: 'app-content-editable',
  templateUrl: './content-editable.component.html',
  styleUrls: ['./content-editable.component.scss']
})
export class ContentEditableComponent implements OnInit {

  public var: string;
  private span: HTMLSpanElement;

  @Output() change = new EventEmitter<string>();
  @ViewChild('span', { static: true }) _spanRef: ElementRef;

  @Input('variable') set setVariable(value: string) {
    this.var = value;
    requestAnimationFrame(() => {
      this.span.textContent = this.var;
    });
  }

  constructor(
    private logger: LoggerService,
  ) { }

  ngOnInit() {
    this.span = this._spanRef.nativeElement;
  }

  public onChange() {
    this.logger.log(this, 'change spotted');

    this.change.next(this.span.textContent);
  }

}
