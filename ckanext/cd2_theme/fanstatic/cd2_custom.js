/**  
 * Custom CD2 js
 * 
 */

// Enable tooltips site-wide
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

/**  
 * Replace characters in search fields
 */
var input_q = document.getElementById('searchbox');
if (input_q) { input_q.addEventListener('keyup', replaceCharacters); }
function replaceCharacters() {
    var value_q = input_q.value;
    var replaced_q = value_q.replace('AND', '&');
    var replaced_q = replaced_q.replace('NOT ', '-');
    document.getElementById('searchbox').value = replaced_q;
};

/**  
 * Print all data in debug mode
 */
function getDebugStatus() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams == null) { return false; }
    currentQuery = urlParams.get('debug');
    if (currentQuery == null) { 
        return false; 
    } else if (currentQuery == "true") {
        console.log('debug mode');
        return true;
    } else {
        return false;
    }
};
document.addEventListener("DOMContentLoaded", function (event) {
    if (getDebugStatus()) {
        $(".debug").each( function () {
            $(this).css("display","inherit") 
        }); 
    }
});

/**  
 * Toggle facets-display based on input field value
 * @param facet_input {string} - id of input field
 * @param facet_element {string} - class of li elements
 * invoked on snippets/facet_list.html
 */
function facetToggle(facet_input, facet_element,default_display) {
    $(facet_input).on('keyup', function () {
        var search = this.value.toLowerCase();
        if (search.length < 2) { var showAll = true } else { showAll = false }
        $(facet_element).each(function () {
            a = this;
            this.style.display = default_display;
            if (showAll == false) {
                if (a.innerText.toLowerCase().includes(search) > 0) { this.style.display = default_display; } else { this.style.display = "none"; }
            }
        });
    });
}

/**  
 * Resize facet dropdown based on number of elements
 * @param liElements {string} - class of li elements
 * @param sectionElement {string} - id of section
 * invoked on snippets/facet_list.html
 */
function facetResize(liElements, sectionElement) {
    liElements = document.getElementsByClassName(liElements);
    maxHeight = (liElements.length * 30) + 70;
    if (maxHeight > 300) { maxHeight = 300 }
    document.getElementById(sectionElement).style.height = maxHeight + 'px';
    console.log('element ' + sectionElement + ' resized to ' + maxHeight)
}

/**  
 * Create range pill when age-range is defined
 * @param facetName {string} - backend name of facet 
 * @param facetMeasure {string} - display name of facet
 * @param displayText {string} - display text to prepend
 * invoked on snippets/search_form.html
 */
function createRangePill(facetName,facetMeasure,displayText) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams == null) { return; }
    var currentQuery = urlParams.get('q');
    if (currentQuery == null) { return; }
    var isRangeSelect = currentQuery.match(facetName,'g');
    var currentRange = currentQuery.match(/\d+/g);
    if (isRangeSelect == null) { return; }
    filterList = document.getElementById('filter-list');
    filterList.innerHTML += `<span class="facet">`+ displayText +`: </span>
                                            <span class="filtered pill dropshadow">` + currentRange[0] + ' to ' + currentRange[1] + ' ' + facetMeasure + ` <a onclick="removeRange('` + facetName + `')" class="remove" title="Remove"><i class="fa fa-times"></i></a>
                                            </span><input type="hidden" id="facet-range-value" value="`+ currentQuery + `"/>`
};

/**  
 * Remove range in url
 * @param facetName {string} - backend name of facet
 * invoked on snippets/facet_list.html
 */
function removeRange(facetName) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams == null) { return; }
    var currentQuery = urlParams.get('q');
    if (currentQuery == null) { return; }
    var re = new RegExp('[\\s&-]*'+ facetName +':\\[\\d+\\sTO\\s\\d+\\][\\s&-]*');
    newQuery = currentQuery.replace(re, "");
    document.getElementById('searchbox').value = newQuery;
    document.getElementById('dataset-search-form').submit();
}

/**  
 * Replace range in url with new one
 * @param facetName {string} - backend name of facet
 * @param qstring {string} - new range query string
 * invoked on snippets/facet_list.html
 */
