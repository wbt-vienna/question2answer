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

initMatomoAnalytics();
function initMatomoAnalytics() {
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["setDoNotTrack", true]);
    _paq.push(["disableCookies"]);
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
        var u="//analytics.wbt.wien/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '4']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
    })();
}