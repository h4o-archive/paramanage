import lodash, { LoDashStatic } from "lodash"
import * as Types from "./Types"

function insertItem<T>(array: T[], index: number, item: T): T[] {
  return [
    ...array.slice(0, index),
    item,
    ...array.slice(index)
  ]
}

function removeItem<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

function compareObjectDescendinBaseOnKey<T, K extends keyof T>(key: K): ((a: T, b: T) => number) {
  return (a: T, b: T): number => {
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  }
}

function compareObjectAscendinBaseOnKey<T, K extends keyof T>(key: K): ((a: T, b: T) => number) {
  return (a: T, b: T): number => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  }
}

const memoize = ((func: Types.Function, resolver: (...args: any[]) => string): Types.Function => {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError('Expected a function')
  }
  const memoized = function (this: any, ...args: any[]): any {
    const key = resolver ? resolver.apply(this, args) : args[0]
    const cache = memoized.cache

    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func.apply(this, args)
    memoized.cache = cache.set(key, result) || cache
    return result
  }
  memoized.clearCache = () => {
    // @ts-ignore
    memoized.cache.clear()
  }
  memoized.cache = new (memoize.Cache || Map)()
  return memoized
}) as LoDashStatic["memoize"]

function hashText(text: string): string {
  let hash = 0, chr: number;
  if (text.length === 0) return `${hash}`;
  for (let i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return `${hash}`;
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type RGB = Readonly<{ r: number, g: number, b: number }>

function __hexToRgb__(hex: string): RGB {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m: string, r: string, g: string, b: string): string {
    return r + r + g + g + b + b;
  });

  const result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
      r: 0,
      g: 0,
      b: 0
    };
}

function contrastColorFontAndBackground(hex: string): { background: string, color: string } {
  if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex)) {
    const rgb: RGB = __hexToRgb__(hex)

    // Counting the perceptive luminance - human eye favors green color... 
    const luminance: number = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.5)
      return { background: hex, color: "black" } // bright colors - black font
    else
      return { background: hex, color: "white" } // dark colors - white font
  }
  return { background: hex, color: "black" }
}

function map<O, T>(object: O, func: (item: O[keyof O]) => T): T[] {
  let array = []
  for (let key in object) {
    array.push(func(object[key]))
  }
  return array
}

// Only use for array or object
function reduce<O, T>(object: O, func: (o: T, key: keyof O) => void, init: T): T {
  for (let key in object) {
    func(init, key)
  }
  return init
}

function omit<T, K extends keyof T>(object: T, keys: K[]) {
  return reduce(object, (new_object, key) => {
    if (!keys.includes(key as K)) (new_object as Types.OverloadObject)[key as string] = object[key]
  }, {} as Pick<T, Exclude<keyof T, K>>)
}

function createDependencyInjector<T>() {
  let __dependency__ = {
    data: {} as T,
    declare: (data: T) => { __dependency__ = { ...__dependency__, data: { ...__dependency__.data, ...data } } },
    inject: () => __dependency__.data
  }
  return __dependency__ as Readonly<typeof __dependency__>
}

let createUniqueID = Object.assign(
  () => {
    createUniqueID.unique_id++
    return createUniqueID.unique_id
  },
  { unique_id: 0 }
)

declare module "lodash" {
  interface LoDashStatic {
    insertItem: typeof insertItem,
    removeItem: typeof removeItem,
    compareObjectDescendinBaseOnKey: typeof compareObjectDescendinBaseOnKey,
    compareObjectAscendinBaseOnKey: typeof compareObjectAscendinBaseOnKey,
    hashText: typeof hashText,
    sleep: typeof sleep,
    contrastColorFontAndBackground: typeof contrastColorFontAndBackground,
    createDependencyInjector: typeof createDependencyInjector
    createUniqueID: typeof createUniqueID
  }

}

interface LoDashOverload extends Pick<LoDashStatic, Exclude<keyof LoDashStatic, "map" | "reduce" | "omit">> {
  map: typeof map,
  reduce: typeof reduce
  omit: typeof omit
}

let _: LoDashOverload = lodash
_.insertItem = insertItem;
_.removeItem = removeItem;
_.compareObjectDescendinBaseOnKey = compareObjectDescendinBaseOnKey;
_.compareObjectAscendinBaseOnKey = compareObjectAscendinBaseOnKey;
_.memoize = memoize;
_.hashText = _.memoize(hashText);
_.sleep = sleep;
_.contrastColorFontAndBackground = contrastColorFontAndBackground
_.map = map
_.reduce = reduce
_.omit = omit
_.values = Object.values
_.createDependencyInjector = createDependencyInjector
_.createUniqueID = createUniqueID

const ___: Readonly<LoDashOverload> = _
export { ___ as _ }