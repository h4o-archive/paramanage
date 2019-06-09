import lodash, { LoDashStatic } from "lodash"

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

interface ComparableObject<T> {
  readonly [key: string]: T
}

function compareObjectDescendinBaseOnKey<T>(key: string): (a: ComparableObject<T>, b: ComparableObject<T>) => number {
  return (a: ComparableObject<T>, b: ComparableObject<T>): number => {
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  }
}

function compareObjectAscendinBaseOnKey<T>(key: string): (a: ComparableObject<T>, b: ComparableObject<T>) => number {
  return (a: ComparableObject<T>, b: ComparableObject<T>): number => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  }
}

let memoize = ((func: _.type.func, resolver: (...args: any[]) => string): _.type.func => {
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

type RGB = { readonly r: number, readonly g: number, readonly b: number }

function __hexToRgb__(hex: string): RGB {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m: string, r: string, g: string, b: string): string {
    return r + r + g + g + b + b;
  });

  let result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
    let rgb: RGB = __hexToRgb__(hex)

    // Counting the perceptive luminance - human eye favors green color... 
    let luminance: number = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.5)
      return { background: hex, color: "black" } // bright colors - black font
    else
      return { background: hex, color: "white" } // dark colors - white font
  }
  return { background: hex, color: "black" }
}

function map(object: _.type.readonlyObject, func: _.type.func): any[] {
  let array = []
  for (let key in object) {
    array.push(func(object[key]))
  }
  return array
}

function reduce(object: _.type.readonlyObject, func: (o: _.type.Object, key: string) => void, init: _.type.Object): _.type.Object {
  for (let key in object) {
    func(init, key)
  }
  return init
}

function omit(object: _.type.readonlyObject, keys: string[]): _.type.Object {
  return reduce(object, (new_object, key) => {
    if (!keys.includes(key)) new_object[key] = object[key]
  }, {})
}

declare module "lodash" {
  interface LoDashStatic {
    insertItem: typeof insertItem,
    removeItem: typeof removeItem,
    compareObjectDescendinBaseOnKey: typeof compareObjectDescendinBaseOnKey,
    compareObjectAscendinBaseOnKey: typeof compareObjectAscendinBaseOnKey,
    hashText: typeof hashText,
    sleep: typeof sleep,
    contrastColorFontAndBackground: typeof contrastColorFontAndBackground,
  }

  namespace type {
    type func = {
      (...args: any[]): any
    }
    type Object = {
      [key: string]: any
    }
    type readonlyObject = {
      readonly [key: string]: any
    }
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

export { _ }

// TODO continue recheck readonly