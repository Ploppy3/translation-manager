/**interface used to import/export translation projects */
export interface Project {
  /**used for compatibility purpose */
  version: number,
  /**the array of languages */
  languages: Lang[],
  /**the id of the base language from the languages array */
  baseLanguageId: number,
}

/**language */
export interface Lang {
  name: string,
  /**the name of file when exporting this language */
  fileName: string,
  kop: LangKOP,
  errorCount?: number,
}

/**key-object pair */
export interface LangKOP {
  key: string,
  KVPs: LangKVP[],
  /**array of  */
  KOPs: LangKOP[],
  /**the list of missing key-value pairs for this language */
  missingKVPs: LangKVP[],
  showMissingKVPs?: boolean,
  showKVPs?: boolean,
  showInputCreateChild?: boolean,
}

/**key-value pair */
export interface LangKVP {
  key: string,
  value: string,
}