let tagUtil = {};

/**
 * retrieves a tag object
 * @param tagIdOrTag the ID of the tag object or the tag object
 * @param tags array of all tag objects
 * @return {null|{id}|*} tagIdOrTag if it already is a tag object, otherwise the object with the given ID from the tags array parameter
 */
tagUtil.getTag = function (tagIdOrTag, tags) {
    let returnValue = null;
    if (tagIdOrTag && tagIdOrTag.id) {
        returnValue = tagIdOrTag;
    }
    if (tags && typeof tagIdOrTag === 'string' || tagIdOrTag instanceof String) {
        returnValue = tags.filter(tag => tag.id === tagIdOrTag)[0];
    }
    return returnValue ? returnValue : tagUtil.getTagFromLabel(tagIdOrTag, tags);
};

tagUtil.getTagFromLabel = function(label, tags) {
    return tags.filter(tag => tagUtil.getLabel(tag, tags) === label)[0];
};

tagUtil.getAllChildren = function (tagIdOrTag, tags, maxDepth) {
    let result = [];
    tagIdOrTag = tagIdOrTag instanceof Array ? tagIdOrTag : [tagIdOrTag];
    tagIdOrTag.forEach(tagId => {
        result = result.concat(getAll(tagId, tags, true, maxDepth))
    });
    return result;
};

tagUtil.getAllParents = function (tagIdOrTag, tags, maxDepth) {
    return getAll(tagIdOrTag, tags, false, maxDepth);
};

tagUtil.getAllChildIds = function (tagIdOrTag, tags, maxDepth) {
    return tagUtil.getAllChildren(tagIdOrTag, tags, maxDepth).map(child => child.id);
};

tagUtil.getAllParentIds = function (tagIdOrTag, tags, maxDepth) {
    return tagUtil.getAllParents(tagIdOrTag, tags, maxDepth).map(parent => parent.id);
};

/**
 * returns all possible new relatives (children or parents) for a given tag
 * @param tagIdOrTag the ID of the tag object or the tag object
 * @param tags array of all tag objects
 * @return {*}
 */
tagUtil.getPossibleNewRelatives = function(tagIdOrTag, tags) {
    let childrenIds = tagUtil.getAllChildIds(tagIdOrTag, tags);
    let parentIds = tagUtil.getAllParentIds(tagIdOrTag, tags);
    return tags.filter(tag => childrenIds.indexOf(tag.id) === -1 && parentIds.indexOf(tag.id) === -1);
};

tagUtil.getLabel = function (tagIdOrTag, tags) {
    let tag = tagUtil.getTag(tagIdOrTag, tags);
    if (!tag) {
        return tagIdOrTag;
    }
    return tag.labelDE ? tag.labelDE : tag.id;
};

tagUtil.getColor = function (tagIdOrTag, tags) {
    let tag = tagUtil.getTag(tagIdOrTag, tags);
    if (tag && !tag.color && tag.parents[0]) {
        return tagUtil.getColor(tag.parents[0], tags);
    }
    return tag ? tag.color : '';
};

tagUtil.getColorStyle = function(tagIdOrTag, tags) {
    let color = tagUtil.getColor(tagIdOrTag, tags);
    let highContrastColor = getHighContrastTextColor(color);
    return  `background-color: ${color}; color: ${highContrastColor};`;
};

tagUtil.getColorStyleObject = function(tagIdOrTag, tags) {
    let color = tagUtil.getColor(tagIdOrTag, tags);
    let highContrastColor = getHighContrastTextColor(color);
    return {
        "background-color": color,
        color: highContrastColor
    }
};

tagUtil.sortTags = function (tagIdsOrTags, tags, returnIds) {
    let tagObjects = tagIdsOrTags.map(idOrTag => tagUtil.getTag(idOrTag, tags));
    tagObjects.sort((a,b) => (a.labelDE || a.id).localeCompare(b.labelDE));
    return returnIds ? tagObjects.map(e => e.id) : tagObjects;
};

/**
 * returns the number of times the given tag is a child of any other element
 * @param tagIdOrTag
 * @param tags
 * @return {number}
 */
tagUtil.getUsageCount = function (tagIdOrTag, tags) {
    let searchTag = tagUtil.getTag(tagIdOrTag, tags);
    let count = 0;
    tags.forEach(tag => {
        if (tag.children.indexOf(searchTag.id) !== -1) {
            count++;
        }
    });
    return count;
};

/**
 * deletes a given Tag from the list of all tags
 * @param tagIdOrTag
 * @param parentTagIdOrTag the parentTag to definre the location where to remove the given tag
 * @param tags
 * @return {number}
 */
tagUtil.deleteTag = function (tagIdOrTag, parentTagIdOrTag, tags) {
    let deleteTag = tagUtil.getTag(tagIdOrTag, tags);
    let initialUsageCount = tagUtil.getUsageCount(deleteTag, tags);
    if (initialUsageCount === 1 && deleteTag.children.length > 0) {
        log.warn('cannot completely remove tags with children, aborting...');
        return tags;
    }
    let parentTag = tagUtil.getTag(parentTagIdOrTag, tags);
    parentTag.children = parentTag.children.filter(childId => childId !== deleteTag.id);
    deleteTag.parents = deleteTag.parents.filter(parentId => parentId !== parentTag.id);
    if (initialUsageCount === 1) {
        tags = tags.filter(tag => tag.id !== deleteTag.id);
    }
    return tags;
};

tagUtil.anyParentHasProperty = function (tagIdOrTag, tags, propertyNames) {
    propertyNames = propertyNames instanceof Array ? propertyNames : [propertyNames];
    let allParents = tagUtil.getAllParents(tagIdOrTag, tags);
    return allParents.reduce((result, tag) => {
        propertyNames.forEach(property => {
            result = result || !!tag[property];
        });
        return result;
    }, false);
};

tagUtil.getTagsWithProperty = function (propertyName, tags) {
    let result = [];
    tags.forEach(tag => {
        if (tag[propertyName]) {
            result.push(tag);
        }
    });
    return result;
};

function getAll(tagIdOrTag, tags, getChildren, maxDepth) {
    let tag = tagUtil.getTag(tagIdOrTag, tags);
    if (!tag) {
        return [];
    }
    let allRelatives = [];
    let type = getChildren ? 'children' : 'parents';
    tag[type].forEach(relativeId => {
        let relative = tagUtil.getTag(relativeId, tags);
        allRelatives.push(relative);
        if (!maxDepth || maxDepth > 1) {
            let newDepth = !maxDepth ? maxDepth : maxDepth - 1;
            allRelatives = allRelatives.concat(getAll(relative, tags, getChildren, newDepth));
        }
    });
    return [...new Set(allRelatives)];
}

function getHighContrastTextColor(hexBackground) {
    if (!hexBackground) {
        return '';
    }
    let rgb = hexToRgb(hexBackground);
    let val = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
    if (val > 149) {
        return '#000000';
    } else {
        return '#ffffff'
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

window.tagUtil = tagUtil;