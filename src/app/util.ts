export function isString(obj: any) {
  if (typeof obj === 'string') return true;
  return false;
}
export function isNumber(obj: any) {
  if (typeof obj === 'number') return true;
  return false;
}
export function isBoolean(obj: any) {
  if (typeof obj === 'boolean') return true;
  return false;
}
export function isArray(obj: any) {
  if (Array.isArray(obj)) return true;
  return false;
}
export function isObject(obj: any) {
  if (typeof obj === 'object') return true;
  return false;
}
export function isNullOrUndefined(obj: any) {
  if (obj === undefined || obj === null) return true;
  return false;
}