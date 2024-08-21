// ./node_modules/.bin/tsup css.ts --dts --format esm,cjs,iife --minify
// gzip -c dist/css.js | wc -c
// => 992

interface IConfiguration {
  append: "each" | "batch"
  mode: "style" | "sheet" | "auto"
  debug: boolean
  verbose: boolean
  target: Element
  regExp: RegExp
  hashIds: boolean
  prefix: string
}

let _prevUid = 0
let _pendingStyles: string | null = null
let _config: IConfiguration = {
  debug: false,
  verbose: false,
  append: "batch",
  target: document.head,
  regExp: /&&/g,
  hashIds: false,
  prefix: "css",
  mode: "auto",
}
// const MINI_EPOCH = 1690866000000
const MINI_EPOCH = ((now = new Date()) => {
  return new Date(now.getFullYear(), now.getMonth()).getTime()
})()
export const SUPPORTS_CONSTRUCTABLE_STYLESHEETS = (() => {
  try {
    var sheet = new CSSStyleSheet()
    return "adoptedStyleSheets" in document && "replace" in sheet
  } catch (err) {
    return false
  }
})()

/**
 * Configures the css function. Useful if you want a different "this" character
 * (defaults to &) or if you want to enable debug mode or caclulate hashes for
 * class names instead of using date based ids.
 */
export function configure(options: Partial<IConfiguration>) {
  _config = Object.assign({}, _config, options)
}

/**
 * Tagged template literal that accepts css and inserts it into the DOM,
 * returning a generated class name.
 */
export function cssRules(
  template: TemplateStringsArray,
  ...params: any[]
): string {
  let styles = ""

  for (let i = 0; i < params.length; i++) {
    styles += String(template[i])
    styles += String(params[i])
  }

  if (template.length > params.length) {
    styles += template[template.length - 1]
  }

  const clsName = _createClassName(styles)
  styles = _substituteClassname(styles, `.${clsName}`)

  if (_config.verbose) console.trace(_config.append, styles)
  if (_config.debug) assertValidCSS(styles)

  _appendStyles(styles)

  return clsName
}

/**
 * Assembles a class name from the given parameters. Strings are added as-is,
 * object keys are added if their values are truthy. Null and undefined
 * values are ignored.
 */
export function classNames(
  ...extra: (string | Partial<Record<string, any>> | undefined | null)[]
) {
  let className = ""
  for (let i = 0; i < extra.length; i++) {
    const item = extra[i]
    if (!item) continue
    else if (typeof item === "string") {
      className += item + " "
    } else {
      const keys = Object.keys(item)
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j]!
        if (item[key]) {
          className += key + " "
        }
      }
    }
  }
  return className.trim()
}

type classNameTypes = string | Partial<Record<string, any>> | undefined | null

/** @deprecated FOR INTERNAL USE ONLY */
export function classBuilder<T extends string>(id: string) {
  function apply(...extra: classNameTypes[]) {
    return _substituteClassname(classNames(id, ...extra), id)
  }
  apply.valueOf = () => id as T
  apply.toString = () => id
  apply.$ = apply.inner = (...extra: classNameTypes[]) =>
    _substituteClassname(classNames(...extra), id)
  return apply
}

/**
 * Tagged template literal function that returns a function that can be used
 * to assembly class names prefixed with the generated one from the css template.
 */
export function css(
  template: TemplateStringsArray,
  ...params: any[]
): ReturnType<typeof classBuilder> {
  return classBuilder(cssRules(template, ...params))
}
css.config = configure
export default css

export function uid(radix: number = 36): string {
  let now = Date.now() - MINI_EPOCH
  if (now <= _prevUid) now = _prevUid + 1
  _prevUid = now
  return _prevUid.toString(radix)
}

/**
 * A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
 */
export function crcHash(text: string): number {
  "use strict"
  var hash = 5381
  var index = text.length

  while (index) {
    hash = (hash * 33) ^ text.charCodeAt(--index)
  }

  return hash >>> 0
}

function _substituteClassname(source: string, className: string): string {
  return source.replace(_config.regExp, className)
}

function _appendStyles(
  styles: string,
  createElem: () => HTMLStyleElement = () => document.createElement("style")
) {
  if (_config.append == "each") {
    _createAndAppendStyleElement(styles, createElem)
  } else {
    if (_pendingStyles === null) {
      _pendingStyles = styles
      setTimeout(() => {
        _createAndAppendStyleElement(_pendingStyles!, createElem)
        _pendingStyles = null
      }, 0)
    } else {
      _pendingStyles = _pendingStyles + `\n` + styles
    }
  }
}

function _createClassName(styles: string) {
  const blockId = _config.hashIds ? crcHash(styles).toString(36) : uid()
  return `${_config.prefix}_${blockId}`
}

/**
 * Creates a style element and appends it to the target element. Depending on
 * the configuration, it will either be a regular style element or a
 * constructable stylesheet. if the mode is set to "auto", it will use
 * constructable stylesheets if the browser supports it and debug mode is off.
 * It logs the styles to the console if verbose mode is on.
 */
function _createAndAppendStyleElement(
  styles: string,
  createElem: () => HTMLStyleElement
) {
  if (_config.mode === "auto") {
    if (SUPPORTS_CONSTRUCTABLE_STYLESHEETS && !_config.debug) {
      _createModeSheet(styles)
    } else {
      _createModeStyle(styles, createElem)
    }
  } else if (_config.mode === "style") {
    _createModeStyle(styles, createElem)
  } else if (_config.mode === "sheet") {
    if (!SUPPORTS_CONSTRUCTABLE_STYLESHEETS || _config.debug) {
      _createModeStyle(styles, createElem)
    } else {
      _createModeSheet(styles)
    }
  } else {
    throw new Error(`Invalid mode: ${_config.mode}`)
  }

  if (_config.verbose) console.trace({ styles })
}

function _createModeStyle(styles: string, createElem: () => HTMLStyleElement) {
  const target = createElem()
  target.setAttribute("type", "text/css")
  // target.setAttribute("id", `css_${uid()}`)
  target.innerHTML = styles
  _config.target.appendChild(target)
}

function _createModeSheet(styles: string) {
  const stylesheet: any = new CSSStyleSheet()
  stylesheet.replace(styles)
  //@ts-ignore
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet]
}

function assertValidCSS(styles: string) {
  // Validate that the number of closing brackets matches the number of opening brackets
  let openBrackets = 0
  let closeBrackets = 0
  for (let i = 0; i < styles.length; i++) {
    if (styles[i] === "{") openBrackets++
    else if (styles[i] === "}") closeBrackets++
  }
  if (openBrackets !== closeBrackets) {
    throw new Error("Invalid CSS: Bracket mismatch.")
  }
}
