function Sortable() {
    var _this = this,
        forEachDirective = new NFJS.Directives.ForEach(),
        lastOrder;

    this.initialize = function (element, value, viewModel) {
        forEachDirective.initialize(element, value, viewModel);
    }

    this.update = function (element, value, viewModel) {
        forEachDirective.update(element, value, viewModel);
        var $element = $(element);

        // remember the last order
        lastOrder = [];

        // TODO: what happens if the template doesn't have a single root node?
        $element.children().each(function (index, element) {
            lastOrder.push({
                element: element,
                value: value[index]
            });
        });

        $element.sortable({
            update: function (event, ui) {
                var newOrderedArray = [];
                $element.children().each(function (index, element) {
                    for (var i = 0; i < lastOrder.length; i++) {
                        if (lastOrder[i].element === element) {
                            newOrderedArray.push(lastOrder[i].value);
                            break;
                        }
                    }
                });

                // TODO: is there a way to just reorder the existing array instead of creating a new array?
                _this.setValue(newOrderedArray);
            }
        }).disableSelection();
    }

    this.controlsDescendantBindings = true;
}

Sortable.prototype = new NFJS.Directives.DirectiveBase();
Sortable.prototype.constructor = Sortable;
Sortable.directiveName = 'nf-sortable';

NF.addOrReplaceDirective(Sortable);