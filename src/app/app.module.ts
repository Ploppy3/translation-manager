import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from 'src/app/app.component';
import { KopEditorComponent } from 'src/app/kop-editor/kop.component';
import { FixMissingKeyComponent } from 'src/app/kop-editor/fix-missing-key/fix-missing-key.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ContentEditableComponent } from 'src/app/content-editable/content-editable.component';
import { ButtonComponent } from 'src/app/button/button.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { UpdateComponent } from 'src/app/update/update.component';
import { TranslatorComponent } from 'src/app/translator/translator.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { DonationComponent } from 'src/app/donation/donation.component';

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
