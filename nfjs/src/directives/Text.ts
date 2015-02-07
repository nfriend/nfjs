/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Text extends DirectiveBase {
        initialize(element: HTMLElement, value: any) {
            element.innerHTML = value;
        }
        update(element: HTMLElement, value: any) { }
    }
}