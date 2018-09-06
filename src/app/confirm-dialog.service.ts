import { Injectable, Injector } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { Overlay, GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {

  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) { }

  public open(mouseEvent: MouseEvent) {
    const positionStrategy = new GlobalPositionStrategy();
    positionStrategy.left(mouseEvent.clientX - 18 + 'px');
    positionStrategy.top(mouseEvent.clientY - 13 + 'px');
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });
    const dialogRef = new CustomOverlayRef(overlayRef);
    const customInjector = this.createInjector(dialogRef);
    /* THIS CODE IS NEEDED THOUGH DISABLED BECAUSE IT CRASHES THE APP
    const componentPortal = new ComponentPortal(ConfirmDialogComponent, null, customInjector);
    const componentRef = overlayRef.attach(componentPortal);
    overlayRef.backdropClick().subscribe(() => {
      dialogRef.close();
    });
    return componentRef.instance;
    // */
  }

  private createInjector(customOverlayRef: CustomOverlayRef) {
    const injectionTokens = new WeakMap();
    injectionTokens.set(CustomOverlayRef, customOverlayRef);
    return new PortalInjector(this.injector, injectionTokens);
  }
}

export class CustomOverlayRef {

  constructor(
    private overlayRef: OverlayRef,
  ) { }

  public close(value?: any) {
    this.overlayRef.dispose();
  }

}