function addQueryToField(facetName,qstring) {
    currentString = window.location.search;
    currentParams = new URLSearchParams(currentString);
    // Check if there is an existing query to replace or append
    if (currentParams.get('q') != null) {
        re = new RegExp('[&\\s]*'+facetName+':\\[\\d+\\sTO\\s\\d+\\][\\s&]*');
        cleanQuery = currentParams.get('q').replace(re, "");
        if (cleanQuery != "") {
            newString = cleanQuery + ' & ' + qstring;
        } else {
            newString = qstring;
        }
    } else {
        newString = qstring;
    }
    document.getElementById('searchbox').value = newString;
    document.getElementById('dataset-search-form').submit();
}     


/**  
 * Create numerical hash of string
 * @param string {string} - input
 */
function hashCode(string){
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**  
 * Get position of current element
 * @param el {object} - element
 */
function tooltipGetOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}


/**  
 * Create tooltip
 * @param el {object} - element
 * @param label {string} - text to display and create ID
 * @param offset {int} - horizontal offset relative to parent element
 */
function tooltipAddElement(el,label,offsetVal,icon) {
    offset = tooltipGetOffset(el);
    if (!document.getElementById("id", hashCode(label) + '_tooltip')) {
        const newDiv = document.createElement("div");
        const newDivArrow = document.createElement("div");
        newDiv.className = 'custom-tooltip';
        newDivArrow.className = 'custom-tooltip-arrow';
        newDiv.setAttribute("id", hashCode(label) + '_tooltip');
        newDivArrow.setAttribute("id", hashCode(label) + '_tooltip-arrow');
        if (icon) {
            newDiv.innerHTML = '<span class="fa fa-'+icon+'"></span> '
        }
        newDiv.innerHTML += label.replace(/(.*?\s.*?\s.*?\s.*?\s.*?\s.*?\s)/g, '$1'+'\n');
        newDiv.style = "white-space: pre;";
        const currentDiv = document.getElementsByClassName('main');
        document.body.appendChild(newDiv); // text balloon
        document.body.appendChild(newDivArrow); // bottom arrow
        
        elementOffset = $(newDiv).height() - 20; 
        $(newDiv).css({top: offset.top - offsetVal - elementOffset, left: offset.left - 10, position:'absolute'});
        $(newDivArrow).css({top: offset.top - offsetVal - 75, left: offset.left, position:'absolute'});
        $(newDiv).animate({'opacity':'1'}, { duration: 200, queue: false });
        $(newDivArrow).animate({'opacity':'1'}, { duration: 200, queue: false });
    }
}

/**  
 * Create tooltip
 * @param label {string} - text to create ID of tooltip element
 */
function tooltipRemoveElement(label) {
  elementID = hashCode(label) + '_tooltip';
  elementIDArrow = hashCode(label) + '_tooltip-arrow';
  if (!document.getElementById("id", elementID)) {
    toRemove = document.getElementById(elementID);
    toRemove.remove();
    toRemoveArrow = document.getElementById(elementIDArrow);
    toRemoveArrow.remove();
  }
}


