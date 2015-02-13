module NFJS {
    'use strict';

    interface DependencyInfo {
        element: Element;
        directives: { [directiveName: string]: Array<string> };
    }

    export class Observer {

        constructor(viewModel: ViewModel) {
            this.viewModel = viewModel;
        }

        private dependencies: Array<DependencyInfo> = [];
        private currentDependencyList: Array<string>;
        private isTrackingDependencies: boolean = false;
        private viewModel: ViewModel;

        public recordPropertyAccess(propertyName: string): void {
            if (this.isTrackingDependencies) {
                if (this.currentDependencyList.indexOf(propertyName) === -1) {
                    this.currentDependencyList.push(propertyName);
                }
            }
        }

        // TODO: figure out a better way to locate a dependent element/directive based for a given property
        public notifyPropertyChanged(propertyName: string): void {
            for (var i = 0; i < this.dependencies.length; i++) {
                for (var directiveName in this.dependencies[i].directives) {
                    if (this.dependencies[i].directives.hasOwnProperty(<string>directiveName)) {
                        if (this.dependencies[i].directives[directiveName].indexOf(propertyName) !== -1) {
                            Parser.parseDirectiveForElement(directiveName, this.dependencies[i].element, this.viewModel);
                        }
                    }
                }
            }
        }

        public beginTrackingDependencies(element: Element, directive: string): void {
            this.isTrackingDependencies = true;

            var targetDependencyInfo: DependencyInfo = null;
            for (var i = 0; i < this.dependencies.length; i++) {
                if (this.dependencies[i].element == element) {
                    targetDependencyInfo = this.dependencies[i]
                    break;
                }
            }

            if (!targetDependencyInfo) {
                targetDependencyInfo = {
                    element: element,
                    directives: {}
                }
                this.dependencies.push(targetDependencyInfo);
            }

            targetDependencyInfo.directives[directive] = [];

            this.currentDependencyList = targetDependencyInfo.directives[directive];
        }

        public stopTrackingDependencies(): void {
            this.isTrackingDependencies = false;
        }
    }
} 