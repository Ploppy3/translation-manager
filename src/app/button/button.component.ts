import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

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
  @Output() clicked = new EventEmitter<MouseEvent>();

  constructor(
    public elementRef: ElementRef,
  ) { }

  ngOnInit() {
  }

  public click(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.next(event);
    }
  }

}
