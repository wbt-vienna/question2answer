<template>
    <div>
        <div>
            <div>
                <button type="button" class="tagButton" title="Tag löschen" @click="removeTag(tagId)" v-for="tagId in relevantTags" :style="tagUtil.getColorStyle(tagId, tags)">X {{tagUtil.getLabel(tagId, tags)}}</button>
                <span v-if="relevantTags.length === 0">(keine)</span>
            </div>
            <a href="javascript:;" @click="removeAll">alle löschen</a>
        </div>
        <div style="margin-top: 1em; margin-bottom: 1.5em">
            <span>Tags wählen</span> <a href="javascript:;" @click="selectTags = startTags">alle anzeigen</a>
            <div>
                <button type="button" class="tagButton" title="Tag wählen" @click="addTag(tag.id)" v-for="tag in selectTags" :style="tagUtil.getColorStyle(tag.id, tags)">+ {{tag.labelDE}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        props: {
        },
        computed: {
            relevantTags: function () {
                return this.elementTags.filter(tag => this.allChildren.indexOf(tag) !== -1);
            },
            isValid: function () {
                return this.relevantTags.length > 0;
            }
        },
        data() {
            return {
                elementTags: [],
                startTags: null,
                selectTags: null,
                allChildren: [],
                tagUtil: tagUtil
            }
        },
        methods: {
            addTag(tagId, fromExternal) {
                if (this.allChildren.indexOf(tagId) === -1) {
                    return;
                }
                var parentIds = tagUtil.getAllParentIds(tagId, this.tags);
                var childIds = tagUtil.getAllChildIds(tagId, this.tags);
                var hasAlreadyChild = childIds.reduce((total, currentId) => {
                    return total || this.elementTags.indexOf(currentId) !== -1;
                }, false);
                if (!hasAlreadyChild && (!tagUtil.getTag(tagId, this.tags).notAssignable)) {
                    this.elementTags.push(tagId);
                }
                this.elementTags = this.elementTags.filter(existingId => parentIds.indexOf(existingId) === -1);
                this.selectTags = tagUtil.getAllChildren(tagId, this.tags, 1);
                if (fromExternal || this.selectTags.length === 0) {
                    this.selectTags = this.startTags;
                }
                this.elementTags = [...new Set(this.elementTags)];
                this.elementTags.sort();
                this.emitChange();
            },
            removeTag(tagId) {
                this.elementTags = this.elementTags.filter(existingId => tagId !== existingId);
                if (this.relevantTags.length === 0) {
                    this.selectTags = this.startTags;
                }
                this.emitChange();
            },
            removeAll() {
                this.selectTags = this.startTags;
                this.elementTags = this.elementTags.filter(tagId => this.relevantTags.indexOf(tagId) === -1);
                this.emitChange();
            },
            emitChange() {
                var elem = document.getElementById('tags');
                elem.value = this.elementTags.reduce((total, tag) => {
                    return total + tag + " ";
                }, "");
                this.$emit('input', this.elementTags);
                this.$emit('change', this.elementTags);
            }
        },
        mounted() {
            var thiz = this;
            var tags = JSON.parse(qa_all_tags);
            var tagInput = document.getElementById('tags');
            var value = tagInput.value ? tagInput.value.toUpperCase() : tagInput.value;
            thiz.elementTags = value ? value.split(' ') : [];
            thiz.tags = tags;
            thiz.startTagIds = ['ACCESSIBILITY', 'META'];
            thiz.startTags = thiz.selectTags = tagUtil.getAllChildren(thiz.startTagIds, thiz.tags, 1);
            thiz.allChildren = tagUtil.getAllChildIds(thiz.startTagIds, thiz.tags);
            thiz.elementTags.sort();
        }
    }
</script>

<style scoped>
    .tagButton {
        padding: 0 5px 0 5px;
        margin: 2px;
        font-size: 1.4em;
        border: none;
        border-radius: 2px;
    }

    span, a {
        font-size: 1.2em;
    }
</style>