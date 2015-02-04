# nfjs
A naïve attempt at a client-side binding library, based on Knockout and Vue. Built to teach myself how JavaScript binding frameworks are implemented. Written in TypeScript.

## Usage

First, define an object to serve as your ViewModel:

```` JavaScript
function ViewModel() {
  this.message = 'Hello world!';
}
````

Then, instantiate a new `NF` object with your ViewModel as a parameter and call the `run` method:

```` JavaScript
var nf = new NF(new ViewModel());
nf.run();
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

Custom directives are created by implementing the [NFJS.Directives.Directive](nfjs/src/directives/Directive.ts) interface and registering the class with the `NF` object.

The `initialize` method is called when the directive is first applied to an element in the view.  The `initialize` method is passed a reference to the current element and the evaluated value of the directive's expression.  This method should be used to set up the element's initial state and add DOM handlers to react to changes in the view.

The `update` method is called when the directive's dependent data in the ViewModel changes.  This method is passed the same parameters as the `initialize` method.  This method should be used to update the DOM to reflect the changes in the ViewModel.

For example, here's a stripped-down implementation of the `nf-text` directive:

```` JavaScript
function SimpleText() {
  this.name = 'nf-simpletext';
  this.initialize = function (element, value) {
      element.innerHTML = value;
  };
}
````

Before using a custom directive, be sure to register it with your `NF` instance:

```` JavaScript
var nf = new NF(new ViewModel());
nf.addDirective(new SimpleText());
nf.run();
````
