/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class ForEach extends DirectiveBase {
        public static name = 'nf-foreach';

        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            var template = $element.html();
            $element.html('');

            for (var i = 0; i < value.length; i++) {
                var templatedElements = $(template);
                $element.append(templatedElements);
                templatedElements.each((index, innerElement) => {
                    if (typeof value[i] === 'object') {
                        var viewModel: any = value[i];
                    } else {
                        var viewModel: any = {};
                    }

                    // add properties to this child's binding context
                    viewModel['$data'] = value[i];
                    viewModel['$index'] = i;
                    viewModel['$prev'] = value[i - 1];
                    viewModel['$next'] = value[i + 1];
                    viewModel['$isFirst'] = i === 0;
                    viewModel['$isLast'] = i === value.length - 1;
                    viewModel['$parent'] = value;

                    Parser.parseElementAndChildren(viewModel, innerElement);

                    // delete these binding-only properties from our ViewModel
                    delete viewModel['$data'];
                    delete viewModel['$index'];
                    delete viewModel['$prev'];
                    delete viewModel['$next'];
                    delete viewModel['$isFirst'];
                    delete viewModel['$isLast'];
                    delete viewModel['$parent'];
                });
            }
        }
        update(element: HTMLElement, value: any) { }
        controlsDescendantBindings = true;
    }
} 