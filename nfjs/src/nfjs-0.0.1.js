/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
var NF = (function () {
    function NF() {
    }
    NF.run = function (viewModel, rootElementId) {
        // TODO: handle no-conflict jQuery
        if (typeof $ === 'undefined') {
            throw 'jQuery not loaded! NF.js requires jQuery >= 2.0.0.';
        }
        else if (parseInt($.fn.jquery.charAt(0), 10) < 2) {
            throw 'An old version of jQuery was loaded! NF.js requires jQuery >= 2.0.0.';
        }
        this.baseViewModel = viewModel;
        // add default bindings, if they haven't already been defined
        var defaultBindings = [
            NFJS.Directives.ForEach,
            NFJS.Directives.Text,
            NFJS.Directives.Click,
            NFJS.Directives.Event,
            NFJS.Directives.Value,
            NFJS.Directives.Template,
            NFJS.Directives.If,
            NFJS.Directives.Class,
            NFJS.Directives.Style,
        ];
        for (var i = 0; i < defaultBindings.length; i++) {
            var bindingAlreadyExists = false;
            for (var j = 0; j < NFJS.Directives.allDirectives.length; j++) {
                if (NFJS.Directives.allDirectives[j].directiveName === defaultBindings[i].directiveName) {
                    bindingAlreadyExists = true;
                }
            }
            if (!bindingAlreadyExists) {
                NF.addOrReplaceDirective(defaultBindings[i]);
            }
        }
        // prepare the ViewModel with getters/setters to allow for property change notification
        NFJS.ViewModelPreparer.prepare(this.baseViewModel);
        if (rootElementId) {
            var rootElement = $('#' + rootElementId)[0];
            if (!rootElement) {
                throw 'Unable to initialize bindings!  A root element with ID of "' + rootElementId + '" doesn\'t seem to exist.';
            }
        }
        else {
            var rootElement = document.getElementsByTagName('html')[0];
        }
        NFJS.Parser.parseElementAndChildren(this.baseViewModel, rootElement);
    };
    NF.addOrReplaceDirective = function (directive) {
        for (var i = 0; i < NFJS.Directives.allDirectives.length; i++) {
            if (NFJS.Directives.allDirectives[i].directiveName === directive.directiveName) {
                NFJS.Directives.allDirectives.splice(i, 1);
            }
        }
        NFJS.Directives.allDirectives.push(directive);
    };
    // how to respond when bindings fail.  possible values: 'throw', 'log', 'none'
    NF.bindingFailureBehavior = 'throw';
    return NF;
})();
/// <reference path="src/arrayModifications.ts" />
/// <reference path="src/NF.ts" /> 
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        Directives.allDirectives = [];
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var DirectiveBase = (function () {
            function DirectiveBase() {
                this.controlsDescendantBindings = false;
                this.setValue = function (newValue) {
                };
            }
            DirectiveBase.prototype.initialize = function (element, value, viewModel) {
            };
            DirectiveBase.prototype.update = function (element, value, viewModel) {
            };
            DirectiveBase.prototype._triggerInitialize = function (element, value, viewModel, directiveExpression) {
                this._updateSetValueFunction(viewModel, directiveExpression);
                this.initialize(element, value, viewModel);
            };
            DirectiveBase.prototype._triggerUpdate = function (element, value, viewModel, directiveExpression) {
                this._updateSetValueFunction(viewModel, directiveExpression);
                this.update(element, value, viewModel);
            };
            DirectiveBase.prototype._updateSetValueFunction = function (viewModel, directiveExpression) {
                this.setValue = function (newValue) {
                    if (typeof viewModel[directiveExpression] === 'undefined') {
                        throw 'The expression "' + directiveExpression + '" is not a property and therefore cannot be set';
                    }
                    viewModel[directiveExpression] = newValue;
                };
            };
            return DirectiveBase;
        })();
        Directives.DirectiveBase = DirectiveBase;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Class = (function (_super) {
            __extends(Class, _super);
            function Class() {
                _super.apply(this, arguments);
            }
            Class.prototype.update = function (element, value, viewModel) {
                var $element = $(element);
                if (value.constructor === Array) {
                    throw 'nf-class binding to an array not yet implemented';
                }
                else if (typeof value === 'object') {
                    for (var cssClass in value) {
                        if (value.hasOwnProperty(cssClass)) {
                            if (value[cssClass]) {
                                $element.addClass(cssClass);
                            }
                            else {
                                $element.removeClass(cssClass);
                            }
                        }
                    }
                }
                else {
                    if (value === this.lastStringValue) {
                        return;
                    }
                    if (this.lastStringValue) {
                        $element.removeClass(this.lastStringValue);
                    }
                    this.lastStringValue = value;
                    $element.addClass(value);
                }
            };
            Class.directiveName = 'nf-class';
            return Class;
        })(Directives.DirectiveBase);
        Directives.Class = Class;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Click = (function (_super) {
            __extends(Click, _super);
            function Click() {
                _super.apply(this, arguments);
            }
            Click.prototype.initialize = function (element, value) {
                var $element = $(element);
                var template = $element.click(function (e) {
                    if (typeof value === 'function') {
                        value($element, e);
                    }
                    else {
                        var handler = value.handler, params = value.params;
                        if (typeof handler === 'undefined' || typeof params === 'undefined') {
                            throw '';
                        }
                        var evalString = 'handler(';
                        for (var i = 0; i < params.length; i++) {
                            evalString += 'params[' + i + ']';
                            evalString += i === params.length - 1 ? ');' : ', ';
                        }
                        eval(evalString);
                    }
                });
            };
            Click.prototype.update = function (element, value) {
            };
            Click.directiveName = 'nf-click';
            return Click;
        })(Directives.DirectiveBase);
        Directives.Click = Click;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Event = (function (_super) {
            __extends(Event, _super);
            function Event() {
                _super.apply(this, arguments);
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
            Event.directiveName = 'nf-event';
            return Event;
        })(Directives.DirectiveBase);
        Directives.Event = Event;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var ForEach = (function (_super) {
            __extends(ForEach, _super);
            function ForEach() {
                _super.apply(this, arguments);
                this.controlsDescendantBindings = true;
            }
            ForEach.prototype.initialize = function (element, value, viewModel) {
                var $element = $(element);
                this.template = $element.html();
                $element.html('');
            };
            // TODO: don't regenerate everything always - only regenerate the items that changed
            ForEach.prototype.update = function (element, value, viewModel) {
                var $element = $(element);
                $element.html('');
                for (var i = 0; i < value.length; i++) {
                    var templatedElements = $(this.template);
                    $element.append(templatedElements);
                    templatedElements.each(function (index, innerElement) {
                        if (typeof value[i] === 'object') {
                            var bindingContext = value[i];
                        }
                        else {
                            var bindingContext = {};
                        }
                        // add properties to this child's binding context
                        bindingContext['$data'] = value[i];
                        bindingContext['$index'] = i;
                        bindingContext['$prev'] = value[i - 1];
                        bindingContext['$next'] = value[i + 1];
                        bindingContext['$isFirst'] = i === 0;
                        bindingContext['$isLast'] = i === value.length - 1;
                        bindingContext['$parent'] = viewModel;
                        NFJS.Parser.parseElementAndChildren(bindingContext, innerElement);
                        // delete these binding-only properties from our ViewModel
                        bindingContext['$data'] = undefined;
                        bindingContext['$index'] = undefined;
                        bindingContext['$prev'] = undefined;
                        bindingContext['$next'] = undefined;
                        bindingContext['$isFirst'] = undefined;
                        bindingContext['$isLast'] = undefined;
                        bindingContext['$parent'] = undefined;
                    });
                }
            };
            ForEach.directiveName = 'nf-foreach';
            return ForEach;
        })(Directives.DirectiveBase);
        Directives.ForEach = ForEach;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var If = (function (_super) {
            __extends(If, _super);
            function If() {
                _super.apply(this, arguments);
            }
            If.prototype.initialize = function (element, value) {
                var $element = $(element);
                this.template = $element.html();
                $element.html('');
            };
            If.prototype.update = function (element, value, viewModel) {
                var $element = $(element);
                if (value) {
                    $element.html(this.template);
                    $element.children().each(function (index, innerElement) {
                        NFJS.Parser.parseElementAndChildren(viewModel, innerElement);
                    });
                }
                else {
                    $element.html('');
                }
            };
            If.directiveName = 'nf-if';
            return If;
        })(Directives.DirectiveBase);
        Directives.If = If;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Style = (function (_super) {
            __extends(Style, _super);
            function Style() {
                _super.apply(this, arguments);
                this.lastStyleValue = {};
            }
            Style.prototype.update = function (element, value, viewModel) {
                var $element = $(element);
                $element.css(value);
                var styleEraser = {};
                for (var cssRule in this.lastStyleValue) {
                    if (!(cssRule in value)) {
                        styleEraser[cssRule] = '';
                    }
                }
                $element.css(styleEraser);
                this.lastStyleValue = value;
            };
            Style.directiveName = 'nf-style';
            return Style;
        })(Directives.DirectiveBase);
        Directives.Style = Style;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Template = (function (_super) {
            __extends(Template, _super);
            function Template() {
                _super.apply(this, arguments);
            }
            Template.prototype.initialize = function (element, value) {
                var _this = this;
                var replaceContainer = value.replaceContainer || false;
                if (value.id) {
                    var template = $('#' + value.id).html();
                    if (!template) {
                        throw 'Unable to find template with id of "' + value.id + "'";
                    }
                    this.applyTemplate(element, template, replaceContainer);
                }
                else if (value.url) {
                    throw 'Not yet implemented!  This binding will need to control its child\'s binding context';
                    $.ajax({
                        type: 'GET',
                        url: value.url,
                        success: function (template) {
                            _this.applyTemplate(element, template, replaceContainer);
                        },
                        error: function () {
                            throw 'Unable to get template at url: "' + value.url + '"';
                        }
                    });
                }
                else {
                    throw 'The "Template" binding expects an object with either an "id" property or a "url" property';
                }
            };
            Template.prototype.update = function (element, value) {
            };
            Template.prototype.applyTemplate = function (containerElement, template, replaceContainer) {
                var $containerElement = $(containerElement);
                $containerElement.html(template);
                if (replaceContainer) {
                    throw 'The replaceContainer parameters is not yet implemented';
                    $containerElement.contents().unwrap();
                }
            };
            Template.directiveName = 'nf-template';
            return Template;
        })(Directives.DirectiveBase);
        Directives.Template = Template;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Text = (function (_super) {
            __extends(Text, _super);
            function Text() {
                _super.apply(this, arguments);
            }
            Text.prototype.initialize = function (element, value) {
            };
            Text.prototype.update = function (element, value) {
                element.innerHTML = value;
            };
            Text.directiveName = 'nf-text';
            return Text;
        })(Directives.DirectiveBase);
        Directives.Text = Text;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
/// <reference path="DirectiveBase.ts" />
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var Value = (function (_super) {
            __extends(Value, _super);
            function Value() {
                _super.apply(this, arguments);
            }
            Value.prototype.initialize = function (element, value) {
                var _this = this;
                var $element = $(element);
                $element.val(value);
                var template = $element.on('input', function (e) {
                    _this.setValue($element.val());
                });
            };
            Value.prototype.update = function (element, value) {
                var $element = $(element);
                $element.val(value);
            };
            Value.directiveName = 'nf-value';
            return Value;
        })(Directives.DirectiveBase);
        Directives.Value = Value;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    'use strict';
    var Observer = (function () {
        function Observer(viewModel) {
            this.dependencies = {};
            this.isTrackingDependencies = false;
            this.viewModel = viewModel;
        }
        Observer.prototype.recordPropertyAccess = function (propertyName) {
            if (this.isTrackingDependencies) {
                this.dependencies[propertyName] = this.dependencies[propertyName] || [];
                var dependencyIsAlreadyRecorded = false;
                for (var i = 0; i < this.dependencies[propertyName].length; i++) {
                    var currentDependency = this.dependencies[propertyName][i];
                    if (currentDependency.directive.constructor.directiveName === this.currentElementAndDirective.directive.constructor.directiveName && currentDependency.element === this.currentElementAndDirective.element) {
                        dependencyIsAlreadyRecorded = true;
                        break;
                    }
                }
                if (!dependencyIsAlreadyRecorded) {
                    this.dependencies[propertyName].push(this.currentElementAndDirective);
                }
            }
        };
        Observer.prototype.notifyPropertyChanged = function (propertyName) {
            if (!this.dependencies[propertyName])
                return;
            for (var i = 0; i < this.dependencies[propertyName].length; i++) {
                NFJS.Parser.parseDirectiveForElement(this.dependencies[propertyName][i].directive, this.dependencies[propertyName][i].element, this.viewModel);
            }
        };
        Observer.prototype.beginTrackingDependencies = function (element, directive) {
            this.isTrackingDependencies = true;
            this.currentElementAndDirective = {
                directive: directive,
                element: element
            };
        };
        Observer.prototype.stopTrackingDependencies = function () {
            this.isTrackingDependencies = false;
        };
        return Observer;
    })();
    NFJS.Observer = Observer;
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    // don't use strict mode here, because our temporary expression evaluator relies on the "with" keyword
    // 'use strict';
    var Parser = (function () {
        function Parser() {
        }
        Parser.parseElementAndChildren = function (viewModel, rootElement) {
            var _this = this;
            var shouldProcessChildBindings = true, $rootElement = $(rootElement);
            for (var i = 0; i < NFJS.Directives.allDirectives.length; i++) {
                var currentDirective = NFJS.Directives.allDirectives[i];
                if ($rootElement.is('[' + currentDirective.directiveName + ']')) {
                    var initialize = false, directiveInstance = ($rootElement.data(currentDirective.directiveName));
                    if (!directiveInstance) {
                        directiveInstance = new currentDirective();
                        $rootElement.data(currentDirective.directiveName, directiveInstance);
                        initialize = true;
                    }
                    if (directiveInstance.controlsDescendantBindings) {
                        shouldProcessChildBindings = false;
                    }
                    Parser.parseDirectiveForElement(directiveInstance, rootElement, viewModel, initialize);
                }
            }
            if (shouldProcessChildBindings) {
                $rootElement.children().each(function (i, elem) {
                    _this.parseElementAndChildren(viewModel, elem);
                });
            }
        };
        Parser.parseDirectiveForElement = function (directive, element, viewModel, initialize) {
            var directiveExpression = element.getAttribute(directive.constructor.directiveName), $element = $(element), computedExpression, directive;
            if (typeof viewModel['$data'] === 'undefined') {
                viewModel['$data'] = viewModel;
            }
            if (viewModel._observer) {
                viewModel._observer.beginTrackingDependencies(element, directive);
            }
            try {
                eval("with (viewModel) { \
                        computedExpression = eval('(function() { return ' + directiveExpression + '; })()'); \
                    }");
            }
            catch (e) {
                var message = 'Unable to process binding "' + directive.constructor.directiveName + '".The following expression could not be evaluated: ' + directiveExpression;
                if (NF.bindingFailureBehavior.toLowerCase() === 'throw') {
                    throw message;
                }
                else if (NF.bindingFailureBehavior.toLowerCase() === 'log') {
                    console.error(message, e);
                }
                else {
                }
            }
            viewModel['$data'] = undefined;
            if (viewModel._observer) {
                viewModel._observer.stopTrackingDependencies();
            }
            if (initialize) {
                directive._triggerInitialize(element, computedExpression, viewModel, directiveExpression);
            }
            directive._triggerUpdate(element, computedExpression, viewModel, directiveExpression);
        };
        return Parser;
    })();
    NFJS.Parser = Parser;
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    'use strict';
})(NFJS || (NFJS = {}));
/// <reference path="Observer.ts" />
var NFJS;
(function (NFJS) {
    'use strict';
    var ViewModelPreparer = (function () {
        function ViewModelPreparer() {
        }
        ViewModelPreparer.defineProperty = function (viewModel, property) {
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
        };
        ViewModelPreparer.augmentArrayMethods = function (array, viewModel, property) {
            ['pop', 'shift', 'sort', 'reverse'].forEach(function (method) {
                array[method] = function () {
                    var returnValue = Array.prototype[method].apply(this, arguments);
                    viewModel._observer.notifyPropertyChanged(property);
                    return returnValue;
                };
            });
            ['unshift', 'push'].forEach(function (method) {
                array[method] = function () {
                    var returnValue = Array.prototype[method].apply(this, arguments);
                    for (var i = 0; i < arguments.length; i++) {
                        ViewModelPreparer.prepare(arguments[i]);
                    }
                    viewModel._observer.notifyPropertyChanged(property);
                    return returnValue;
                };
            });
            array.splice = function () {
                var returnValue = Array.prototype.splice.apply(this, arguments);
                for (var i = 2; i < arguments.length; i++) {
                    ViewModelPreparer.prepare(arguments[i]);
                }
                viewModel._observer.notifyPropertyChanged(property);
                return returnValue;
            };
        };
        // prepares a ViewModel for databinding by replacing all properties currently on the viewmodel with
        // properties defined with getters and setters
        ViewModelPreparer.prepare = function (viewModel) {
            // backing fields will be stored on the _data property
            viewModel._data = {};
            viewModel._observer = new NFJS.Observer(viewModel);
            for (var property in viewModel) {
                if (property === '_data' || property === '_observer' || !(viewModel.hasOwnProperty(property))) {
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