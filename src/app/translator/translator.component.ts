import { Component, OnInit, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
import { collapse, fade } from 'src/app/animations';
import { Lang, Project } from 'src/app/structure';
import { fixLanguage, kopToObject, fixAllLanguages, createKopFromObject, createKopFromLanguage } from 'src/app/translation-manager';
import { TranslationService } from 'src/app/translation.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import * as JSZip from 'jszip';
import { downloadUrl, isArray, isNumber } from 'src/app/util';
import { trigger, transition, style, animate } from '@angular/animations';
import { SnackbarService } from 'src/app/snackbar.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogService } from 'src/app/confirm-dialog.service';
import { LoggerService } from 'src/app/logger.service';
import { MatDialog } from '@angular/material/dialog';
import { DonationComponent } from 'src/app/donation/donation.component';
import { DialogConfirmComponent } from 'src/app/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.scss'],
  animations: [
    collapse,
    fade,
    trigger('revealSlideVertical', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate3d(0, 50px, 0)',
        }),
        animate('.5s ease', style({
          opacity: 1,
          transform: 'translate3d(0,0,0)',
        })),
      ]),
      transition(':leave', [
        animate('.5s ease', style({
          opacity: 0,
          transform: 'translate3d(0,50px, 0)',
        })),
      ]),
    ])
  ]
})
/**The base component, created in case a router is used in the future */
export class TranslatorComponent implements OnInit, OnDestroy {

  public languages: Lang[] = [];
  public selectedLanguage: Lang;
  public baseLanguage: Lang;
  public showLanguageCreator = false;
  public showLanguageSettings = false;
  public ngOnDestroy$ = new EventEmitter<void>();
  public environment = environment;

  public formLanguage = new FormGroup({
    name: new FormControl('English', [
      Validators.required,
      forbiddenNamesValidator(this.languages),
    ]),
    fileName: new FormControl(null),
  });

  constructor(
    private translationService: TranslationService,
    private snackbarService: SnackbarService,
    private confirmDialogService: ConfirmDialogService,
    private logger: LoggerService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
    this.translationService.fixLanguages$.pipe(
      takeUntil(this.ngOnDestroy$),
    ).subscribe(() => {
      fixAllLanguages(this.baseLanguage, this.languages);
    });
    this.translationService.markLanguageDirty$.pipe(
      takeUntil(this.ngOnDestroy$),
    ).subscribe(nameDirtyLanguage => {
      if (this.baseLanguage.name === nameDirtyLanguage) { // check everything if the dirty language is the fallBackLanguage
        fixAllLanguages(this.baseLanguage, this.languages);
      } else {
        for (const language of this.languages) {
          if (language.name === nameDirtyLanguage) {
            if (this.baseLanguage === language) {
              fixAllLanguages(this.baseLanguage, this.languages);
            } else {
              fixLanguage(this.baseLanguage, language);
            }
            break;
          }
        }
      }
    });
  }

  public test(mouseEvent: MouseEvent, elRef: ElementRef) {
    /*
    const promiseRemote = {
      resolve: null,
      reject: null,
    };
    const promise = new Promise((resolve, reject) => {
      promiseRemote.resolve = resolve;
      promiseRemote.reject = reject;
    });
    promise.then((value) => {
      this.logger.log(this, 'then');
    });
    // */
    // *
    this.confirmDialogService.openFlexible(mouseEvent, elRef).confirm$.subscribe(confirm => {
      console.log(confirm);
    });
    // */
  }

  public openDonationDialog() {
    this.matDialog.open(DonationComponent, { maxWidth: 350 });
  }

  public createNewLanguage() {
    const kop = createKopFromLanguage(this.baseLanguage);
    const fileName = this.formLanguage.get('fileName').value;
    const language: Lang = {
      name: this.formLanguage.get('name').value,
      fileName: fileName || this.formLanguage.get('name').value,
      kop: kop,
    };
    this.logger.log(this, language);
    this.formLanguage.reset();
    this.languages.push(language);
    if (this.languages.length === 1) { // set language to base language if it is the only language
      this.baseLanguage = language;
    }
    fixLanguage(this.baseLanguage, language);
    this.selectedLanguage = language;
  }

  /**delete the selected language */
  public deleteLanguage() {
    this.languages.splice(this.languages.indexOf(this.selectedLanguage), 1);
    if (this.selectedLanguage === this.baseLanguage) {
      this.baseLanguage = null;
      if (this.languages.length === 1) {
        this.baseLanguage = this.languages[0];
      }
    }
    this.selectedLanguage = this.languages[0];
  }

