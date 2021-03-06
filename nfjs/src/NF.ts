﻿/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

interface DirectiveReference {
    element: Element;
    directive: NFJS.Directives.DirectiveBase;
    directiveExpression: string;
}

class NF {

    private static baseViewModel;

    // how to respond when bindings fail.  possible values: 'throw', 'log', 'none'
    public static bindingFailureBehavior = 'throw';

    public static run(viewModel: any, rootElementId?: string): void {
        // TODO: handle no-conflict jQuery
        if (typeof $ === 'undefined') {
            throw 'jQuery not loaded! NF.js relies requires on jQuery to run.'
        }

        this.baseViewModel = viewModel;

        // add default bindings, if they haven't already been defined
        [
            NFJS.Directives.ForEach,
            NFJS.Directives.Text,
            NFJS.Directives.Click,
            NFJS.Directives.Event,
            NFJS.Directives.Value,
            NFJS.Directives.Template,
            NFJS.Directives.If,
            NFJS.Directives.Class,
            NFJS.Directives.Style,
        ].forEach((directive) => {
            var bindingAlreadyExists = false;
            for (var j = 0; j < NFJS.Directives.allDirectives.length; j++) {
                if (NFJS.Directives.allDirectives[j].directiveName === directive.directiveName) {
                    bindingAlreadyExists = true;
                }
            }

            if (!bindingAlreadyExists) {
                NF.addOrReplaceDirective(directive);
            }
        });

        // prepare the ViewModel with getters/setters to allow for property change notification
        NFJS.ViewModelPreparer.prepare(this.baseViewModel);

        if (rootElementId) {
            var rootElement = $('#' + rootElementId)[0];
            if (!rootElement) {
                throw 'Unable to initialize bindings!  A root element with ID of "' + rootElementId + '" doesn\'t seem to exist.';
            }
        } else {
            var rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
        }

        NFJS.Parser.parseElementAndChildren(this.baseViewModel, rootElement);
    }

    public static addOrReplaceDirective(directive: typeof NFJS.Directives.DirectiveBase) {
        for (var i = 0; i < NFJS.Directives.allDirectives.length; i++) {
            if (NFJS.Directives.allDirectives[i].directiveName === directive.directiveName) {
                NFJS.Directives.allDirectives.splice(i, 1);
            }
        }

        NFJS.Directives.allDirectives.push(directive);
    }
}
