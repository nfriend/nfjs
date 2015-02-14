﻿/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

interface DirectiveReference {
    element: Element;
    directive: NFJS.Directives.DirectiveBase;
    directiveExpression: string;
}

class NF {

    private static baseViewModel;

    public static run(viewModel: any, rootElementId?: string): void {
        // TODO: handle no-conflict jQuery
        if (typeof $ === 'undefined') {
            throw 'jQuery not loaded! NF.js requires jQuery >= 2.0.0.'
        } else if (parseInt($.fn.jquery.charAt(0), 10) < 2) {
            throw 'An old version of jQuery was loaded! NF.js requires jQuery >= 2.0.0.'
        }

        this.baseViewModel = viewModel;

        // add default bindings, if they haven't already been defined
        var defaultBindings: typeof NFJS.Directives.DirectiveBase[] = [
            NFJS.Directives.ForEach,
            NFJS.Directives.Text,
            NFJS.Directives.Click,
            NFJS.Directives.Event,
            NFJS.Directives.Value,
            NFJS.Directives.Template
        ]
        for (var i = 0; i < defaultBindings.length; i++) {
            var bindingAlreadyExists = false;
            for (var j = 0; j < NFJS.Directives.allDirectives.length; j++) {
                if (NFJS.Directives.allDirectives[j].name === defaultBindings[i].name) {
                    bindingAlreadyExists = true;
                }
            }

            if (!bindingAlreadyExists) {
                NF.addOrReplaceDirective(defaultBindings[i]);
            }
        }

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
            if (NFJS.Directives.allDirectives[i].name === directive.name) {
                delete NFJS.Directives.allDirectives[i];
            }
        }

        NFJS.Directives.allDirectives.push(directive);
    }
}
