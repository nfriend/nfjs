/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
var NF = (function () {
    function NF(viewModel) {
        // TODO: handle no-conflict jQuery
        if (typeof $ === 'undefined') {
            throw 'jQuery not loaded! NF.js requires jQuery >= 2.0.0.';
        }
        else if (parseInt($.fn.jquery.charAt(0), 10) < 2) {
            throw 'An old version of jQuery was loaded! NF.js requires jQuery >= 2.0.0.';
        }
        this.baseViewModel = viewModel;
        // add default bindings, if they haven't already been defined
        if (NF.Directives['nf-foreach'] === undefined) {
            NF.Directives['nf-foreach'] = new NFJS.Directives.ForEach();
        }
        if (NF.Directives['nf-text'] === undefined) {
            NF.Directives['nf-text'] = new NFJS.Directives.Text();
        }
        if (NF.Directives['nf-click'] === undefined) {
            NF.Directives['nf-click'] = new NFJS.Directives.Click();
        }
        if (NF.Directives['nf-event'] === undefined) {
            NF.Directives['nf-event'] = new NFJS.Directives.Event();
        }
        if (NF.Directives['nf-value'] === undefined) {
            NF.Directives['nf-value'] = new NFJS.Directives.Value();
        }
        if (NF.Directives['nf-template'] === undefined) {
            NF.Directives['nf-template'] = new NFJS.Directives.Template();
        }
        // prepare the ViewModel with getters/setters to allow for property change notification
        NFJS.ViewModelPreparer.prepare(this.baseViewModel);
    }
    NF.prototype.run = function (rootElementId) {
        if (rootElementId) {
            var rootElement = $('#' + rootElementId)[0];
            if (!rootElement) {
                throw 'Unable to initialize bindings!  A root element with ID of "' + rootElementId + '" doesn\'t seem to exist.';
            }
        }
        else {
            var rootElement = document.getElementsByTagName('html')[0];
        }
        NFJS.Parser.parse(this.baseViewModel, rootElement);
    };
    NF.Directives = [];
    return NF;
})();
/// <reference path="src/NF.ts" /> 
var NFJS;
(function (NFJS) {
    var Directives;
    (function (Directives) {
        var DirectiveBase = (function () {
            function DirectiveBase() {
                this.controlsDescendantBindings = false;
            }
            DirectiveBase.prototype.initialize = function (element, value) {
            };
            DirectiveBase.prototype.update = function (element, value) {
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
        var Click = (function (_super) {
            __extends(Click, _super);
            function Click() {
                _super.apply(this, arguments);
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
        })(Directives.DirectiveBase);
        Directives.ForEach = ForEach;
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
                    $containerElement.contents().unwrap();
                }
            };
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
                element.innerHTML = value;
            };
            Text.prototype.update = function (element, value) {
            };
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
                var $element = $(element);
                $element.val(value);
                var template = $element.on('keypress', function (e) {
                    value = $element.val();
                });
            };
            Value.prototype.update = function (element, value) {
            };
            return Value;
        })(Directives.DirectiveBase);
        Directives.Value = Value;
    })(Directives = NFJS.Directives || (NFJS.Directives = {}));
})(NFJS || (NFJS = {}));
var NFJS;
(function (NFJS) {
    // don't use strict mode here, because our temporary expression evaluator relies on the "with" keyword
    // 'use strict';
    var Parser = (function () {
        function Parser() {
        }
        Parser.parse = function (viewModel, rootElement) {
            var _this = this;
            for (var directiveName in NF.Directives) {
                if (NF.Directives.hasOwnProperty(directiveName)) {
                    if (rootElement.hasAttribute(directiveName)) {
                        var directiveExpression = rootElement.getAttribute(directiveName), computedExpression;
                        // TypeScript doesn't allow "with"... or does it.  
                        // TODO: make a proper expression evaluater. This makes me die a little bit inside.
                        eval("with (viewModel._data) { \
                                computedExpression = eval('(function() { return ' + directiveExpression + '; })()'); \
                            }");
                        NF.Directives[directiveName].initialize(rootElement, computedExpression);
                    }
                }
            }
            $(rootElement).children().each(function (i, elem) {
                _this.parse(viewModel, elem);
            });
        };
        return Parser;
    })();
    NFJS.Parser = Parser;
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
        };
        // prepares a ViewModel for databinding by replacing all properties currently on the viewmodel with
        // properties defined with getters and setters
        ViewModelPreparer.prepare = function (viewModel) {
            // backing fields will be stored on the _data property
            viewModel._data = {};
            for (var property in viewModel) {
                if (property === '_data') {
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