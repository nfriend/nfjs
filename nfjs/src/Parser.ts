module NFJS {
    // don't use strict mode here, because our temporary expression evaluator relies on the "with" keyword
    // 'use strict';

    export class Parser {

        public static parse(viewModel: any, rootElement: Element) {
            for (var directiveName in NF.Directives) {
                if (NF.Directives.hasOwnProperty(directiveName)) {
                    if (rootElement.hasAttribute(directiveName)) {

                        var directiveExpression = rootElement.getAttribute(directiveName),
                            computedExpression;
                        
                        // TypeScript doesn't allow "with"... or does it.  
                        // TODO: make a proper expression evaluater. This makes me die a little bit inside.
                        eval(
                            "with (viewModel._data) { \
                                computedExpression = eval('(function() { return ' + directiveExpression + '; })()'); \
                            }"
                            );

                        NF.Directives[directiveName].initialize(rootElement, computedExpression);
                    }
                }
            }

            $(rootElement).children().each((i, elem) => {
                this.parse(viewModel, elem);
            });
        }
    }
} 