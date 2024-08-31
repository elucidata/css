import { classBuilder } from '../index.js';
export { SUPPORTS_CONSTRUCTABLE_STYLESHEETS, classNames, configure, crcHash, default as css, cssRules, uid } from '../index.js';
import { JSX, FunctionComponent, createElement } from 'preact';

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
 */
declare function comp(tag?: string | FunctionComponent<any> | keyof JSX.IntrinsicElements): {
    css(cssString: TemplateStringsArray, ...params: any[]): ICssComponent<keyof createElement.JSX.IntrinsicElements, {}>;
};

export { type ICssComponent, classBuilder, comp, component };
