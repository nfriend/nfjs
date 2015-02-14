module NFJS {
    'use strict';

    interface DependencyInfo {
        [propertyName: string]: Array<{
            directive: NFJS.Directives.DirectiveBase;
            element: Element
        }>;
    }

    export class Observer {

        constructor(viewModel: ViewModel) {
            this.viewModel = viewModel;
        }

        private dependencies: DependencyInfo = {};
        private currentElementAndDirective: {
            directive: NFJS.Directives.DirectiveBase;
            element: Element
        };
        private isTrackingDependencies: boolean = false;
        private viewModel: ViewModel;

        public recordPropertyAccess(propertyName: string): void {
            if (this.isTrackingDependencies) {
                this.dependencies[propertyName] = this.dependencies[propertyName] || [];
                var dependencyIsAlreadyRecorded = false;
                for (var i = 0; i < this.dependencies[propertyName].length; i++) {
                    var currentDependency = this.dependencies[propertyName][i];
                    if ((<any>currentDependency.directive.constructor).name === (<any>this.currentElementAndDirective.directive.constructor).name
                        && currentDependency.element === this.currentElementAndDirective.element) {

                        dependencyIsAlreadyRecorded = true;
                        break;
                    }
                }
                if (!dependencyIsAlreadyRecorded) {
                    this.dependencies[propertyName].push(this.currentElementAndDirective);
                }
            }
        }

        public notifyPropertyChanged(propertyName: string): void {
            if (!this.dependencies[propertyName])
                return;

            for (var i = 0; i < this.dependencies[propertyName].length; i++) {
                Parser.parseDirectiveForElement(this.dependencies[propertyName][i].directive, this.dependencies[propertyName][i].element, this.viewModel);
            }
        }

        public beginTrackingDependencies(element: Element, directive: NFJS.Directives.DirectiveBase): void {
            this.isTrackingDependencies = true;
            this.currentElementAndDirective = {
                directive: directive,
                element: element
            };
        }

        public stopTrackingDependencies(): void {
            this.isTrackingDependencies = false;
        }
    }
} 