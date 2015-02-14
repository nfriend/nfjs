﻿module NFJS {
    // don't use strict mode here, because our temporary expression evaluator relies on the "with" keyword
    // 'use strict';

    export class Parser {

        public static parseElementAndChildren(viewModel: ViewModel, rootElement: Element) {

            var shouldProcessChildBindings = true;
            for (var i = 0; i < NFJS.Directives.allDirectives.length; i++) {
                var currentDirective = NFJS.Directives.allDirectives[i];
                if (rootElement.hasAttribute && rootElement.hasAttribute(currentDirective.name)) {

                    var $rootElement = $(rootElement),
                        initialize = false,
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
                $(rootElement).children().each((i, elem) => {
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
            eval(
                "with (viewModel) { \
                    computedExpression = eval('(function() { return ' + directiveExpression + '; })()'); \
                }"
                );

            delete viewModel['$data'];

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