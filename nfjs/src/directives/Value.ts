module NFJS.Directives {
    export class Value implements Directive {
        name = 'nf-value';

        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            $element.val(value);
            var template = $element.on('keypress', (e) => {
                value = $element.val();
            });
        }
        update(element: HTMLElement, value: any) { }
    }
} 