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
 * Custom tooltips that float above the divs
 */
function tooltipGetOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }
function tooltipAddElement(el,text) {
    offset = tooltipGetOffset(el);
    console.log(offset);

    if (!document.getElementById("id", text + '_tooltip')) {
        const newDiv = document.createElement("div");
        newDiv.className = 'custom-tooltip';
        newDiv.setAttribute("id", text + '_tooltip');
        const newContent = document.createTextNode(text);
        newDiv.appendChild(newContent);
        const currentDiv = document.getElementsByClassName("main");
        document.body.insertBefore(newDiv, currentDiv[0]);
        $(newDiv).css({top: offset.top, left: offset.left, position:'absolute'});
        $(newDiv).animate({'opacity':'1'}, 500);
    }
}


function tooltipRemoveElement(text) {
    elementID = text + '_tooltip';
    console.log(elementID)
    toRemove = document.getElementById(elementID);
    toRemove.remove();
}