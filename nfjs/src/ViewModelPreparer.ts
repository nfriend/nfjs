/// <reference path="Observer.ts" />

module NFJS {
    'use strict';

    export class ViewModelPreparer {

        // prepares a ViewModel for databinding by replacing all properties currently on the viewmodel with
        // properties defined with getters and setters
        static prepare = (viewModel: ViewModel): void => {

            // backing fields will be stored on the _data property
            viewModel._data = {};

            viewModel._observer = new Observer(viewModel);

            for (var property in viewModel) {
                if (property === '_data' || property === '_observer' || !(viewModel.hasOwnProperty(property))) {
                    continue;
                }

                // calling into another function here to avoid the classic for/closure problem
                ViewModelPreparer.defineProperty(viewModel, property);
            };
        }

        private static defineProperty(viewModel: ViewModel, property: string) {

            // TODO: handle properties specified in ViewModel's prototype
            if (viewModel.hasOwnProperty(property)) {
                
                var initialValue = viewModel[property];

                // redefine the property with a getter and setter
                Object.defineProperty(viewModel, property, {
                    get: function () {
                        viewModel._observer.recordPropertyAccess(property);
                        return viewModel._data[property];
                    },
                    set: function (newValue) {
                        viewModel._data[property] = newValue;

                        if (newValue.constructor === Array) {
                            ViewModelPreparer.augmentArrayMethods(newValue, viewModel, property);
                        }

                        viewModel._observer.notifyPropertyChanged(property);
                    }
                });

                // initialize the property with the same value that was passed in
                viewModel[property] = initialValue;

                // recursively apply this preparation step to ViewModel sub-properties
                if (viewModel[property] !== null && typeof viewModel[property] === 'object') {
                    ViewModelPreparer.prepare(viewModel[property]);
                }

            }
        }

        private static augmentArrayMethods(array: Array<any>, viewModel: ViewModel, property: string) {
            var methods = [
                'push',
                'pop',
                'shift',
                'unshift',
                'splice',
                'sort',
                'reverse'
            ];
            
            methods.forEach((method) => {
                array[method] = function () {
                    var returnValue = Array.prototype[method].apply(this, arguments);
                    viewModel._observer.notifyPropertyChanged(property);
                    return returnValue;
                }
            });                
        }
    }
} 