module NFJS {
    // don't use strict mode here, because our temporary expression evaluator relies on the "with" keyword
    // 'use strict';

    export class Parser {

        public static parseElementAndChildren(viewModel: ViewModel, rootElement: Element) {
            for (var directiveName in NF.Directives) {
                if (NF.Directives.hasOwnProperty(directiveName)) {
                    if (rootElement.hasAttribute(directiveName)) {
                        Parser.parseDirectiveForElement(directiveName, rootElement, viewModel);
                    }
                }
            }

            $(rootElement).children().each((i, elem) => {
                this.parseElementAndChildren(viewModel, elem);
            });
        }

        public static parseDirectiveForElement(directiveName: string, element: Element, viewModel: ViewModel, update?: boolean) {
            var directiveExpression = element.getAttribute(directiveName),
                computedExpression;

            viewModel._observer.beginTrackingDependencies(element, directiveName);
                        
            // TypeScript doesn't allow "with"... or does it.  
            // TODO: make a proper expression evaluater. This makes me die a little bit inside.
            eval(
                "with (viewModel) { \
                    computedExpression = eval('(function() { return ' + directiveExpression + '; })()'); \
                }"
                );

            viewModel._observer.stopTrackingDependencies();

            if (!update) {
                NF.Directives[directiveName]._triggerInitialize(element, computedExpression, viewModel, directiveExpression);
            }
            NF.Directives[directiveName]._triggerUpdate(element, computedExpression, viewModel, directiveExpression);
        }
    }
} 