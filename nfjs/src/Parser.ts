module NFJS {
    // don't use strict mode here, because our temporary expression evaluator relies on the "with" keyword
    // 'use strict';

    export class Parser {

        public static parseElementAndChildren(viewModel: ViewModel, rootElement: Element) {

            var shouldProcessChildBindings = true,
                $rootElement = $(rootElement);

            for (var i = 0; i < NFJS.Directives.allDirectives.length; i++) {
                var currentDirective = NFJS.Directives.allDirectives[i];
                if ($rootElement.is('[' + currentDirective.name + ']')) {

                    var initialize = false,
                        directiveInstance = <NFJS.Directives.DirectiveBase>($rootElement.data(currentDirective.name));

                    if (!directiveInstance) {
                        directiveInstance = new currentDirective();
                        $rootElement.data(currentDirective.name, directiveInstance);
                        initialize = true;
                    }

                    if (directiveInstance.controlsDescendantBindings) {
                        shouldProcessChildBindings = false;
                    }

                    Parser.parseDirectiveForElement(directiveInstance, rootElement, viewModel, initialize);
                }
            }

            if (shouldProcessChildBindings) {
                $rootElement.children().each((i, elem) => {
                    this.parseElementAndChildren(viewModel, elem);
                });
            }
        }

        public static parseDirectiveForElement(directive: NFJS.Directives.DirectiveBase, element: Element, viewModel: ViewModel, initialize?: boolean) {
            var directiveExpression = element.getAttribute((<any>directive.constructor).name),
                $element = $(element),
                computedExpression,
                directive: NFJS.Directives.DirectiveBase;

            if (typeof viewModel['$data'] === 'undefined') {
                viewModel['$data'] = viewModel;
            }

            if (viewModel._observer) {
                viewModel._observer.beginTrackingDependencies(element, directive);
            }
                        
            // TypeScript doesn't allow "with"... or does it.  
            // TODO: make a proper expression evaluater. This makes me die a little bit inside.
            try {
                eval(
                    "with (viewModel) { \
                        computedExpression = eval('(function() { return ' + directiveExpression + '; })()'); \
                    }"
                    );
            } catch (e) {
                var message = 'Unable to process binding "' + (<any>directive.constructor).name + '".The following expression could not be evaluated: ' + directiveExpression;
                if (NF.bindingFailureBehavior.toLowerCase() === 'throw') {
                    throw message;
                } else if (NF.bindingFailureBehavior.toLowerCase() === 'log') {
                    console.error(message, e);
                } else {
                    // do nothing; let the binding fail silently
                }
            }

            viewModel['$data'] = undefined;

            if (viewModel._observer) {
                viewModel._observer.stopTrackingDependencies();
            }

            if (initialize) {
                directive._triggerInitialize(element, computedExpression, viewModel, directiveExpression);
            }
            directive._triggerUpdate(element, computedExpression, viewModel, directiveExpression);
        }
    }
} 