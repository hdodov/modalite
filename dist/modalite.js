(function () {
    var _modalShowClass = "modal-visible",
        _zIndex = 9999;

    document.addEventListener("click", function (evt) {
        var target = evt.srcElement || evt.target, // evt.target for Mozilla
            attrModal = target.getAttribute("data-modal"),
            attrOpen = target.getAttribute("data-open-modal"),
            attrClose = target.getAttribute("data-close-modal");

        if (attrModal != null) {
            target.classList.remove(_modalShowClass);
        }

        if (attrOpen && attrOpen.length > 0) {
            var modal = document.getElementById(attrOpen);

            if (modal) {
                modal.classList.add(_modalShowClass);
                if (modal.style) {
                    modal.style.zIndex = _zIndex;
                    _zIndex += 1;
                }
            }
        }

        if (attrClose !== null) {
            var parent = target.parentNode;

            while (parent && parent !== document.body) {
                if (parent.getAttribute("data-modal") !== null) {
                    parent.classList.remove(_modalShowClass);
                    break;
                }

                parent = parent.parentNode;
            }
        }
    });
})();