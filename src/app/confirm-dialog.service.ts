import { Injectable, Injector } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Overlay, GlobalPositionStrategy } from '@angular/cdk/overlay';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { LoggerService } from 'src/app/logger.service';
import { ConfirmDialogRef } from 'src/app/confirm-dialog/confirm-dialog-ref';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private logger: LoggerService,
  ) {
    this.logger.log(this, 'constructor');
  }

  public open(mouseEvent: MouseEvent) {
    const positionStrategy = new GlobalPositionStrategy();
    positionStrategy.left(mouseEvent.clientX - 18 + 'px');
    positionStrategy.top(mouseEvent.clientY - 18 + 'px');

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const dialogRef = new ConfirmDialogRef(overlayRef);
    const injector = this.createInjector(dialogRef);
    const containerPortal = new ComponentPortal(ConfirmDialogComponent, null, injector);
    const componentRef = overlayRef.attach(containerPortal);
    const overlayComponent = componentRef.instance;
    overlayRef.backdropClick().subscribe(() => {
      dialogRef.close(false);
    });
    return dialogRef;
  }

  private createInjector(dialogRef: ConfirmDialogRef) {
    const injectionTokens = new WeakMap();
    injectionTokens.set(ConfirmDialogRef, dialogRef);
    return new PortalInjector(this.injector, injectionTokens);
  }
}
