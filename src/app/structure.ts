export interface Lang {
  name: string,
  kop: LangKOP,
  errorCount?: number,
}

/**Key-Object-Pair */
export interface LangKOP {
  key: string,
  KVPs: LangKVP[],
  KOPs: LangKOP[],
  missingKVPs: LangKVP[],
  showMissingKVPs?: boolean,
  showKVPs?: boolean,
  showInputCreateChild?: boolean,
}

/**Key-Value-Pair */
export interface LangKVP {
  key: string,
  value: string,
}