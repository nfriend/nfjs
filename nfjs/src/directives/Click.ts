﻿module NFJS.Directives {
    export class Click implements Directive {
        name = 'nf-click';

        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            var template = $element.click((e) => {
                value($element, e);
            });
        }
        update(element: HTMLElement, value: any) { }
    }
} 