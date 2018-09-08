import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { LangKVP } from 'src/app/structure';

@Component({
  selector: 'app-fix-missing-key',
  templateUrl: './fix-missing-key.component.html',
  styleUrls: ['./fix-missing-key.component.scss']
})
export class FixMissingKeyComponent implements OnInit {

  public inputValue: HTMLInputElement;
  @ViewChild('inputValue') set setInputValue(value: ElementRef) {
    this.inputValue = value.nativeElement;
  }

  public missingKvp: LangKVP;
  @Input('missingKvp') set setKey(value: LangKVP) {
    this.model_formFixMissingKVP.key = value.key;
    this.missingKvp = value;
  }

  @Output()
  public fix = new EventEmitter<{ key: string, value: string }>();

  public model_formFixMissingKVP = {
    key: null,
    value: null,
  };

  public focusInput() {
    this.inputValue.focus();
  }

  constructor() { }

  ngOnInit() {
  }

}
