module NFJS.Directives {
    export interface Directive {
        name: string;
        initialize?(element: Element, value: any);
        update?(element: Element, value: any);
    }
}