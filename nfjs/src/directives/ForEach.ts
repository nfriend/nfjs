module NFJS.Directives {
    export class ForEach implements Directive {
        name = 'nf-foreach';

        initialize(element: HTMLElement, value: any) {
            var $element = $(element);
            var template = $element.html();
            $element.html('');

            for (var i = 0; i < value.length; i++) {
                $element.append(template);    
            }
        }
        update(element: HTMLElement, value: any) { }
    }
} 