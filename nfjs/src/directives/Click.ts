/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Click extends DirectiveBase {
        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            var template = $element.click((e) => {
                value($element, e);
            });
        }
        update(element: HTMLElement, value: any) { }
    }
} 