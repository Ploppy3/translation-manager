import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() icon: string;
  @Input() text: string;
  @Input() disabled = false;
  @Input() isSubmit = false;
  @Output() clicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  public click() {
    if (!this.disabled) {
      this.clicked.next();
    }
  }

}
