import { describe, it, expect } from "bun:test"
import { css, component } from "./index"

describe("css preact component", () => {
  const CompOne = component(
    css`
      && {
        color: red;
      }
    `()
  )
  // const CompTwo = component("main", css``())
  // const CompThree = component(
  //   ["selected", "disabled"],
  //   css`
  //     && {
  //       &.selected {
  //       }
  //     }
  //   `
  // )
  // Usage: <CompThree selected disabled={false}/>

  it("should create a div component by default", () => {
    expect(CompOne).toBeDefined()
    expect(CompOne).toBeFunction()
    expect(CompOne.classNames).toBeFunction()
    expect(CompOne.classNames()).toBeString()
  })
})
