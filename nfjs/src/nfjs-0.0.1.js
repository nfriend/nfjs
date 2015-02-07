/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
var NF = (function () {
    function NF(viewModel) {
        this.directives = [];
        // TODO: handle no-conflict jQuery
        if (typeof $ === 'undefined') {
            throw 'jQuery not loaded! NF.js requires jQuery >= 2.0.0.';
        }
        this.baseViewModel = viewModel;
        // add default bindings
        this.addDirective(new NFJS.Directives.ForEach());
        this.addDirective(new NFJS.Directives.Text());
        this.addDirective(new NFJS.Directives.Click());
        this.addDirective(new NFJS.Directives.Event());
        this.addDirective(new NFJS.Directives.Value());
        // prepare the ViewModel with getters/setters to allow for property change notification
        NFJS.ViewModelPreparer.prepare(viewModel);
    }
    NF.prototype.addDirective = function (directive) {
        this.directives.push(directive);
    };
    NF.prototype.run = function () {
        var rootElement = document.getElementsByTagName('html')[0];
        var directiveReferences = this.getAllDirectiveReferencesRecursively(rootElement);
        for (var i = 0; i < directiveReferences.length; i++) {
            var currentDirectiveReference = directiveReferences[i];
            var computedExpression;
            // TypeScript doesn't allow "with"... or does it.  TODO: make a proper expression evaluater.  This makes me die a little bit inside.
            eval("with (this.baseViewModel) { \
                     computedExpression = eval('(function() { return ' + currentDirectiveReference.directiveExpression + '; })()'); \
                 }");
            currentDirectiveReference.directive.initialize(currentDirectiveReference.element, computedExpression);
        }
    };
    NF.prototype.getAllDirectiveReferencesRecursively = function (rootElement, directiveReferences) {
        var _this = this;
        directiveReferences = directiveReferences || [];
        for (var i = 0; i < this.directives.length; i++) {
            if (rootElement.hasAttribute(this.directives[i].name)) {
                directiveReferences.push({
                    element: rootElement,
                    directive: this.directives[i],
                    directiveExpression: rootElement.getAttribute(this.directives[i].name)
                });
            }
        }
        $(rootElement).children().each(function (i, elem) {
            _this.getAllDirectiveReferencesRecursively(elem, directiveReferences);
        });
        return directiveReferences;
    };
    return NF;
})();
/// <reference path="src/NF.ts" /> 
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Click = (function () {
            function Click() {
                this.name = 'nf-click';
            }
            Click.prototype.initialize = function (element, value) {
                var $element = $(element);
                var template = $element.click(function (e) {
                    value($element, e);
                });
            };
            Click.prototype.update = function (element, value) {
            };
            return Click;
        })();
        Directives.Click = Click;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Event = (function () {
            function Event() {
                this.name = 'nf-event';
            }
            Event.prototype.initialize = function (element, value) {
                if (!(value.event && value.handler)) {
                    throw '"Event" binding must be given an object with both a "event" property and a "handler" property';
                }
                var $element = $(element);
                var template = $element.on(value.event, function (e) {
                    value.handler($element, e);
                });
            };
            Event.prototype.update = function (element, value) {
            };
            return Event;
        })();
        Directives.Event = Event;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var ForEach = (function () {
            function ForEach() {
                this.name = 'nf-foreach';
            }
            ForEach.prototype.initialize = function (element, value) {
                var $element = $(element);
                var template = $element.html();
                $element.html('');
                for (var i = 0; i < value.length; i++) {
                    $element.append(template);
                }
            };
            ForEach.prototype.update = function (element, value) {
            };
            return ForEach;
        })();
        Directives.ForEach = ForEach;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Text = (function () {
            function Text() {
                this.name = 'nf-text';
            }
            Text.prototype.initialize = function (element, value) {
                element.innerHTML = value;
            };
            Text.prototype.update = function (element, value) {
            };
            return Text;
        })();
        Directives.Text = Text;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Value = (function () {
            function Value() {
                this.name = 'nf-value';
            }
            Value.prototype.initialize = function (element, value) {
                var $element = $(element);
                $element.val(value);
                var template = $element.on('keypress', function (e) {
                    value = $element.val();
                });
            };
            Value.prototype.update = function (element, value) {
            };
            return Value;
        })();
        Directives.Value = Value;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    'use strict';
    var ViewModelPreparer = (function () {
        function ViewModelPreparer() {
        }
        ViewModelPreparer.defineProperty = function (viewModel, property) {
            // TODO: handle properties specified in ViewModel's prototype
            if (viewModel.hasOwnProperty(property)) {
                // set the initial value
                viewModel._privateMembers[property] = viewModel[property];
                // redefine the property with a getter and setter
                Object.defineProperty(viewModel, property, {
                    get: function () {
                        console.log('Got value of property: ' + property);
                        return viewModel._privateMembers[property];
                    },
                    set: function (newValue) {
                        console.log(property + ' set to new value: ' + newValue);
                        viewModel._privateMembers[property] = newValue;
                    }
                });
                // recursively apply this preparation step to ViewModel sub-properties
                if (typeof viewModel[property] === 'object') {
                    ViewModelPreparer.prepare(viewModel[property]);
                }
            }
        };
        // prepares a ViewModel for databinding by replacing all properties currently on the viewmodel with
        // properties defined with getters and setters
        ViewModelPreparer.prepare = function (viewModel) {
            // backing fields will be stored on the _privateMembers property
            viewModel._privateMembers = {};
            for (var property in viewModel) {
                if (property === '_privateMembers') {
                    continue;
                }
                // calling into another function here to avoid the classic for/closure problem
                ViewModelPreparer.defineProperty(viewModel, property);
            }
            ;
        };
        return ViewModelPreparer;
    })();
    NFJS.ViewModelPreparer = ViewModelPreparer;
})(NFJS || (NFJS = {}));
//# sourceMappingURL=nfjs-0.0.1.js.map