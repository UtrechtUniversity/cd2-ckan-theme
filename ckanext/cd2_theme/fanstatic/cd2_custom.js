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
 * Remove range in url before defining new one
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
function tooltipAddElement(el,label,offsetVal) {
    offset = tooltipGetOffset(el);
    if (!document.getElementById("id", hashCode(label) + '_tooltip')) {
        const newDiv = document.createElement("div");
        const newDivArrow = document.createElement("div");
        newDiv.className = 'custom-tooltip';
        newDivArrow.className = 'custom-tooltip-arrow';
        newDiv.setAttribute("id", hashCode(label) + '_tooltip');
        newDivArrow.setAttribute("id", hashCode(label) + '_tooltip-arrow');
        const newContent = document.createTextNode(label.replace(/(.*?\s.*?\s.*?\s.*?\s.*?\s)/g, '$1'+'\n')); // line endings for longer strings
        newDiv.appendChild(newContent);
        newDiv.style = "white-space: pre;";
        const currentDiv = document.getElementsByClassName('main');
        document.body.appendChild(newDiv); // text balloon
        document.body.appendChild(newDivArrow); // bottom arrow
        
        elementOffset = $(newDiv).height() - 20; 
        $(newDiv).css({top: offset.top - offsetVal - elementOffset, left: offset.left - 10, position:'absolute'});
        $(newDivArrow).css({top: offset.top - offsetVal - 78, left: offset.left, position:'absolute'});
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
    dict['OMC'] = 'Observation of mother-child'
    dict['OPC'] = 'Observation of parent-child'
    dict['OFC'] = 'Observation of father-child' 
    dict['OC'] = 'Observation of child (by researcher-assistant)'
    dict['OP'] = 'observation of parent (by researcher-assistant)'
    dict['PS'] = 'Parent (biological or non-biological) on sibling (not part of multiple)'
    dict['P1'] = 'Primary parent'
    dict['P2'] = 'Other parent'
    if (input == 'PS') {
        legendString = dict['PS'];
    } else {
        if (/\d/.test(input)) { // exception for primary and secondary parent
            if (input.includes('P1') && input.includes('P2')) { 
                legendString = dict[input.substring(0,2)] + ' on ' + dict[input.substring(2)]
            }
        } else {
            inputChar = input.split('');
            if (inputChar[0]== 'O') { // observations
                if (input.length == 3 || input.length == 2) {
                    legendString = dict[input] 
                }
            } else if (input.length == 1) { // single element
                legendString = dict[inputChar[0]]
            } else { // subject on subject
                if (inputChar[0] == inputChar[1]) {
                    legendString = dict[inputChar[0]] + ' on self'
                } else {
                    legendString = dict[inputChar[0]] + ' on ' + dict[inputChar[1]]
                }
            } 
        }
    }
    return legendString
}

/**  
 * Display months on slider as years
 */
function convertMonthstoYears() {
    tooltips = document.getElementsByClassName('rs-tooltip');
    for (tooltip of tooltips) {
        newVal = tooltip.innerHTML/12
        tooltip.innerHTML = newVal.toFixed(1)
    }
}
