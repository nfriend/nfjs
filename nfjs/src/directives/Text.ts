/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Text extends DirectiveBase {
        public static directiveName = 'nf-text';

        initialize(element: HTMLElement, value: any) { }

        update(element: HTMLElement, value: any) {
            element.innerHTML = value;
        }
    }
}