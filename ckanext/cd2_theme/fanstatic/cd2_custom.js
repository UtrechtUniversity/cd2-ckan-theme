// -------------------------------
// CD2 custom JS
// -------------------------------

// Enable tooltips site-wide
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// Search
// // change functional parameters into symbols for clarity
var input_q = document.getElementById('searchbox');
input_q.addEventListener('keyup', replaceCharacters);
function replaceCharacters() {
    var value_q = input_q.value;
    var replaced_q = value_q.replace('AND', '&');
    var replaced_q = replaced_q.replace('NOT ', '-');
    document.getElementById('searchbox').value = replaced_q;
};

// Facets
// // Toggle facets via input filter
// // invoked on snippets/facet_list.html
function facetToggle(facet_input, facet_element) {
    $(facet_input).on('keyup', function () {
        var search = this.value.toLowerCase();
        if (search.length < 2) { var showAll = true } else { showAll = false }
        $(facet_element).each(function () {
            a = this;
            this.style.display = "block";
            if (showAll == false) {
                if (a.innerText.toLowerCase().includes(search) > 0) { this.style.display = "block"; } else { this.style.display = "none"; }
            }
        });
    });
}

// // Resize facet div based on content
// // invoked on snippets/facet_list.html
function facetResize(liElements, sectionElement) {
    liElements = document.getElementsByClassName(liElements);
    maxHeight = (liElements.length * 30) + 70;
    if (maxHeight > 300) { maxHeight = 300 }
    document.getElementById(sectionElement).style.height = maxHeight + 'px';
}

// Range search
// // Create pill from selected age range, with ability to remove from query string
// // invoked on snippets/search_form.html
function createRangePill(facetName,facetMeasure) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams == null) { return; }
    currentQuery = urlParams.get('q');
    if (currentQuery == null) { return; }
    var isRangeSelect = currentQuery.match(facetName,'g');
    var currentRange = currentQuery.match(/\d+/g);
    if (isRangeSelect == null) { return; }
    filterList = document.getElementById('filter-list');
    filterList.innerHTML += `<span class="facet">Median age range: </span>
                                            <span class="filtered pill">` + currentRange[0] + ' to ' + currentRange[1] + ' ' + facetMeasure + ` <a onclick="removeRange(currentQuery,'` + facetName + `')" class="remove" title="Remove"><i class="fa fa-times"></i></a>
                                            </span><input type="hidden" id="facet-range-value" value="`+ currentQuery + `"/>`
};

// // Remove current range from query string before adding new range
// // invoked on snippets/facet_list.html
function removeRange(currentQuery,facetName) {
    var re = new RegExp('[\\s&-]*'+ facetName +':\\[\\d+\\sTO\\s\\d+\\][\\s&-]*');
    newQuery = currentQuery.replace(re, "");
    document.getElementById('searchbox').value = newQuery;
    document.getElementById('dataset-search-form').submit();
}
