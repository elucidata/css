import { classBuilder } from '../index.js';
export { SUPPORTS_CONSTRUCTABLE_STYLESHEETS, classNames, configure, crcHash, default as css, cssRules, uid } from '../index.js';

interface ICssComponent<T extends keyof JSX.IntrinsicElements, F = any> {
    (props: JSX.IntrinsicElements[T] & {
        cssFlags?: Partial<F> & {
            [flag: string]: any;
        };
    }): JSX.Element;
    classNames: ReturnType<typeof classBuilder>;
}
declare function component(styles: string): ICssComponent<"div">;
declare function component<T extends keyof JSX.IntrinsicElements, F = {}>(tag: T | string | ICssComponent<any>, styles: string): ICssComponent<T, F>;
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
declare function comp<F = any>(tag?: string | ICssComponent<any> | keyof JSX.IntrinsicElements): {
    css<T extends keyof JSX.IntrinsicElements>(cssString: TemplateStringsArray, ...params: any[]): ICssComponent<T, F>;
};

export { type ICssComponent, classBuilder, comp, component };
