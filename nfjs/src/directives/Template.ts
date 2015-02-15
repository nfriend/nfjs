/// <reference path="DirectiveBase.ts" />

module NFJS.Directives {
    export class Template extends DirectiveBase {
        public static directiveName = 'nf-template';

        initialize(element: HTMLElement, value: any) {

            var replaceContainer = value.replaceContainer || false;

            if (value.id) {
                var template = $('#' + value.id).html();
                if (!template) {
                    throw 'Unable to find template with id of "' + value.id + "'";
                }
                this.applyTemplate(element, template, replaceContainer);
            } else if (value.url) {
                throw 'Not yet implemented!  This binding will need to control its child\'s binding context';

                $.ajax({
                    type: 'GET',
                    url: value.url,
                    success: (template) => {
                        this.applyTemplate(element, template, replaceContainer);
                    },
                    error: function () {
                        throw 'Unable to get template at url: "' + value.url + '"';
                    }
                });

            } else {
                throw 'The "Template" binding expects an object with either an "id" property or a "url" property';
            }

        }
        update(element: HTMLElement, value: any) { }

        private applyTemplate(containerElement: HTMLElement, template: string, replaceContainer: boolean) {
            var $containerElement = $(containerElement);
            $containerElement.html(template);

            if (replaceContainer) {
                throw 'The replaceContainer parameters is not yet implemented';
                $containerElement.contents().unwrap();
            }
        }
    }
}  