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
                     computedExpression = eval(currentDirectiveReference.directiveExpression); \
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
//# sourceMappingURL=nfjs-0.0.1.js.map