# Modalite
Is the simplest JavaScript modal library. No jQuery, classes... Just a few HTML attributes.

# [Demo](https://hdodov.github.io/modalite/)
Can be seen [here](https://hdodov.github.io/modalite/).

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

Whatever you do, start by including the Modalite JavaScript in your site:
```html
<script type="text/javascript" src="path/to/modalite.min.js"></script>
```

## With the Modalite template
Add the Modalite CSS:

```html
<link rel="stylesheet" type="text/css" href="path/to/modalite.min.css">
```

To create a modal, use this template:

```html
<div id="my-modal-id" class="modal" data-modal>
    <div class="modal-container">
        <div class="modal-close" data-close-modal></div>

        <div class="modal-content">
            <h1>My content here!</h1>
        </div>
    </div>
</div>
```

To add a trigger for that modal, add this:

```html
<p data-open-modal="my-modal-id">Click me for a juicy modal!</p>
```

## With your own CSS
To create a modal you simply need to:
<ol>
    <li>Add an element with the `data-modal` attribute and give it an `id`. Style it so that it's hidden. You can use the `visibility` CSS property. It's good for the job, because it's affected by transitions and makes animations a whole lot easier. Add another rule-set for when the element has the `modal-visible` class. This should define its visible behaviour.</li>
    <li>Add an element with the `data-open-modal` attribute and set its value to equal the previously created modal's `id`. When clicked, this will add the `modal-visible` class to the targeted modal and show it.</li>
    <li>**Optionally**, you can add a close button for the modal. By default, it will be closed when its background is clicked, as this is expected modal behaviour. To add a close functionality, simply add any element **inside** the modal and give it the `data-close-modal` attribute.</li>
</ol>

For example, this would be a fully functional modal:

```html
<div id="my-modal" data-modal>
    <p data-close-modal>Close me!</p>
</div>

<p data-open-modal="my-modal">Open the modal!</p>
```

You just need to make sure the modal is invisible by default with CSS and add some styles that show it when it has the `modal-visible` class.

# Remote modals
They rock! Have a 5MB Privacy Policy? Remote modals are the way. No need to demolish your page loading times with something nobody's going to read. **Ever.** Simply load all of that text when the modal is opened. This way, if your visitor isn't interested in your Privacy Policy, he wouldn't have to wait for it to load with your other page elements.

## How do remote modals work?
When the modal is opened, its contents are searched for elements with the `data-modal-remote` attribute. It should hold the URL to the desired resource. However, DOM operations can be costly, especially for large elements. Suppose you decided to actually splatter that Privacy Policy directly in your modal. It could have thousands of elements... searching for an attribute that might not even exist will be a huge overhead.

That's why the remote modal must have the `data-modal-has-remote` attribute. Without it, you'll just be having a regular modal. No DOM searches will be performed whatsoever.

When an element with `data-modal-remote` is found, two things can happen:
<ul>
    <li>If the element is **not** an `<iframe>`, an XHR to the remote URL will be initiated. If its status code is between 200 and 299 (inclusive), the contents of the element will be replaced with the XHR response text.</li>
    <li>If the element **is** an `<iframe>`, its `src` attribute will simply be set to the remote URL specified in `data-modal-remote`.</li>
</ul>

**Note: Remote resources are loaded only once! If you close the modal and open it again, nothing would happen.**

## How to create a remote modal?
It's the same thing as before, but with two additional steps:
<ol>
    <li>Add the `data-modal-has-remote` attribute to your modal.</li>
    <li>Add the `data-modal-remote` attribute to any element **inside** the modal. Its value should be set to the URL of remote resource.</li>
</ol>

This would be a fully functioning remote modal:

```html
<div id="my-modal" data-modal data-modal-has-remote>
    <div data-modal-remote="path/to/my/file.txt">
        Get ready for the content!!!
    </div>
</div>

<p data-open-modal="my-modal">Open the modal!</p>
```

**Note: You can load any file type, as long as it's text. If you're loading HTML, be wary... it may contain harmful `<script>` tags that could inject JavaScript and compromise the security of your site!**

# Styling guide
Here are the CSS classes provided by Modailte that you can use to style your modals.

## Modal classes
Added to the element with attribute `data-modal`.

<ul>
    <li>`modal-visible`: Bread and butter. Added when the modal is opened and removed when it's closed.</li>
    <li>`modal-loading`: Added when the modal starts loading remote resources. Removed when all remote resources in the modal have finished loading or failed to do so</li>
    <li>`modal-loaded`: Added at the same time `modal-loading` is removed.</li>
</ul>

## Remote container classes
Added to all elements with attribute `data-modal-remote`.

<ul>
    <li>`modal-remote-loading`: Added when the remote starts loading. Removed when the remote has loaded or failed to do so.</li>
    <li>`modal-remote-success`: Added when the remote has successfully loaded. Iframes remotes get this class when their `load` event triggers.</li>
    <li>`modal-remote-error`: Added when the XHR response status code wasn't in the 200-299 range. Iframe remotes don't get this class as there is no way to check whether they successfully loaded.</li>
</ul>