/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Click extends DirectiveBase {
        public static directiveName = 'nf-click';

        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            var template = $element.click((e) => {
                if (typeof value === 'function') {
                    value($element, e);
                } else {
                    var handler = <(...any) => any>value.handler,
                        params = <any[]>value.params;

                    if (typeof handler === 'undefined' || typeof params === 'undefined') {
                        throw '';
                    }

                    var evalString = 'handler(';
                    for (var i = 0; i < params.length; i++) {
                        evalString += 'params[' + i + ']';
                        evalString += i === params.length - 1 ? ');' : ', ';
                    }

                    eval(evalString);
                }
            });
        }
        update(element: HTMLElement, value: any) { }
    }
} 