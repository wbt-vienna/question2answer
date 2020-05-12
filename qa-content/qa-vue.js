function qa_init_vue_tag_selector(baseElem) {
    new window.Vue({
        el: '#tag_hints',
        components: {
            'tag-selector': window.httpVueLoader(qa_root + 'qa-content/vue/tagSelector.vue')
        },
    })
}

window.addEventListener('load', function () {
    let tags = JSON.parse(qa_all_tags);
    $('.qa-tag-link').each((index, element) => {
        let elem = $(element);
        if (tags) {
            let id = elem.text();
            elem.text(tagUtil.getLabel(id, tags));
            elem.css(tagUtil.getColorStyleObject(id, tags));
        }
        elem.show();
    });
    $('h1').each((i, element) => {
        let elem = $(element);
        let searchString = 'Fragen mit Tag "'
        let text = elem.text();
        let index = text.indexOf(searchString);
        if (index !== -1 && tags) {
            let id = text.substring(17, text.lastIndexOf('"'));
            elem.text(searchString + tagUtil.getLabel(id, tags) + '"');
        }
        elem.show();
    });
});