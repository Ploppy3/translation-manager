import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { KopEditorComponent } from 'src/app/kop-editor/kop.component';
import { FixMissingKeyComponent } from 'src/app/kop-editor/fix-missing-key/fix-missing-key.component';
import { MaterialModule } from './material/material.module';
import { ContentEditableComponent } from './content-editable/content-editable.component';
import { ButtonComponent } from './button/button.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UpdateComponent } from './update/update.component';
import { TranslatorComponent } from './translator/translator.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { DonationComponent } from './donation/donation.component';

@NgModule({
  declarations: [
    AppComponent,
    KopEditorComponent,
    FixMissingKeyComponent,
    ContentEditableComponent,
    ButtonComponent,
    UpdateComponent,
    TranslatorComponent,
    ConfirmDialogComponent,
    DonationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    OverlayModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [UpdateComponent, ConfirmDialogComponent, DonationComponent]
})
export class AppModule { }