/**  
 * Create wave subject code legend
 * @param input {string} - subject code
 */
 function createLegendString(input) {
    var dict = new Object();
    dict['C'] = 'Child'
    dict['F'] = 'Father (biological or non-biological)'
    dict['M'] = 'Mother (biological or non-biological)'
    dict['P'] = 'Parent (biological and non-biological, incl. caregivers)'
    dict['S'] = 'Sibling (not part of multiple)'
    dict['I'] = 'Intimate partner of target (usually the child)'
    dict['Q'] = 'Intimate partner of sibling (not part of multiple)'
    dict['E'] = 'Family environment in the household'
    dict['T'] = 'Teacher/tutor'
    dict['B'] = 'Peer of target'
    dict['O'] = 'Observation'
    dict['G'] = 'Extended family'
    dict['R'] = 'Researcher'
    dict['W'] = 'Twin pair'
    dict['MC'] = 'mother-child'
    dict['PC'] = 'parent-child'
    dict['FC'] = 'father-child'
    dict['P1'] = 'Primary parent'
    dict['P2'] = 'Other parent'
    dict['P1C'] = 'primary parent on child'
    dict['P2C'] = 'other parent on child'
    if (input.substring(0,1) == 'O') { // observation
        legendString = dict[input.substring(0,1)] + ' of '  + dict[input.substring(1)]
    } else if (/\d/.test(input)) { // exception for primary and secondary parent
        if (input.includes('P1') || input.includes('P2') && input.length == 4) { 
            if (input.substring(0,2) == input.substring(2)){
                legendString = dict[input.substring(0,2)] + ' on self'
            } else {
                legendString = dict[input.substring(0,2)] + ' on ' + dict[input.substring(2)]
            }
        } else { // primary/secondary on other
            var re = /[P\d]+/g;
            firstPair = input.match(re)
            legendString = dict[firstPair[0]] + ' on ' + dict[input.replace(firstPair[0],'')]
        }
    } else { // if no observation and not a P1/P2 situation
        if (input.length == 1) {
            legendString = dict[input]; // single subject
        } else if (input.length == 2) {
            if (input.substring(0,1) == input.substring(1)) { // subject pair
                legendString = dict[input.substring(0,1)] + ' on self'
            } else {
                legendString = dict[input.substring(0,1)] + ' on ' + dict[input.substring(1)]
            }
        }
    }
return legendString
}




/**  
 * Create construct definitions
 * @param input {string} - construct
 */
function constructLegend(input) {
    let legend = new Object();
    legend['parenting'] = `Performing the role of a parent by care-giving, nurturance, and protection of the child by a natural or substitute parent. The parent supports the child by exercising authority and through consistent, empathic, appropriate behavior in response to the child\\'s needs. PARENTING differs from CHILD REARING in that in child rearing the emphasis is on the act of training or bringing up the children and the interaction between the parent and child, while parenting emphasizes the responsibility and qualities of exemplary behavior of the parent.`
    legend['physiology'] = `The science of the functions of organisms, including the chemical and physical processes involved and the activities of the cells, tissues, and organs, including anatomical and structural factors.`
    legend['physical health'] = `The condition of your body, taking into consideration everything from the absence of disease to fitness level. Physical health is critical for overall well-being, and can be affected by lifestyle (diet, level of physical activity, and behaviour), human biology (a person\\'s genetics and physiology may make it easier or harder to achieve good physical health), environment (our surroundings and exposure to factors such as sunlight or toxic substances), and healthcare service (good healthcare can help prevent illness, as well as detect and treat illness)`
    legend['mental health'] = `Emotional, psychological, and social well-being of an individual or group.`
    legend['demographics'] = `Demographics refers to the study of human populations and their characteristics. Demographic information is a population-based description of factors such as age, race, sex, occupation, and socioeconomic status.`
    legend['personality'] = `The enduring configuration of characteristics and behavior that comprises an individual\\'s unique adjustment to life, including major traits, interests, drives, values, self-concept, abilities, and emotional patterns.`
    legend['cognition'] = `All forms of knowing and awareness, such as perceiving, conceiving, remembering, reasoning, judging, imagining, and problem solving.`
    legend['lifestyle'] = `The typical way of life or manner of living that is characteristic of an individual or group, as expressed by behaviors, attitudes, interests, and other factors.`
    legend['life history'] = `A history of important life events such as the birth of children, death of family members, and other significant characteristics of someone\\'s life such as illness, jobs, moving to another place, and others.`
    legend['sociocognitive and emotional development'] = `Changes and growth in how children learn to understand, react to, and reflect on others as well as on themselves. Sociocognitive and emotional development includes the development trajectories of social and cognitive skills (e.g., language, emotion regulation, empathy and self-identity) that are important capabilities to function in society.`
    legend['relationships'] = `A continuing and often committed association between two or more people, as in a family, friendship, marriage, partnership, or other interpersonal link in which the participants have some degree of influence on each other\\'s thoughts, feelings, and actions.`
    legend['work and school'] = `This category contains measures that are related to someone\\'s occupational activities and educational activities.`
    return legend[input];    
}