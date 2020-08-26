import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { ConfirmDialogRef } from 'src/app/confirm-pop-over/confirm-pop-over-ref';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-pop-over.component.html',
  styleUrls: ['./confirm-pop-over.component.scss'],
  animations: [
    trigger('dialogEnter', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('.25s ease-in-out', style({ transform: 'scale(1.5)' })),
        animate('.25s ease-in-out', style({ transform: 'scale(1)' })),
      ]),
    ]),
    trigger('dialogLeave', [
      state('visible', style({})),
      state('hidden', style({ transform: 'scale(0)' })),
      transition('* => hidden', [
        animate('.25s ease-in-out', style({ transform: 'scale(0)' })),
      ]),
    ]),
  ],
})
export class ConfirmPopOverComponent implements OnInit {

  private confirm: boolean;

  @HostBinding('@dialogEnter') dialogEnter: true;
  @HostBinding('@dialogLeave') dialogLeave = 'visible';
  @HostListener('@dialogLeave.done', ['$event']) onAnimationLeaveDone(event) {
    if (this.dialogLeave === 'hidden') {
      this.dialogRef.close(this.confirm);
    }
  }

  constructor(
    public dialogRef: ConfirmDialogRef
  ) { }

  ngOnInit() {
  }

  public close(confirm: boolean) {
    this.dialogLeave = 'hidden';
    this.confirm = confirm;
    // this.dialogRef.close(confirm);
  }

}
