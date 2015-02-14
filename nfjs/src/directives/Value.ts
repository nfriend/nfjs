/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Value extends DirectiveBase {
        public static name = 'nf-value';

        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            $element.val(value);
            var template = $element.on('input',(e) => {
                this.setValue($element.val());
            });
        }
        update(element: HTMLElement, value: any) {
            var $element = $(element);
            $element.val(value);
        }
    }
} 