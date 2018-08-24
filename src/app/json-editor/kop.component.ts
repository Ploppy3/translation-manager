import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { LangKOP, LangKVP } from 'src/app/structure';
import { TranslationService } from 'src/app/translation.service';
import { FixMissingKeyComponent } from 'src/app/json-editor/fix-missing-key/fix-missing-key.component';

@Component({
  selector: 'app-kop',
  templateUrl: './kop.component.html',
  styleUrls: ['./kop.component.scss']
})
export class JsonEditorComponent implements OnInit {

  @Input('kop')
  public kop: LangKOP;
  @Input('isBaseLanguage')
  public isBaseLanguage: false;
  @Input('language')
  public language: 'string';

  @Output()
  public delete = new EventEmitter<void>();

  @ViewChildren(FixMissingKeyComponent) fixMissingKeyComponents: QueryList<FixMissingKeyComponent>;

  public showKvpEditor = false;
  public model_formCreateKvp = {
    key: null,
    value: null,
  }
  public model_formFixMissingKVP = {
    value: null,
  }
  public model_formDefineChild = {
    name: null,
  }

  constructor(
    public translationService: TranslationService,
  ) { }

  ngOnInit(): void {
  }

  public onFormCreateKvpSubmit() {
    this.tryCreateKVP(this.model_formCreateKvp.key, this.model_formCreateKvp.value);
  }

  public onFix(kvp: { key: string, value: string }, id: number) {
    let submited = this.tryCreateKVP(kvp.key, kvp.value);
    if (submited && this.fixMissingKeyComponents.toArray().length > id + 1) {
      this.fixMissingKeyComponents.toArray()[id + 1].focusInput();
    }
  }

  public tryCreateKVP(key: string, value: string): boolean {
    let foundKey = false;
    for (let kvp of this.kop.KVPs) {
      if (kvp.key == key) {
        foundKey = true;
        break;
      }
    }
    if (!foundKey) {
      this.kop.KVPs.push({ key: key, value: value });
      this.translationService.fixLanguages$.next();
      this.model_formCreateKvp = { key: null, value: null };
      return true;
    }
    return false;
  }

  public addChild() {
    let alreadyExist = false;
    for (const kop of this.kop.KOPs) {
      if (kop.key == this.model_formDefineChild.name) {
        alreadyExist = true;
        break;
      }
    }
    if (!alreadyExist) {
      this.kop.KOPs.push({
        key: this.model_formDefineChild.name,
        KOPs: [],
        KVPs: [],
        missingKVPs: [],
      })
      this.model_formDefineChild.name = null;
      this.translationService.markLanguageDirty$.next(this.language);
    }
  }

  public dropKey(kvp: LangKVP) {
    //console.log('trying to drop key', kvp);

    let pos = this.kop.KVPs.indexOf(kvp)
    if (pos > -1) {
      this.kop.KVPs.splice(pos, 1);
      this.translationService.markLanguageDirty$.next(this.language);
    }
  }

  public dropKop(kop: LangKOP) {
    let pos: number = -1;
    for (let i = 0; i < this.kop.KOPs.length; i++) {
      const _kop = this.kop.KOPs[i];
      if (_kop == kop) {
        pos = i;
        break;
      }
    }
    if (pos > -1) {
      this.kop.KOPs.splice(pos, 1);
      this.translationService.markLanguageDirty$.next(this.language);
    }
  }

  public trackById(id, obj: any) {
    return obj;
  }

  public trackByMissingKvp(id, missingKvp: LangKVP) {
    return missingKvp.key;
  }

  public trackByKvp(id, kvp: LangKVP) {
    return kvp.key;
  }
  public trackByKop(id, kop: LangKOP) {
    return kop.key;
  }

}