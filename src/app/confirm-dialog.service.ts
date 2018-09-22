import { Injectable, Injector, ElementRef, NgZone } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Overlay, GlobalPositionStrategy, ViewportRuler, FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { ConfirmPopOverComponent } from 'src/app/confirm-pop-over/confirm-pop-over.component';
import { LoggerService } from 'src/app/logger.service';
import { ConfirmDialogRef } from 'src/app/confirm-pop-over/confirm-pop-over-ref';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private logger: LoggerService,
    private ngZone: NgZone,
  ) {
    this.logger.log(this, 'constructor');
  }

  public openFlexible(mouseEvent: MouseEvent, elRef: ElementRef) {

    const positionStrategy = this.overlay.position().flexibleConnectedTo(elRef);


    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      /*
      positionStrategy: this.overlay.position().connectedTo(
        elRef,
        { originX: 'center', originY: 'bottom' },
        { overlayX: 'center', overlayY: 'center' },
      ),
      // */
      positionStrategy: positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    /*
    window.addEventListener('resize', (event) => {
      requestAnimationFrame(() => {
        overlayRef.updateSize({ width: '100%', height: '100%' });
        // overlayRef.updatePosition();
      });
    });
    // */

    const dialogRef = new ConfirmDialogRef(overlayRef);
    const injector = this.createInjector(dialogRef);
    const containerPortal = new ComponentPortal(ConfirmPopOverComponent, null, injector);
    const componentRef = overlayRef.attach(containerPortal);
    const overlayComponent = componentRef.instance;
    overlayRef.backdropClick().subscribe(() => {
      dialogRef.close(false);
    });
    return dialogRef;
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
    const containerPortal = new ComponentPortal(ConfirmPopOverComponent, null, injector);
    overlayRef.attach(containerPortal);
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
