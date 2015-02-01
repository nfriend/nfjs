/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

interface DirectiveReference {
    element: Element;
    directive: NFJS.Directives.Directive;
    directiveExpression: string;
}

class NF {
    constructor(viewModel: any) {

        // TODO: handle no-conflict jQuery
        if (typeof $ === 'undefined') {
            throw 'jQuery not loaded! NF.js requires jQuery >= 2.0.0.'
        }

        this.baseViewModel = viewModel;

        // add default bindings
        this.addDirective(new NFJS.Directives.ForEach());
        this.addDirective(new NFJS.Directives.Text());
    }

    private directives: Array<NFJS.Directives.Directive> = [];
    private baseViewModel;

    public addDirective(directive: NFJS.Directives.Directive): void {
        this.directives.push(directive);
    }

    public run(): void {
        var rootElement = document.getElementsByTagName('html')[0];
        var directiveReferences = this.getAllDirectiveReferencesRecursively(rootElement);
        for (var i = 0; i < directiveReferences.length; i++) {
            var currentDirectiveReference = directiveReferences[i];
            var computedExpression = function () { return eval(currentDirectiveReference.directiveExpression); }.apply(this.baseViewModel);
            currentDirectiveReference.directive.initialize(currentDirectiveReference.element, computedExpression);
        }
    }

    private getAllDirectiveReferencesRecursively(rootElement: Element, directiveReferences?: Array<DirectiveReference>): Array<DirectiveReference> {
        directiveReferences = directiveReferences || [];
        for (var i = 0; i < this.directives.length; i++) {
            if (rootElement.hasAttribute(this.directives[i].name)) {
                directiveReferences.push({
                    element: rootElement,
                    directive: this.directives[i],
                    directiveExpression: rootElement.getAttribute(this.directives[i].name)
                });
            }
        }

        $(rootElement).children().each((i, elem) => {
            this.getAllDirectiveReferencesRecursively(elem, directiveReferences);
        });

        return directiveReferences;
    }
}
