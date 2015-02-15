/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Class extends DirectiveBase {
        public static directiveName = 'nf-class';
        private lastStringValue;
        private lastArrayValue;


        update(element: HTMLElement, value: any, viewModel: ViewModel) {
            var $element = $(element);

            if (value.constructor === Array) {
                // TODO: apply all classes found in an array
                throw 'nf-class binding to an array not yet implemented';
            } else if (typeof value === 'object') {
                for (var cssClass in value) {
                    if (value.hasOwnProperty(cssClass)) {
                        if (value[cssClass]) {
                            $element.addClass(cssClass);
                        } else {
                            $element.removeClass(cssClass);
                        }
                    }
                }
            } else {
                if (value === this.lastStringValue) {
                    return;
                }

                if (this.lastStringValue) {
                    $element.removeClass(this.lastStringValue);
                }

                this.lastStringValue = value;
                $element.addClass(value);
            }
        }
    }
} 