(function () {
    var _class_remote_success = "modal-remote-success"
    ,   _class_remote_error   = "modal-remote-error"
    ,   _class_remote_loading = "modal-remote-loading"
    ,   _class_modal_loading  = "modal-loading"
    ,   _class_modal_loaded   = "modal-loaded"
    ,   _class_modal_visible  = "modal-visible"

    ,   _attr_modal_remote     = "data-modal-remote"
    ,   _attr_modal_has_remote = "data-modal-has-remote"
    ,   _attr_modal_open       = "data-open-modal"
    ,   _attr_modal_close      = "data-close-modal"
    ,   _attr_modal            = "data-modal"

    ,   _zIndex = 9999;

    function loadXHR(elem, url) {
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

    function loadIframe(elem, url) {
        elem.classList.add(_class_remote_loading);

        elem.addEventListener("load", function () {
            elem.classList.add(_class_remote_success);
            elem.classList.remove(_class_remote_loading);
        });
        
        elem.src = url;
    }

    function loadRemote(container, onLoadStart, onLoadEnd) {
        var resource = container.getAttribute(_attr_modal_remote);

        if (resource && resource.length > 0) {
            onLoadStart();

            if (container.tagName === "IFRAME") {
                loadIframe(container, resource);
                container.addEventListener("load", onLoadEnd);
            } else {
                request = loadXHR(container, resource);
                request.addEventListener("loadend", onLoadEnd);
            }
        }
    }

    function loadModalRemotes(modal, onLoadStart, onLoadEnd) {
        var children = modal.getElementsByTagName("*");

        for (var i = 0; i < children.length; i++) {
            if (!children[i].classList.contains(_class_remote_success)) {
                loadRemote(children[i], onLoadStart, onLoadEnd);
            }
        }
    }

    function loadModal(modal) {
        var resources = 0;

        loadModalRemotes(
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

    function openModal(modal) {
        modal.classList.add(_class_modal_visible);
        if (modal.style) {
            modal.style.zIndex = _zIndex;
            _zIndex += 1;
        }

        if (
            modal.getAttribute(_attr_modal_has_remote) !== null &&
            modal.classList.contains(_class_modal_loading) === false &&
            modal.classList.contains(_class_modal_loaded) === false
        ) {
            loadModal(modal);
        }
    }

    function closeModal(modal) {
        modal.classList.remove(_class_modal_visible);
    }

    document.addEventListener("click", function (evt) {
        var target = evt.srcElement || evt.target, // evt.target for Mozilla
            attrOpen = target.getAttribute(_attr_modal_open);

        if (target.getAttribute(_attr_modal) != null) {
            closeModal(target);
        }

        if (attrOpen && attrOpen.length > 0) {
            var modal = document.getElementById(attrOpen);

            if (modal) {
                openModal(modal);
            }
        }

        if (target.getAttribute(_attr_modal_close) !== null) {
            var parent = target.parentNode;

            while (parent && parent !== document.body) {
                if (parent.getAttribute(_attr_modal) !== null) {
                    closeModal(parent);
                    break;
                }

                parent = parent.parentNode;
            }
        }
    });
})();