"use strict";

window.Modalite = (function () {
    var _prefix = "modalite"
    ,   _class_modal_visible  = "is-visible"
    ,   _class_modal_loading  = "is-loading"
    ,   _class_modal_loaded   = "is-loaded"
    ,   _class_remote_success = "is-remote-success"
    ,   _class_remote_error   = "is-remote-error"
    ,   _class_remote_loading = "is-remote-loading"
    ,   _attr_modal_remote     = "data-" + _prefix + "-remote"
    ,   _attr_modal_has_remote = "data-" + _prefix + "-has-remote"
    ,   _attr_modal_open       = "data-" + _prefix + "-open"
    ,   _attr_modal_close      = "data-" + _prefix + "-close"
    ,   _attr_modal            = "data-" + _prefix + "-modal"
    ,   _zindex = 9999;

    /**
     * Opens an XHR to a URL and writes the response text in an element. Also
     * adds loading, success and error classes accordingly.
     * @param  {object} elem DOM element in which to write the response text.
     * @param  {string} url  Resource to request.
     * @return {object}      The XHR request.
     */
    function _loadXHR(elem, url) {
        var req = new XMLHttpRequest();

        req.addEventListener("load", function () {
            if (this.status >= 200 && this.status < 300) {
                elem.classList.add(_class_remote_success);
                elem.classList.remove(_class_remote_error);
            } else {
                elem.classList.add(_class_remote_error);
            }

            elem.innerHTML = req.responseText;
        });

        req.addEventListener("error", function () {
            elem.classList.add(_class_remote_error);
        });

        req.addEventListener("loadstart", function () {
            elem.classList.add(_class_remote_loading);
        })

        req.addEventListener("loadend", function () {
            elem.classList.remove(_class_remote_loading);
        });

        req.open("GET", url);
        req.send();

        return req;
    }

    /**
     * Loads a URL in an <iframe> and adds loading and success classes
     * accordingly.
     * @param  {object} elem The <iframe> element to load.
     * @param  {string} url  Resource to load in the <iframe>.
     */
    function _loadIframe(elem, url) {
        elem.src = url;
        elem.classList.add(_class_remote_loading);

        elem.addEventListener("load", function () {
            elem.classList.add(_class_remote_success);
            elem.classList.remove(_class_remote_loading);
        });
    }

    /**
     * Loads a modal remote, <iframe> or not.
     * @param  {object}   container   DOM element with the load remote
     * attribute.
     * @param  {string}   resource    Remote resource URI.
     * @param  {function} onLoadStart Function to invoke when the load starts.
     * @param  {function} onLoadEnd   Function to invoke when the load ends.
     */
    function _loadRemote(container, resource, onLoadStart, onLoadEnd) {
        onLoadStart();

        if (resource.length === 0) {
            onLoadEnd();
            return;
        }

        if (container.tagName === "IFRAME") {
            _loadIframe(container, resource);
            container.addEventListener("load", onLoadEnd);
        } else {
            _loadXHR(container, resource).addEventListener("loadend", onLoadEnd);
        }
    }

    /**
     * Searches a modal for elements with the remote attribute set and loads
     * them, if they weren't already successfully loaded.
     * @param  {object} modal         The modal DOM element.
     * @param  {function} onLoadStart Function to invoke when the load starts.
     * @param  {function} onLoadEnd   Function to invoke when the load ends.
     */
    function _loadModalRemotes(modal, onLoadStart, onLoadEnd) {
        [].forEach.call(modal.getElementsByTagName("*"), function (child) {
            var resource = child.getAttribute(_attr_modal_remote);

            if (
                typeof resource === "string" &&
                !child.classList.contains(_class_remote_success)
            ) {
                _loadRemote(child, resource, onLoadStart, onLoadEnd);
            }
        });
    }

    /**
     * Loads all remotes of a modal and adds loading/loaded classes.
     * @param  {object} modal The modal DOM element.
     */
    function _loadModal(modal) {
        var resources = 0;

        _loadModalRemotes(
            modal,

            // load start
            function () {
                resources += 1;
            },

            // load end
            function () {
                resources -= 1;
                if (resources <= 0) {
                    modal.classList.remove(_class_modal_loading);
                    modal.classList.add(_class_modal_loaded);
                }
            }
        );

        if (resources > 0) {
            modal.classList.add(_class_modal_loading);
        }
    }

    function _isModal(modal) {
        return (modal && modal.getAttribute(_attr_modal) !== null);
    }

    /**
     * Change a modal's remotes in ascending order.
     * @param {object} modal  The DOM modal element.
     * @param {array} remotes Remote URIs
     */
    function setRemotes(modal, remotes) {
        var remotesCount = 0,
            modalReset = false;

        if (modal.getAttribute(_attr_modal_has_remote) === null) {
            return false;
        }

        [].forEach.call(modal.getElementsByTagName("*"), function (child, i) {
            var attrRemote = child.getAttribute(_attr_modal_remote);

            if (attrRemote !== null) {
                var newRemote = remotes[remotesCount] || "";

                if (attrRemote !== newRemote) {
                    // If the new remote URI is different and not empty, reset
                    // the modal because there's something new to load.
                    if (newRemote.length && !modalReset) {
                        modal.classList.remove(_class_modal_loading);
                        modal.classList.remove(_class_modal_loaded);
                        modalReset = true;
                    }

                    child.setAttribute(_attr_modal_remote, newRemote);
                    child.classList.remove(_class_remote_success);
                    child.classList.remove(_class_remote_loading);
                    child.classList.remove(_class_remote_error);
                    
                    child.innerHTML = "";
                }

                remotesCount++;
            }
        });

        return true;
    }

    /**
     * Adds the visibility class to a modal and loads its remotes.
     * @param  {object} modal The modal DOM element or its ID attribute.
     */
    function openModal(modal) {
        if (!_isModal(modal) || modal.classList.contains(_class_modal_visible)) {
            return false;
        }

        modal.classList.add(_class_modal_visible);
        modal.style.zIndex = _zindex++;

        if (
            modal.getAttribute(_attr_modal_has_remote) !== null &&
            modal.classList.contains(_class_modal_loading) === false &&
            modal.classList.contains(_class_modal_loaded) === false
        ) {
            _loadModal(modal);
        }

        return true;
    }

    /**
     * Removes the visibility class from a modal.
     * @param  {object} modal The DOM modal element.
     */
    function closeModal(modal) {
        if (_isModal(modal) && modal.classList.contains(_class_modal_visible)) {
            modal.classList.remove(_class_modal_visible);
            return true;
        }

        return false;
    }

    document.addEventListener("click", function (event) {
        var target = event.srcElement || event.target; // event.target for Mozilla    

        // If the target has the modal attribute, that means it's the modal
        // itself, so it must be closed, as this is expected modal behaviour.
        if (target.getAttribute(_attr_modal) !== null) {
            closeModal(target);
            return;
        }

        var attrOpen = target.getAttribute(_attr_modal_open);
        if (attrOpen) {
            var index = attrOpen.indexOf("@"),
                modalID = attrOpen,
                remotes;

            if (index !== -1) {
                modalID = attrOpen.substr(0, index);
                remotes = attrOpen.substr(index + 1).split(",");
            }

            var modal = document.getElementById(modalID);
            if (modal) {
                if (remotes) {
                    setRemotes(modal, remotes);
                }

                if (openModal(modal)) {
                    // Stop processing so that if the current element has both the
                    // open and close attributes set to the same modal, it could
                    // toggle it.
                    return;
                }
            }
        }

        var attrClose = target.getAttribute(_attr_modal_close);
        if (attrClose !== null) {
            if (attrClose.length > 0) {
                // If the attribute contains a string, it's probably the ID of the
                // modal that should be closed.

                var modal = document.getElementById(attrClose);
                if (modal) {
                    closeModal(modal);
                }
            } else {
                // If the clicked element has the close attribute, but with an
                // empty value, then it's sitting inside a modal and it should
                // be closed.

                var parent = target.parentNode;
                while (parent && parent !== document.body) {
                    if (parent.getAttribute(_attr_modal) !== null) {
                        closeModal(parent);

                        // Break the loop so that if the modal is nested, the
                        // parent modals won't be closed.
                        break;
                    }

                    parent = parent.parentNode;
                }
            }
        }
    });

    return {
        open: openModal,
        close: closeModal,
        setRemotes: setRemotes
    };
})();