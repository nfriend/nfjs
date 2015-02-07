/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Event extends DirectiveBase {
        initialize(element: HTMLElement, value: any) {

            if (!(value.event && value.handler)) {
                throw '"Event" binding must be given an object with both a "event" property and a "handler" property';
            }

            var $element = $(element);
            var template = $element.on(value.event, (e) => {
                value.handler($element, e);
            });
        }
        update(element: HTMLElement, value: any) { }
    }
} 