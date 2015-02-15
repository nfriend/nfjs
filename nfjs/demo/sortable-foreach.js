function SortableForeach() {
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
            },
            // TODO: expose this as an option
            delay: 100
        }).disableSelection();
    }

    this.controlsDescendantBindings = true;
}

SortableForeach.prototype = new NFJS.Directives.DirectiveBase();
SortableForeach.prototype.constructor = SortableForeach;
SortableForeach.directiveName = 'nf-sortable-foreach';

NF.addOrReplaceDirective(SortableForeach);