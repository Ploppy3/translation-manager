import { Component, OnInit, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { collapse } from 'src/app/animations';
import { en as englishData, en_complete as englishDataComplete, en_absurd as englishDataAbsurd, fr as frenchData } from 'src/app/languages';
import { Lang, Project } from 'src/app/structure';
import { fixLanguage, kopToObject, fixAllLanguages, createKopFromObject, createKopFromLanguage } from 'src/app/translation-manager';
import { TranslationService } from 'src/app/translation.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import * as JSZip from "jszip";
import { downloadUrl, isArray, isNumber } from 'src/app/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [collapse]
})
export class AppComponent implements OnInit, OnDestroy {

  public languages: Lang[] = [];
  public selectedLanguage: Lang;
  public baseLanguage: Lang;
  public showLanguageCreator = false;
  public showLanguageSettings = false;
  public ngOnDestroy$ = new EventEmitter<void>();

  public formLanguage = new FormGroup({
    name: new FormControl('English', [
      Validators.required,
      forbiddenNamesValidator(this.languages),
    ]),
    fileName: new FormControl(null),
  })

  constructor(
    private translationService: TranslationService,
  ) { }

  ngOnInit() {
    /*
    let zip = new JSZip();
    zip.file("hello.txt", "Hello\n");

    var promise: Promise<Uint8Array> = null;
    if (JSZip.support.uint8array) {
      promise = zip.generateAsync({ type: "uint8array" });
    } else { }
    promise.then(data => {
      let blob = new Blob([data], {
        type: 'application/octet-stream'
      });
      let url = URL.createObjectURL(blob);
      downloadUrl(url, 'test.zip');
      URL.revokeObjectURL(url);
    });
    //*/
    //------------------------------
    this.translationService.fixLanguages$.pipe(
      takeUntil(this.ngOnDestroy$),
    ).subscribe(() => {
      fixAllLanguages(this.baseLanguage, this.languages);
    })
    this.translationService.markLanguageDirty$.pipe(
      takeUntil(this.ngOnDestroy$),
    ).subscribe(nameDirtyLanguage => {
      if (this.baseLanguage.name == nameDirtyLanguage) { // check everything if the dirty language is the fallBackLanguage
        fixAllLanguages(this.baseLanguage, this.languages);
      } else {
        for (let language of this.languages) {
          if (language.name == nameDirtyLanguage) {
            if (this.baseLanguage == language) {
              fixAllLanguages(this.baseLanguage, this.languages);
            } else {
              fixLanguage(this.baseLanguage, language);
            }
            break;
          }
        }
      }
    })

    /*
    //-------------------------------
    
    let kop_en = createKopFromObject(englishData);
    let language_en: Lang = {
      name: 'English',
      kop: kop_en,
    }
    this.languages.push(language_en);
    this.baseLanguage = language_en;
    this.selectedLanguage = language_en;

    //-------------------------------

    let kop_fr = createKopFromObject(frenchData);
    let language_fr: Lang = {
      name: 'French',
      kop: kop_fr,
    }
    this.languages.push(language_fr);

    fixLanguage(this.baseLanguage, language_fr)
    //*/
  }

  public createNewLanguage() {
    let kop = createKopFromLanguage(this.baseLanguage);
    let fileName = this.formLanguage.get('fileName').value;
    let language: Lang = {
      name: this.formLanguage.get('name').value,
      fileName: fileName || this.formLanguage.get('name').value,
      kop: kop,
    }
    console.log(language);
    this.formLanguage.reset();
    this.languages.push(language);
    if (this.languages.length == 1) { // set language to base language if it is the only language
      this.baseLanguage = language;
    }
    fixLanguage(this.baseLanguage, language);
    this.selectedLanguage = language;
  }

  /**delete the selected language */
  public deleteLanguage() {
    this.languages.splice(this.languages.indexOf(this.selectedLanguage), 1);
    if (this.selectedLanguage == this.baseLanguage) {
      this.baseLanguage = null;
      if (this.languages.length == 1) {
        this.baseLanguage = this.languages[0];
      }
    }
  }

  public setBaseLanguage() {
    this.baseLanguage = this.selectedLanguage;
    //fixLanguage(this.baseLanguage, this.selectedLanguage);
    fixAllLanguages(this.baseLanguage, this.languages);
  }

  public onImportLanguage(event: any) {
    let file = event.target.files[0]
    let file_reader = new FileReader();
    file_reader.onload = (event) => {
      //console.log('res', event.target['result']);
      try {
        this.selectedLanguage.kop = createKopFromObject(JSON.parse(event.target['result']));
        fixAllLanguages(this.baseLanguage, this.languages);
      } catch (error) { }
    }
    if (file != null) file_reader.readAsText(file);
  }

  public exportLanguage(language: Lang) {
    let obj = kopToObject(language.kop);
    let json = JSON.stringify(obj);
    let blob = new Blob([json], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    downloadUrl(url, 'project.json');
    URL.revokeObjectURL(url);
  }

  public onImportProject(event) {
    let file = event.target.files[0]
    let file_reader = new FileReader();
    file_reader.onload = (event) => {
      try {
        let obj: Project = JSON.parse(event.target['result']);
        if (obj.version == 1) {
          if (isArray(obj.languages)) {
            this.baseLanguage = null;
            this.languages = obj.languages;
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
        console.warn(error);
      }
    }
    if (file != null) file_reader.readAsText(file);
  }

  public exportProject() {
    let baseLanguageId = -1;
    if (this.baseLanguage) {
      baseLanguageId = this.languages.indexOf(this.baseLanguage);
    }
    let project: Project = {
      version: 1,
      languages: this.languages,
      baseLanguageId: baseLanguageId,
    }
    let json = JSON.stringify(project);
    let blob = new Blob([json], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    downloadUrl(url, 'project.json');
    URL.revokeObjectURL(url);
  }

  public exportLanguages() {
    let zip = new JSZip();
    this.languages.forEach(language => {
      let obj = kopToObject(language.kop);
      let json = JSON.stringify(obj);
      zip.file(language.fileName + '.json', json);
    });
    var promise: Promise<Uint8Array> = null;
    if (JSZip.support.uint8array) {
      promise = zip.generateAsync({ type: "uint8array" });
    } else { }
    promise.then(data => {
      let blob = new Blob([data], {
        type: 'application/octet-stream'
      });
      let url = URL.createObjectURL(blob);
      downloadUrl(url, 'languages.zip');
      URL.revokeObjectURL(url);
    });
    /*
    let zip = new JSZip();
    zip.file("hello.txt", "Hello\n");

    var promise: Promise<Uint8Array> = null;
    if (JSZip.support.uint8array) {
      promise = zip.generateAsync({ type: "uint8array" });
    } else { }
    promise.then(data => {
      let blob = new Blob([data], {
        type: 'application/octet-stream'
      });
      let url = URL.createObjectURL(blob);
      downloadUrl(url, 'test.zip');
      URL.revokeObjectURL(url);
    });
    //*/
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next();
  }

}

function forbiddenNamesValidator(forbiddenLanguages: Lang[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    for (let language of forbiddenLanguages) {
      if (language.name == control.value) {
        return { 'forbiddenName': { value: null } };
      }
    }
    return null;
  };
}