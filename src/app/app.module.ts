import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { JsonEditorComponent } from 'src/app/json-editor/kop.component';
import { FixMissingKeyComponent } from 'src/app/json-editor/fix-missing-key/fix-missing-key.component';
import { MaterialModule } from './material/material.module';
import { ContentEditableComponent } from './content-editable/content-editable.component';

@NgModule({
  declarations: [
    AppComponent,
    JsonEditorComponent,
    FixMissingKeyComponent,
    ContentEditableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
