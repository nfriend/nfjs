module NFJS.Directives {
    export class Text implements Directive {

        name = 'nf-text';

        initialize(element: HTMLElement, value: any) {
            element.innerHTML = value;
        }
        update(element: HTMLElement, value: any) { }
    }
}