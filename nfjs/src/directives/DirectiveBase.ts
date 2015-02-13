module NFJS.Directives {
    export class DirectiveBase {
        initialize(element: Element, value: any, viewModel: ViewModel) { }
        update(element: Element, value: any, viewModel: ViewModel) { }
        controlsDescendantBindings = false;

        setValue = (newValue: any): void => {
        }

        _triggerInitialize(element: Element, value: any, viewModel: ViewModel, directiveExpression: string) {
            this._updateSetValueFunction(viewModel, directiveExpression);
            this.initialize(element, value, viewModel);
        }

        _triggerUpdate(element: Element, value: any, viewModel: ViewModel, directiveExpression: string) {
            this._updateSetValueFunction(viewModel, directiveExpression);
            this.update(element, value, viewModel);
        }

        _updateSetValueFunction(viewModel: ViewModel, directiveExpression: string) {
            this.setValue = (newValue) => {
                if (!viewModel[directiveExpression]) {
                    throw 'The expression "' + directiveExpression + '" is not a property and therefore cannot be set';
                }

                viewModel[directiveExpression] = newValue;
            };
        }
    }
}