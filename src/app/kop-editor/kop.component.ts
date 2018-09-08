import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { LangKOP, LangKVP } from 'src/app/structure';
import { TranslationService } from 'src/app/translation.service';
import { FixMissingKeyComponent } from 'src/app/kop-editor/fix-missing-key/fix-missing-key.component';
import { fade } from 'src/app/animations';

@Component({
  selector: 'app-kop',
  templateUrl: './kop.component.html',
  styleUrls: ['./kop.component.scss'],
  animations: [fade],
})
/**KOP stands for Key Object Pair, the base element of a translation */
export class KopEditorComponent implements OnInit {

  @Input('kop')
  public kop: LangKOP;
  @Input('isBaseLanguage')
  public isBaseLanguage: false;
  @Input('language')
  public language: 'string';

  public showKvpCreator = false;
  public showKvpContextInput = false;
  public showCategoryCreator = false;

  @Output()
  public delete = new EventEmitter<void>();

  @ViewChildren(FixMissingKeyComponent) fixMissingKeyComponents: QueryList<FixMissingKeyComponent>;

  public model_formCreateKvp = {
    key: null,
    value: null,
    context: null,
  };
  public model_formFixMissingKVP = {
    value: null,
  };
  public model_formDefineChild = {
    name: null,
  };

  constructor(
    public translationService: TranslationService,
  ) { }

  ngOnInit(): void {
  }

  public onSubmit_FormCreateKvp() {
    this.tryCreateKVP(this.model_formCreateKvp.key, this.model_formCreateKvp.value, this.model_formCreateKvp.context);
  }

  public onFix(kvp: { key: string, value: string }, id: number) {
    const submited = this.tryCreateKVP(kvp.key, kvp.value);
    if (submited) {
      if (this.fixMissingKeyComponents.toArray().length > id + 1) { // focus next input if is not last input
        this.fixMissingKeyComponents.toArray()[id + 1].focusInput();
      } else if (id > 0) {
        this.fixMissingKeyComponents.toArray()[id - 1].focusInput(); // focus previous input if is last input
      }
    }
  }

  public tryCreateKVP(key: string, value: string, context?: string): boolean {
    let foundKey = false;
    for (const kvp of this.kop.KVPs) {
      if (kvp.key === key) {
        foundKey = true;
        break;
      }
    }
    if (!foundKey) {
      if (context && this.showKvpContextInput) {
        this.kop.KVPs.push({ key: key, value: value, context: context });
      } else {
        this.kop.KVPs.push({ key: key, value: value });
      }
      this.translationService.fixLanguages$.next();
      this.model_formCreateKvp = { key: null, value: null, context: null };
      return true;
    }
    return false;
  }

  public addChild() {
    let alreadyExist = false;
    for (const kop of this.kop.KOPs) {
      if (kop.key === this.model_formDefineChild.name) {
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
      });
      this.model_formDefineChild.name = null;
      this.translationService.markLanguageDirty$.next(this.language);
    }
  }

  public dropKey(kvp: LangKVP) {
    const pos = this.kop.KVPs.indexOf(kvp);
    if (pos > -1) {
      this.kop.KVPs.splice(pos, 1);
      this.translationService.markLanguageDirty$.next(this.language);
    }
  }

  public dropKop(kop: LangKOP) {
    let pos = -1;
    for (let i = 0; i < this.kop.KOPs.length; i++) {
      const _kop = this.kop.KOPs[i];
      if (_kop === kop) {
        pos = i;
        break;
      }
    }
    if (pos > -1) {
      this.kop.KOPs.splice(pos, 1);
      this.translationService.markLanguageDirty$.next(this.language);
    }
  }

  public dropObjectKey(obj: any, key: string) {
    delete obj[key];
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
