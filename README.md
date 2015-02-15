# nfjs
A naïve attempt at a client-side binding library, based on [Knockout](http://knockoutjs.com/) and [Vue](http://vuejs.org/). Built to teach myself how JavaScript binding frameworks are implemented. Written in TypeScript.

## Demo
Every binding framework needs [a "todo" demo](http://nathanfriend.io/nfjs).

## Usage

First, define an object to serve as your ViewModel:

```` JavaScript
function ViewModel() {
  this.message = 'Hello world!';
}
````

Then, call the `NF.run` function with an instance of your ViewModel as a parameter:

```` JavaScript
nf.run(new ViewModel());
````

In your view, bind to properties on your ViewModel using the directive syntax:

```` HTML
<p nf-text="'Here is a message for you: ' + message"></p>
````

The result:

````
Here is a message for you: Hello world!
````

## Custom directives

Custom directives are created by inheriting from the [NFJS.Directives.BaseDirective](nfjs/src/directives/DirectiveBase.ts) class and registering the new class with the `NF.addOrReplaceDirective` function.

The `initialize` method is called when the directive is first applied to an element in the view.  The `initialize` method is passed a reference to the current element and the evaluated value of the directive's expression.  This method should be used to set up the element's initial state and add DOM handlers to react to changes in the view.

The `update` method is called when the directive's dependent data in the ViewModel changes.  This method is passed the same parameters as the `initialize` method.  This method should be used to update the DOM to reflect the changes in the ViewModel.  To write changes back to the ViewModel, use the `BaseDirective.setValue` method.

For example, here's a stripped-down implementation of the `nf-text` directive:

```` JavaScript
function SimpleText() {
  this.update = function (element, value) {
      element.innerHTML = value;
  };
}

// directiveName must be a static property on your Directive class
SimpleText.directiveName = 'nf-simpletext';
SimpleText.prototype = new NFJS.Directives.BaseDirective();
SimpleText.prototype.constructor = SimpleText;

// before using a custom directive, be sure to register it:
NF.addorReplaceDirective(SimpleText);
````
