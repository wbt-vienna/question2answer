function qa_init_vue_tag_selector(baseElem) {
    new window.Vue({
        el: '#tag_hints',
        components: {
            'tag-selector': window.httpVueLoader('./qa-content/vue/tagSelector.vue')
        },
    })
}

window.addEventListener('load', function () {
    $.get('https://tags.asterics-foundation.org:4000/tags', null, function(tags) {
        $('.qa-tag-link').each((index, element) => {
            let elem = $(element);
            let id = elem.text();
            elem.text(tagUtil.getLabel(id, tags));
            elem.css(tagUtil.getColorStyleObject(id, tags));
            elem.show();
        });
    });
});