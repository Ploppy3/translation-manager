import { LangKOP, LangKVP, Lang } from 'src/app/structure';
import { isString, isObject } from 'src/app/util';

export function fixAllLanguages(baseLanguage: Lang, languages: Lang[]) {
  if (baseLanguage) {
    fixLanguage(baseLanguage, baseLanguage);
    languages.forEach(language => {
      if (language !== baseLanguage) {
        const start = performance.now();
        fixLanguage(baseLanguage, language);
        console.log('fix took', performance.now() - start, 'ms');
      }
    });
  }
}

export function fixLanguage(baseLang: Lang, lang: Lang) {
  if (baseLang != null) {
    console.log('fixing language', lang.name, '(base: ' + baseLang.name + ')');
    fixKOP(baseLang.kop, lang.kop);
    countErrors(lang);
  } else {
    console.log('skipping, no base language');
  }
}

export function createKopFromLanguage(baseLanguage?: Lang) {
  let kop: LangKOP;
  if (baseLanguage) {
    kop = createEmptyKopFromKop(baseLanguage.kop);
  } else {
    kop = {
      key: 'root',
      KOPs: [],
      KVPs: [],
      missingKVPs: [],
    };
  }
  return kop;
}

export function createEmptyKopFromKop(kop: LangKOP) {
  const copy: LangKOP = {
    key: kop.key,
    KVPs: [],
    KOPs: [],
    missingKVPs: [],
  };
  kop.KVPs.forEach(kvp => {
    copy.missingKVPs.push({ key: kvp.key, value: kvp.value });
  });
  kop.KOPs.forEach(_kop => {
    copy.KOPs.push(createEmptyKopFromKop(_kop));
  });
  sortKopArrays(copy);
  return copy;
}

export function sortKopArrays(kop: LangKOP) {
  kop.KOPs.sort(function (a: LangKOP, b: LangKOP) {
    const textA = a.key.toUpperCase();
    const textB = b.key.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  kop.KVPs.sort(function (a: LangKVP, b: LangKVP) {
    const textA = a.key.toUpperCase();
    const textB = b.key.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  kop.missingKVPs.sort(function (a: LangKVP, b: LangKVP) {
    const textA = a.key.toUpperCase();
    const textB = b.key.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
}

export function kopToObject(kop: LangKOP) {
  const obj = {};
  kop.KVPs.forEach(kvp => {
    obj[kvp.key] = kvp.value;
  });
  kop.KOPs.forEach(child => {
    obj[child.key] = kopToObject(child);
  });
  return obj;
}

export function createKopFromObject(obj: any, key: string = 'root'): LangKOP {
  const kop: LangKOP = {
    key: key,
    KVPs: [],
    KOPs: [],
    missingKVPs: [],
  };
  Object.keys(obj).forEach(_key => {
    if (isString(obj[_key])) {
      const kvp: LangKVP = {
        key: _key,
        value: obj[_key],
      };
      kop.KVPs.push(kvp);
    } else if (isObject(obj[_key])) {
      const new_kop = createKopFromObject(obj[_key], _key);
      kop.KOPs.push(new_kop);
    }
  });
  sortKopArrays(kop);
  return kop;
}

function fixKOP(baseKop: LangKOP, kopToFix: LangKOP) {
  // console.log('fixing kop', Object.assign({}, kopToFix), 'with base', Object.assign({}, kopToFix));
  if (baseKop === kopToFix) {
    cleanBaseKop(baseKop);
    sortKopArrays(baseKop);
    return;
  }
  // console.log('removing missing KVPS')
  kopToFix.missingKVPs = [];
  trimKop(baseKop, kopToFix);
  // console.log('kvps to fix', kopToFix.KVPs.length);
  baseKop.KVPs.forEach(kvp => {
    let foundKey = false;
    for (let i = 0; i < kopToFix.KVPs.length; i++) {
      if (kopToFix.KVPs[i].key === kvp.key) {
        foundKey = true;
        // console.log('found key', kvp.key);
        break;
      }
    }
    if (!foundKey) {
      // console.log('missing key', kvp.key);
      const missingKvp: LangKVP = { key: kvp.key, value: kvp.value };
      if (kvp.context != null) {
        missingKvp.context = kvp.context;
      }
      kopToFix.missingKVPs.push(missingKvp);
    }
  });
  baseKop.KOPs.forEach(baseKop_child => {
    let foundKop = false;
    for (let i = 0; i < kopToFix.KOPs.length; i++) {
      if (baseKop_child.key === kopToFix.KOPs[i].key) {
        foundKop = true;
        fixKOP(baseKop_child, kopToFix.KOPs[i]);
        break;
      }
    }
    if (!foundKop) {
      // console.log('kop not found, will create', baseKop_child.key)
      const newKop = {
        key: baseKop_child.key,
        KOPs: [],
        KVPs: [],
        missingKVPs: [],
      };
      kopToFix.KOPs.push(newKop);
      fixKOP(baseKop_child, newKop);
    }
  });
  sortKopArrays(kopToFix);
}

/**Remove unused KVPs and KOPs */
function trimKop(baseKop: LangKOP, kopToTrim: LangKOP) {
  // console.log('triming kops', Object.assign({}, kopToTrim), '| base:', Object.assign({}, baseKop));
  // console.log(kopToTrim.KVPs.slice());
  const KVPs_toDrop: LangKVP[] = [];
  for (let i = 0; i < kopToTrim.KVPs.length; i++) {
    const child_kvp = kopToTrim.KVPs[i];
    // console.log('searching for', child_kvp.key, 'in', baseKop.key)
    let found = false;
    for (const child_kvp_base of baseKop.KVPs) {
      if (child_kvp.key === child_kvp_base.key) {
        // console.log('found', child_kvp.key);
        found = true;
        break;
      }
    }
    if (!found) { // if kvp is not in base_kvps
      // console.log('not found in base, dropping', child_kvp.key);
      KVPs_toDrop.push(child_kvp);
    }
  }
  for (const kvp of KVPs_toDrop) {
    kopToTrim.KVPs.splice(kopToTrim.KVPs.indexOf(kvp), 1);
  }

  const KOPs_toDrop: LangKOP[] = [];
  for (let j = 0; j < kopToTrim.KOPs.length; j++) {
    const child_kop = kopToTrim.KOPs[j];
    let found = false;
    for (const child_kop_base of baseKop.KOPs) {
      if (child_kop.key === child_kop_base.key) {
        found = true;
        trimKop(child_kop_base, child_kop);
        break;
      }
    }
    if (!found) { // if kop is not in base_kops
      KOPs_toDrop.push(child_kop);
    }
  }
  for (const kop of KOPs_toDrop) {
    kopToTrim.KOPs.splice(kopToTrim.KOPs.indexOf(kop), 1);
  }
}


function cleanBaseKop(kop: LangKOP) {
  // console.log('cleaning kop fallback')
  kop.missingKVPs = [];
  kop.KOPs.forEach(_kop => cleanBaseKop(_kop));
}

function countErrors(lang: Lang) {
  lang.errorCount = countErrorsInKop(lang.kop);
}

function countErrorsInKop(kop: LangKOP): number {
  let errorCount = 0;
  errorCount += kop.missingKVPs.length;
  for (let i = 0; i < kop.KOPs.length; i++) {
    const child = kop.KOPs[i];
    errorCount += countErrorsInKop(child);
  }
  return errorCount;
}
