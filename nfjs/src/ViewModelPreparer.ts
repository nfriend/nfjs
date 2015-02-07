/// <reference path="Observer.ts" />

module NFJS {
    'use strict';

    export class ViewModelPreparer {

        // prepares a ViewModel for databinding by replacing all properties currently on the viewmodel with
        // properties defined with getters and setters
        static prepare = (viewModel: any): void => {

            // backing fields will be stored on the _data property
            viewModel._data = {};

            viewModel._data._observer = new NFJS.Observer();

            for (var property in viewModel) {
                if (property === '_data') {
                    continue;
                }

                // calling into another function here to avoid the classic for/closure problem
                ViewModelPreparer.defineProperty(viewModel, property);
            };
        }

        private static defineProperty(viewModel, property) {

            // TODO: handle properties specified in ViewModel's prototype
            if (viewModel.hasOwnProperty(property)) {

                // set the initial value
                viewModel._data[property] = viewModel[property];

                // redefine the property with a getter and setter
                Object.defineProperty(viewModel, property, {
                    get: function () {
                        console.log('Got value of property: ' + property);
                        return viewModel._data[property];
                    },
                    set: function (newValue) {
                        console.log(property + ' set to new value: ' + newValue);
                        viewModel._data[property] = newValue;
                    }
                });

                // recursively apply this preparation step to ViewModel sub-properties
                if (typeof viewModel[property] === 'object') {
                    ViewModelPreparer.prepare(viewModel[property]);
                }
            }
        }
    }
} 