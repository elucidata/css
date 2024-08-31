interface IConfiguration {
    append: "each" | "batch";
    mode: "style" | "sheet" | "auto";
    debug: boolean;
    verbose: boolean;
    target: Element;
    regExp: RegExp;
    hashIds: boolean;
    prefix: string;
}
declare const SUPPORTS_CONSTRUCTABLE_STYLESHEETS: boolean;
/**
 * Configures the css function. Useful if you want a different "this" character
 * (defaults to &) or if you want to enable debug mode or caclulate hashes for
 * class names instead of using date based ids.
 */
declare function configure(options: Partial<IConfiguration>): void;
/**
 * Tagged template literal that accepts css and inserts it into the DOM,
 * returning a generated class name.
 */
declare function cssRules(template: TemplateStringsArray, ...params: any[]): string;
/**
 * Assembles a class name from the given parameters. Strings are added as-is,
 * object keys are added if their values are truthy. Null and undefined
 * values are ignored.
 */
declare function classNames(...extra: (string | Partial<Record<string, any>> | undefined | null)[]): string;
type classNameTypes = string | Partial<Record<string, any>> | undefined | null;
/** @deprecated FOR INTERNAL USE ONLY */
declare function classBuilder<T extends string>(id: string): {
    (...extra: classNameTypes[]): string;
    valueOf(): T;
    toString(): string;
    $: (...extra: classNameTypes[]) => string;
    inner(...extra: classNameTypes[]): string;
};
/**
 * Tagged template literal function that returns a function that can be used
 * to assembly class names prefixed with the generated one from the css template.
 */
declare function css(template: TemplateStringsArray, ...params: any[]): ReturnType<typeof classBuilder>;
declare namespace css {
    var config: typeof configure;
}

declare function uid(radix?: number): string;
/**
 * A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
 */
declare function crcHash(text: string): number;

export { SUPPORTS_CONSTRUCTABLE_STYLESHEETS, classBuilder, classNames, configure, crcHash, css, cssRules, css as default, uid };
