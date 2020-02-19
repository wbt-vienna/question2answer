function qa_init_vue_tag_selector(baseElem) {
    new window.Vue({
        el: '#tag_hints',
        components: {
            'tag-selector': window.httpVueLoader('./qa-content/vue/tagSelector.vue')
        },
    })
}