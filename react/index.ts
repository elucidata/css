export * from "../index"

import { createElement } from "react"
import { classBuilder, cssRules, classNames as clsNames } from "../index"

export interface ICssComponent<T extends keyof JSX.IntrinsicElements, F = any> {
  (
    props: JSX.IntrinsicElements[T] & {
      cssFlags?: Partial<F> & { [flag: string]: any } //Record<keyof F | keyof P, any>
    }
  ): JSX.Element
  classNames: ReturnType<typeof classBuilder>
}

export function component(styles: string): ICssComponent<"div">
export function component<T extends keyof JSX.IntrinsicElements, F = {}>(
  tag: T | string | ICssComponent<any>,
  styles: string
): ICssComponent<T, F>
export function component<T extends keyof JSX.IntrinsicElements, F = {}>(
  tag?: string | T | ICssComponent<T, F>,
  styles?: string
): ICssComponent<T, F> {
  let extraClassNames = ""

  if (!styles) {
    if (typeof tag !== "string") throw new Error("No styles provided")
    styles = tag
    tag = "div"
  }
  if (typeof tag === "string" && tag.includes(".")) {
    const parts = tag.split(".")
    tag = parts.shift()
    extraClassNames = parts.join(" ")
  }

  function CssComponent(props: any) {
    const { className, children, cssFlags, ...rest } = props
    const combinedClassName = `${styles} ${
      className || ""
    } ${extraClassNames} ${!!cssFlags ? clsNames(cssFlags) : ""}`.trim()

    return createElement(
      tag!,
      {
        ...rest,
        className: combinedClassName,
      },
      children
    )
  }
  CssComponent.classNames = classBuilder(styles)

  return CssComponent as ICssComponent<T, F>
}

/**
 * Experimental alternate syntax for defining inline components.
 *
 * @usage
 * ```tsx
 *    const Label = comp("div.Label").css`
 *      font-family: system-ui; color: dimgrey;
 *    `;
 *
 *    const WarningLabel = comp(Label).css`
 *      color: red;
 *    `;
 * ```
 *
 * Type CSS flags for merging with props:
 * ```tsx
 *   const Btn = comp<{ isOutline: boolean }>("button").css`
 *     color: white;
 *     background: dodgerblue;
 *     border: 1px solid;
 *
 *     &.isOutline {
 *       background: transparent;
 *       border: 2px solid dodgerblue;
 *     }
 *  `
 *  const GlassBtn = comp<{ isFrosted: boolean }>(Btn).css`
 *    background: transparent;
 *
 *    &.isFrosted {
 *     backdrop-filter: blur(5px);
 *   }
 * `
 * ```
 */
export function comp<F = any>(
  tag: string | ICssComponent<any> | keyof JSX.IntrinsicElements = "div"
) {
  return {
    css<T extends keyof JSX.IntrinsicElements>(
      cssString: TemplateStringsArray,
      ...params: any[]
    ): ICssComponent<T, F> {
      /// wrap incoming css string with `&& {}`
      let css = Array.from(cssString)
      if (css.length && !css[0]!.trim().startsWith("&&")) {
        css[0] = `&& { ${css[0]}`
        css[css.length - 1] = `${css[css.length - 1]} }`
      }
      return component<T, F>(tag, cssRules(css as any, ...params))
    },
  }
}
