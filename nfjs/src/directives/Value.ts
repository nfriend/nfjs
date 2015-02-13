/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Value extends DirectiveBase {
        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            $element.val(value);
            var template = $element.on('keypress',(e) => {
                // not working yet
                value = $element.val();
            });
        }
        update(element: HTMLElement, value: any) {
            var $element = $(element);
            $element.val(value);
        }
    }
} 