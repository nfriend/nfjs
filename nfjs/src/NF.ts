/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

interface DirectiveReference {
    element: Element;
    directive: NFJS.Directives.DirectiveBase;
    directiveExpression: string;
}

class NF {

    private baseViewModel;
    public static Directives: Array<NFJS.Directives.DirectiveBase> = [];

    constructor(viewModel: any) {

        // TODO: handle no-conflict jQuery
        if (typeof $ === 'undefined') {
            throw 'jQuery not loaded! NF.js requires jQuery >= 2.0.0.'
        } else if (parseInt($.fn.jquery.charAt(0), 10) < 2) {
            throw 'An old version of jQuery was loaded! NF.js requires jQuery >= 2.0.0.'
        }

        this.baseViewModel = viewModel;

        // add default bindings, if they haven't already been defined
        if (NF.Directives['nf-foreach'] === undefined) {
            NF.Directives['nf-foreach'] = new NFJS.Directives.ForEach();
        }
        if (NF.Directives['nf-text'] === undefined) {
            NF.Directives['nf-text'] = new NFJS.Directives.Text();
        }
        if (NF.Directives['nf-click'] === undefined) {
            NF.Directives['nf-click'] = new NFJS.Directives.Click();
        }
        if (NF.Directives['nf-event'] === undefined) {
            NF.Directives['nf-event'] = new NFJS.Directives.Event();
        }
        if (NF.Directives['nf-value'] === undefined) {
            NF.Directives['nf-value'] = new NFJS.Directives.Value();
        }
        if (NF.Directives['nf-template'] === undefined) {
            NF.Directives['nf-template'] = new NFJS.Directives.Template();
        }

        // prepare the ViewModel with getters/setters to allow for property change notification
        NFJS.ViewModelPreparer.prepare(this.baseViewModel);
    }

    public run(rootElementId?: string): void {
        if (rootElementId) {
            var rootElement = $('#' + rootElementId)[0];
            if (!rootElement) {
                throw 'Unable to initialize bindings!  A root element with ID of "' + rootElementId + '" doesn\'t seem to exist.';
            }
        } else {
            var rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
        }

        NFJS.Parser.parse(this.baseViewModel, rootElement);
    }
}