  public setBaseLanguage() {
    this.baseLanguage = this.selectedLanguage;
    // fixLanguage(this.baseLanguage, this.selectedLanguage);
    fixAllLanguages(this.baseLanguage, this.languages);
  }

  public importLanguage(event: any) {
    const file = event.target.files[0];
    const file_reader = new FileReader();
    file_reader.onload = (onLoad_event) => {
      try {
        this.selectedLanguage.kop = createKopFromObject(JSON.parse(onLoad_event.target['result'] as string));
        fixAllLanguages(this.baseLanguage, this.languages);
      } catch (error) { }
    };
    if (file != null) { file_reader.readAsText(file); }
    event.target.value = null;
  }

  public exportLanguage(language: Lang) {
    const obj = kopToObject(language.kop);
    const json = JSON.stringify(obj);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, this.selectedLanguage.fileName + '.json');
    URL.revokeObjectURL(url);
  }

  public askCloseProjectByDialog() {
    const dialogRef = this.matDialog.open(DialogConfirmComponent);
    const componentRef = dialogRef.componentInstance;
    componentRef.message = 'Close the project ?';
    componentRef.action = 'close';
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.closeProject();
      }
    });
  }

  public askCloseProject(event: MouseEvent) {
    this.confirmDialogService.open(event).confirm$.subscribe(confirm => {
      if (confirm) {
        this.closeProject();
      }
    });
  }

  public askDeleteLanguage(event: MouseEvent) {
    this.confirmDialogService.open(event).confirm$.subscribe(confirm => {
      if (confirm) {
        this.deleteLanguage();
      }
    });
  }

  public askSetBaseLanguage(event: MouseEvent) {
    this.confirmDialogService.open(event).confirm$.subscribe(confirm => {
      if (confirm) {
        this.setBaseLanguage();
      }
    });
  }

  public closeProject() {
    this.baseLanguage = null;
    this.languages.splice(0, this.languages.length); // empty without loosing ref in order to keep the validator working
    this.selectedLanguage = null;
  }

  public importProject(event) {
    const file = event.target.files[0];
    const file_reader = new FileReader();
    file_reader.onload = (onLoad_event) => {
      try {
        const obj: Project = JSON.parse(onLoad_event.target['result'] as string);
        this.closeProject();
        if (obj.version === 1) {
          if (isArray(obj.languages)) {
            obj.languages.forEach(lang => { // push without loosing ref in order to keep the validator working
              this.languages.push(lang);
            });
            this.logger.log(this, this.languages);
            if (this.languages.length > 0) {
              this.selectedLanguage = this.languages[0];
            }
            if (isNumber(obj.baseLanguageId) && obj.baseLanguageId > -1 && obj.baseLanguageId < obj.languages.length) {
              this.baseLanguage = this.languages[obj.baseLanguageId];
            }
            fixAllLanguages(this.baseLanguage, this.languages);
          }
        }
      } catch (error) {
        this.logger.warn(error);
        this.snackbarService.showMessage('An error occured, could not open project');
      }
    };
    if (file != null) { file_reader.readAsText(file); }
    event.target.value = null;
  }

  public exportProject() {
    let baseLanguageId = -1;
    if (this.baseLanguage) {
      baseLanguageId = this.languages.indexOf(this.baseLanguage);
    }
    const project: Project = {
      version: 1,
      languages: this.languages,
      baseLanguageId: baseLanguageId,
    };
    const json = JSON.stringify(project);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadUrl(url, 'project.json');
    URL.revokeObjectURL(url);
  }

  public exportLanguages() {
    const zip = new JSZip();
    this.languages.forEach(language => {
      const obj = kopToObject(language.kop);
      const json = JSON.stringify(obj);
      zip.file(language.fileName + '.json', json);
    });
    let promise: Promise<Uint8Array> = null;
    if (JSZip.support.uint8array) {
      promise = zip.generateAsync({ type: 'uint8array' });
    } else { }
    promise.then(data => {
      const blob = new Blob([data], {
        type: 'application/octet-stream'
      });
      const url = URL.createObjectURL(blob);
      downloadUrl(url, 'languages.zip');
      URL.revokeObjectURL(url);
    });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next();
  }

}

function forbiddenNamesValidator(forbiddenLanguages: Lang[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    for (const language of forbiddenLanguages) {
      if (language.name === control.value) {
        return { 'forbiddenName': { value: null } };
      }
    }
    return null;
  };
}
