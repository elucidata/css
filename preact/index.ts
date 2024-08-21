export * from "../index"

import { createElement, FunctionComponent, JSX } from "preact"
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
      //@ts-ignore
      tag!,
      {
        ...rest,
        className: combinedClassName,
      },
      children
    )
  }
  CssComponent.classNames = classBuilder(styles)

  return CssComponent // React memoizes this..
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
 */
export function comp(
  tag: string | FunctionComponent<any> | keyof JSX.IntrinsicElements = "div"
) {
  return {
    css(cssString: TemplateStringsArray, ...params: any[]) {
      /// wrap incoming css string with `&& {}`
      let css = Array.from(cssString)
      if (css.length && !css[0]!.trim().startsWith("&&")) {
        css[0] = `&& { ${css[0]}`
        css[css.length - 1] = `${css[css.length - 1]} }`
      }
      //@ts-ignore
      return component(tag, cssRules(css as any, ...params))
    },
  }
}
