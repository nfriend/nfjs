/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Style extends DirectiveBase {
        public static name = 'nf-style';
        private lastStyleValue = {};

        update(element: HTMLElement, value: any, viewModel: ViewModel) {
            var $element = $(element);
            $element.css(value);

            var styleEraser = {};
            for (var cssRule in this.lastStyleValue) {
                if (!(cssRule in value)) {
                    styleEraser[cssRule] = '';
                }
            }
            $element.css(styleEraser);

            this.lastStyleValue = value;
        }
    }
} 