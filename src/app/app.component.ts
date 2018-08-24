import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { collapse } from 'src/app/animations';
import { en as englishData, en_complete as englishDataComplete, en_absurd as englishDataAbsurd, fr as frenchData } from 'src/app/languages';
import { Lang } from 'src/app/structure';
import { fixLanguage, kopToObject, fixAllLanguages, createKopFromObject, createKopFromLanguage } from 'src/app/translation-manager';
import { TranslationService } from 'src/app/translation.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

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
  public ngOnDestroy$ = new EventEmitter<void>();

  public formLanguage = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      forbiddenNamesValidator(this.languages),
    ]),
    nameFile: new FormControl(),
  })

  constructor(
    private translationService: TranslationService,
  ) { }

  ngOnInit() {
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

    //-------------------------------

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
            let start = performance.now();
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
  }

  public createNewLanguage() {
    let kop = createKopFromLanguage(this.baseLanguage);
    let language: Lang = {
      name: this.formLanguage.controls['name'].value,
      kop: kop,
    }
    this.formLanguage.controls['name'].setValue('');
    this.languages.push(language);
    fixLanguage(this.baseLanguage, language);
    this.selectedLanguage = language;
  }

  public deleteLanguage() {
    this.languages.splice(this.languages.indexOf(this.selectedLanguage), 1);
    if (this.selectedLanguage == this.baseLanguage) {
      this.baseLanguage = null;
    }
  }

  public setBaseLanguage() {
    this.baseLanguage = this.selectedLanguage;
    //fixLanguage(this.baseLanguage, this.selectedLanguage);
    fixAllLanguages(this.baseLanguage, this.languages);
  }

  public onUpload(event: any) {
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

  public downloadJson() {
    let obj = kopToObject(this.selectedLanguage.kop);
    let json = JSON.stringify(obj);

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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