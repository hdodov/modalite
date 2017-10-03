# Modalite
Is the simplest JavaScript modal library. **No jQuery.** Just a few HTML attributes.

# [Demo](https://hdodov.github.io/modalite/)
Can be seen [here](https://hdodov.github.io/modalite/) or in [this fiddle](https://jsfiddle.net/hdodov/nfj28m8h/).

# Installation

```
npm install modalite
```

or

```
git clone https://github.com/hdodov/modalite/
```

# How to use?
You could use the Modalite modal template and CSS, it takes responsiveness into consideration. If you're not interested in that, you can create your modal from scratch too.

Whatever you do, start by including the Modalite JavaScript in your page:
```html
<script type="text/javascript" src="path/to/modalite.min.js"></script>
```

## Building a modal with the Modalite template
The CSS provided by the library styles the modal so that it's visible only when it has the `is-visible` class. It also styles the close button, container and content area. For modals with the `modalite-remote` class, an overlay and loading spinner are also added. To have all of that, you only need:

```html
<link rel="stylesheet" type="text/css" href="path/to/modalite.min.css">
```

Then, to create a modal, use this template:

```html
<div id="my-modal-id" class="modalite-modal" data-modalite-modal>
    <div class="modalite-container">
        <div class="modalite-close" data-modalite-close></div>

        <div class="modalite-content">
            <h1>My content here!</h1>
        </div>
    </div>
</div>
```

At this point, your modal will be sitting silently and won't be visible. Now, you need to add a trigger:

```html
<p data-modalite-open="my-modal-id">Click me for a juicy modal!</p>
```

**Note: If you have a remote modal, it won't have the loading spinner and overlay unless you add the `modalite-remote` class to the element with the `data-modalite-modal` attribute. If you have an `<iframe>` remote and you want it to take up the whole modal window, add the `modalite-iframe` class in addition to `modalite-remote`.**

## Building a modal with your own CSS
To create a modal, you simply need to:

1. Add an element with the `data-modalite-modal` attribute and give it an `id`. Style it so that it's hidden. You can use the `visibility` CSS property. It's good for the job, because it's affected by transitions and makes animations a whole lot easier. Add another rule-set for when the element has the `is-visible` class. This should define its visible behaviour.
2. Add an element with the `data-modalite-open` attribute and set its value to equal the previously created modal's `id`. When clicked, this will add the `is-visible` class to the targeted modal.
3. **Optionally**, you can add a close button for the modal. By default, it will be closed when its background is clicked, as this is expected modal behaviour. To add a close functionality, simply add any element **inside** the modal and give it the `data-modalite-close` attribute.

For example, this would be a fully functional modal:

```html
<div id="my-modal" data-modalite-modal>
    <p data-modalite-close>Close me!</p>
</div>

<p data-modalite-open="my-modal">Open the modal!</p>
```

You just need to add some CSS and make the modal invisible by default and then add some styles that show it when it has the `is-visible` class.

# Remote modals
They rock! Have a 5MB Privacy Policy? Remote modals are the way. No need to demolish your page load times with something that nobody is going to read. **Ever.** Simply load all of that text when the modal is opened. This way, if your visitor isn't interested in your Privacy Policy, he wouldn't have to wait for it to load in those crucial first seconds of his visit.

## How do remote modals work?
When the modal is opened, its contents are searched for elements with the `data-modalite-remote` attribute. It should hold the URL to the desired resource. However, DOM operations can be costly, especially for large elements. Suppose you decided to actually splatter that Privacy Policy directly in your modal. It could have thousands of elements... searching for an attribute that might not even exist will be a huge overhead.

That's why the remote modal must have the `data-modalite-has-remote` attribute. Without it, you'll just be having a regular modal. No DOM searches will be performed whatsoever.

When an element with `data-modalite-remote` is found, two things can happen:

- If the element is **not** an `<iframe>`, an XHR to the remote URL will be initiated. The contents of the element will be replaced with the XHR response text.
- If the element **is** an `<iframe>`, its `src` attribute will simply be set to the remote URL specified in `data-modalite-remote`.

**Note: Remote resources are loaded only once! If you close the modal and open it again, nothing would happen.**

## How to create a remote modal?
It's the same thing as before, but with two additional steps:

4. Add the `data-modalite-has-remote` attribute to your modal.
5. Add the `data-modalite-remote` attribute to any element **inside** the modal. Its value should be set to the URL of the remote resource.

This would be a fully functioning _remote_ modal:

```html
<div id="my-modal" data-modalite-modal data-modalite-has-remote>
    <div data-modalite-remote="path/to/my/file.txt">
        Get ready for the content!!!
    </div>
</div>

<p data-modalite-open="my-modal">Open the modal!</p>
```

If you want several different remotes sharing a single modal container, change the `data-modalite-open` attribute:

```html
<p data-modalite-open="my-remote-modal@path/to/my/remote.txt">My remote modal!</p>
```

Whenever this element is clicked, a modal with ID `my-remote-modal` will be opened. However, if it has an element with `data-modalite-remote` inside, that attribute's value will be set to whatever is after the `@` symbol.

If you have multiple `data-modalite-remote` elements, you have to separate the remote URLs with `,`:

```html
<p data-modalite-open="my-remote-modal@my/file1.txt,my/file2.txt">My remote modal!</p>
```

The first `data-modalite-remote` will be set to `my/file1.txt`, the second will be `my/file2.txt`. If there are more remotes than the specified URLs, they will be set to `""` and their previously loaded content will be removed.

For example, if you want your Privacy Policy and Terms & Conditions to share a modal container, you need:

```html
<p data-modalite-open="legal-modal@legalstuff/privacy-policy.html">Privacy Policy</p>
<p data-modalite-open="legal-modal@legalstuff/terms-and-conditions.html">Terms & Conditions</p>
```

**Note: You can load any file type, as long as it's text. If you're loading HTML, be wary... it may contain harmful `<script>` tags that could inject JavaScript and compromise the security of your site!**

# API
Modals are opened and closed just by adding/removing their visibility class. However, if the modal has to load any remote resources, that won't be enough.

```js
/**
 * Adds the visibility class to a modal and loads its remotes.
 * @param  {object} modal The DOM modal element.
 */
Modalite.open(modal);

/**
 * Removes the visibility class from a modal.
 * @param  {object} modal The DOM modal element.
 */
Modalite.close(modal);

/**
 * Removes the visibility class from a modal.
 * @param  {object} modal The DOM modal element.
 * @param  {array}  remotes Remote URLs.
 */
Modalite.setRemotes(modal, remotes);
```

# Styling guide
Here are the CSS classes provided by Modailte that you can use to style your modals.

## Modal classes
Added to the element with attribute `data-modalite-modal`.

- `is-visible`: Bread and butter. Added when the modal is opened and removed when it's closed.
- `is-loading`: Added when the modal starts loading remote resources. Removed when all remote resources in the modal have finished loading or failed to do so.
- `is-loaded`: Added at the same time `is-loading` is removed.

## Remote container classes
Added to all elements with attribute `data-modalite-remote`.

- `is-remote-loading`: Added when the remote starts loading. Removed when the remote has loaded or failed to do so.
- `is-remote-success`: Added when the remote has successfully loaded. Iframe remotes get this class when their `load` event triggers.
- `is-remote-error`: Added if the XHR response status code isn't in the 200-299 range. Iframe remotes don't get this class as there is no way to check whether they have successfully loaded.

# Changelog
- 2.0.0 - Set class and attributes prefix to `modalite`. Remote URLs can be dynamically changed. Improved CSS for greater browser support.
- 1.2.0 - Exposed the `openModal()` and `closeModal()` functions to control modals via code.
- 1.1.0 - Added support for modals with external resources.
- 1.0.0 - Initial release.

# Support

Thankyouverymuch.

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BJYF6LCVLXDFW)