# CSS

Co-locate your CSS with your components. For use in React/Preact/Vanilla... Probably SolidJS too.

```tsx
import { css } from "css"

const Button = (props) => (
  <button className={Button.styles("Button")}>{props.children}</button>
)

Button.styles = css`
  && {
    background: dodgerblue;
    color: white;
  }
`
```

The configurable token `&&` will be replaced with a unique name based on the hash of the entire string.

Also supports creating inline components.

```tsx
import { comp } from "css/react"

const Card = comp("div.Card").css`
  border: 1px solid silver;

  header {
    color: dodgerblue;
    padding: 1rem;
  }
  section {
    padding: 1rem;
  }
  footer {
    color: dimgray;
    padding: 1rem;
  }
`
```

Styles using the syntax are scoped to the component.

```tsx
import { configure } from "css"

configure({
  // defaults:
  debug: false,
  verbose: false,
  append: "batch",
  target: document.head,
  regExp: /&&/g,
  hashIds: false,
  prefix: "css",
  mode: "auto",
})
```

Configuration options:

```ts
interface IConfiguration {
  append: "each" | "batch" // style creation
  mode: "style" | "sheet" | "auto" // whether constructable stylesheets are used
  debug: boolean
  verbose: boolean
  target: Element
  regExp: RegExp
  hashIds: boolean
  prefix: string
}
```
