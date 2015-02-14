/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class ForEach extends DirectiveBase {
        public static name = 'nf-foreach';

        initialize(element: HTMLElement, value: any, viewModel: ViewModel) {
            var $element = $(element);
            var template = $element.html();
            $element.html('');

            for (var i = 0; i < value.length; i++) {
                var templatedElements = $(template);
                $element.append(templatedElements);
                templatedElements.each((index, innerElement) => {
                    if (typeof value[i] === 'object') {
                        var bindingContext: any = value[i];
                    } else {
                        var bindingContext: any = {};
                    }

                    // add properties to this child's binding context
                    bindingContext['$data'] = value[i];
                    bindingContext['$index'] = i;
                    bindingContext['$prev'] = value[i - 1];
                    bindingContext['$next'] = value[i + 1];
                    bindingContext['$isFirst'] = i === 0;
                    bindingContext['$isLast'] = i === value.length - 1;
                    bindingContext['$parent'] = viewModel;

                    Parser.parseElementAndChildren(bindingContext, innerElement);

                    // delete these binding-only properties from our ViewModel
                    bindingContext['$data'] = undefined;
                    bindingContext['$index'] = undefined;
                    bindingContext['$prev'] = undefined;
                    bindingContext['$next'] = undefined;
                    bindingContext['$isFirst'] = undefined;
                    bindingContext['$isLast'] = undefined;
                    bindingContext['$parent'] = undefined;
                });
            }
        }
        update(element: HTMLElement, value: any) { }
        controlsDescendantBindings = true;
    }
} 