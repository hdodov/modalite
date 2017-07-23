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
                    <li>Add an element with the <code class="emp">data-modal</code> attribute and give it an <code>id</code>. Style it so that it's hidden. You can use the <code>visibility</code> CSS property. It's good for the job, because it's affected by transitions and makes animations a whole lot easier. Add another rule-set for when the element has the <code>modal-visible</code> class. This should define its visible behaviour.</li>
                    <li>Add an element with the <code class="emp">data-open-modal</code> attribute and set its value to equal the previously created modal's <code>id</code>. When clicked, this will add the <code>modal-visible</code> class to the targeted modal and show it.</li>
                    <li><b>Optionally</b>, you can add a close button for the modal. By default, it will be closed when its background is clicked, as this is expected modal behaviour. To add a close functionality, simply add any element <b>inside</b> the modal and give it the <code class="emp">data-close-modal</code> attribute.</li>
                </ol>

For example, this would be a fully functional modal:

```html
<div id="my-modal" data-modal>
    <p data-close-modal>Close me!</p>
</div>

<p data-open-modal="my-modal">Open my modal</p>
```

You just need to make the modal invisible by default with CSS and add some styles that show it when it has the `modal-visible` class.
