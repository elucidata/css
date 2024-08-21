import { describe, expect, it, beforeEach } from "bun:test"
import { css, classNames, cssRules, configure } from "./index"

beforeEach(() => {
  document.head.innerHTML = ""
  document.body.innerHTML = ""
  configure({
    target: document.head,
    append: "each",
    mode: "style",
  })
})

describe("cssRules", () => {
  it("should insert CSS into the DOM and return a generated class name", () => {
    const template = [
      "&& { background-color: ",
      "; color: ",
      "; }",
    ] as unknown as TemplateStringsArray
    const params = ["red", "white"]

    const className = cssRules(template, ...params)

    // Assert that the generated class name is returned
    expect(className).toMatch(/^css_\w+$/)

    // Assert that the CSS has been inserted into the DOM
    const styleElements = document.querySelectorAll("style")
    expect(styleElements.length).toBe(1)
  })

  it("should handle template strings with no params", () => {
    const template = [
      "&& { background-color: red; }",
    ] as unknown as TemplateStringsArray

    const className = cssRules(template)

    // Assert that the CSS has been inserted into the DOM
    const styleElements = document.querySelectorAll("style")
    expect(styleElements.length).toBe(1)

    // Assert that the generated class name is returned
    expect(className).toMatch(/^css_\w+$/)
  })
})

describe("classNames", () => {
  it("should concatenate multiple strings", () => {
    const result = classNames("foo", "bar", "baz")
    expect(result).toBe("foo bar baz")
  })

  it("should include object keys with truthy values", () => {
    const result = classNames("foo", { bar: true, baz: false, qux: true })
    expect(result).toBe("foo bar qux")
  })

  it("should ignore null and undefined values", () => {
    const result = classNames("foo", null, undefined, "bar")
    expect(result).toBe("foo bar")
  })

  it("should return an empty string if no arguments are provided", () => {
    const result = classNames()
    expect(result).toBe("")
  })
})

describe("css", () => {
  it("should insert CSS into the DOM and return a function that returns the className", () => {
    const template = [
      "&& { background-color: ",
      "; color: ",
      "; }",
    ] as unknown as TemplateStringsArray
    const params = ["red", "white"]

    const classNames = css(template, ...params)
    expect(classNames).toBeFunction()

    // Assert that the generated class name is returned
    let className = classNames()
    expect(className).toMatch(/^css_\w+$/)

    // Assert that the CSS has been inserted into the DOM
    const styleElements = document.querySelectorAll("style")
    expect(styleElements.length).toBe(1)

    expect(classNames("Test")).toMatch(/^css_\w+ Test$/)
    expect(classNames("Test", { isSelected: true, isReadonly: false })).toMatch(
      /^css_\w+ Test isSelected$/
    )
    // .$() is a shorthand for classNames() without prefixing the generated class name.
    expect(
      classNames.$("Test", { isSelected: false }, { isReadonly: true })
    ).toMatch(/^Test isReadonly$/)
  })

  it("should handle template strings with no params", () => {
    const template = [
      "&& { background-color: red; }",
    ] as unknown as TemplateStringsArray

    const classNames = css(template)
    expect(classNames).toBeFunction()

    // Assert that the generated class name is returned
    let className = classNames()
    expect(className).toMatch(/^css_\w+$/)

    expect(classNames("Test")).toMatch(/^css_\w+ Test$/)

    // Assert that the CSS has been inserted into the DOM
    const styleElements = document.querySelectorAll("style")
    expect(styleElements.length).toBe(1)
  })
})
