function qa_init_vue_tag_selector(baseElem) {
    new window.Vue({
        el: '#tag_hints',
        components: {
            'tag-selector': window.httpVueLoader(qa_root + 'qa-content/vue/tagSelector.vue')
        },
    })
}

window.addEventListener('load', function () {
    var tags = JSON.parse(qa_all_tags);
    $('.qa-tag-link').each((index, element) => {
        var elem = $(element);
        if (tags) {
            var id = elem.text();
            elem.text(tagUtil.getLabel(id, tags));
            elem.css(tagUtil.getColorStyleObject(id, tags));
        }
        elem.show();
    });
    $('h1').each((i, element) => {
        var elem = $(element);
        var searchString = 'Fragen mit Tag "'
        var text = elem.text();
        var index = text.indexOf(searchString);
        if (index !== -1 && tags) {
            var id = text.substring(17, text.lastIndexOf('"'));
            elem.text(searchString + tagUtil.getLabel(id, tags) + '"');
        }
        elem.show();
    });
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