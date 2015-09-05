# ClassTrigger.js
A short js that enables switching classes of HTML elements depending on window size, mouse action with a single line of js!

## Basic Usage
First, include classtrigger.min.js.
Then, initialize ClassTrigger.js by calling `tr.init()`
```html
<script src="js/classtrigger.js"></script>
<script>
tr.init();
</script>
```
Your header will include some stuff like this.
Now, add `data-tr-*` attributes to element.
```html
<p data-tr-large="class1">class1 will be applied to this element only when the window size is larger than 800px.</p>
<p data-tr-medium="class2">class2 will be applied to this element only when the window size is larger than 360px and smaller or equal to 800px.</p>
<p data-tr-small="class3">class3 will be applied to this element only when the window size is smaller or equal to 360px.</p>
```
The example above demonstrates how to assign classes depending on window size.
Of course, you can change or add breakpoints. See "Configurations."

```html
<p data-tr-hover="class1">class1 will be applied to this element when the cursor hovers over this element.</p>
<p data-tr-click="class2">class2 will be applied to this element after it is clicked.</p>
```
The example above demonstrates how to assign classes depending on mouse events.

```html
<p data-tr-hover="class1 class2">Multiple classes can be applied at the same time!</p>
<p class="class3" data-tr-hover="-class3">A "-" before a class name will cancel the class.</p>
<p class="class1" data-tr-hover="-class1 class2">Of course, you can do this!</p>
```
As shown above, you can combine and/or cancel classes.

## Configurations
You can easily configure breakpoints and prefixes of data- attributes at init phase like this.
```javascript
configObj = {
	media: {
		small: "screen and (max-width: 400px)",		//configure an existing breakpoint
		mybreakpoint: "screen and (max-width: 1000px)",		//create your own breakpoint
	},
	prefix: "foo"		//now you can use data-foo-* instead of data-tr-*
};
tr.init(configObj);
```
Defaults are as follows.
```javascript
{
	media: {
		small: 'screen and (max-width: 360px)',
		medium: 'screen and (min-width: 361px) and (max-width: 800px)',
		large: 'screen and (min-width: 801px)',
		print: 'print'
	},
	prefix: "tr"
}
```
