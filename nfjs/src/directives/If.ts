/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class If extends DirectiveBase {
        public static directiveName = 'nf-if';
        private template: string;

        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            this.template = $element.html();
            $element.html('');
        }
        update(element: HTMLElement, value: any, viewModel: ViewModel) {
            var $element = $(element);
            if (value) {
                $element.html(this.template);
                $element.children().each((index, innerElement) => {
                    Parser.parseElementAndChildren(viewModel, innerElement);
                });
            } else {
                $element.html('');
            }
        }
    }
} 