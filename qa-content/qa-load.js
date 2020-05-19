window.addEventListener('load', function () {
    var alertElem = $("*[role='alert']")[0];
    if (alertElem) {
        var innerHTML = alertElem.innerHTML;
        alertElem.innerHTML = '';
        setTimeout(function () {
            alertElem.innerHTML = innerHTML;
            alertElem.focus();
        }, 300);
    }
});