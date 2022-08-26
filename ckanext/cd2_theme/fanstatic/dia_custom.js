(function ($) {
    $(document).ready(function() {

        // Tooltips
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })

        // Facets
        // // Toggle facets via input filter
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
        function facetResize(liElements, sectionElement) {
            liElements = document.getElementsByClassName(liElements);
            maxHeight = (liElements.length * 30) + 70;
            if (maxHeight > 300) { maxHeight = 300 }
            document.getElementById(sectionElement).style.height = maxHeight + 'px';

        }

        // Search
        // // Suggest turning 'and' and 'not' into functional parameters
        var input_q = document.getElementById('searchbox');
        input_q.addEventListener('keyup', keywordSearch);
        function keywordSearch() {
            var value_q = input_q.value;
            if (value_q.includes('not') || value_q.includes('and')) {
                $('#searchbox').tooltip('show');
            };
        };

        // // change functional parameters into symbols for clarity
        input_q.addEventListener('keyup', replaceCharacters);
        function replaceCharacters() {
            var value_q = input_q.value;
            var replaced_q = value_q.replace('AND', '&');
            var replaced_q = replaced_q.replace('NOT ', '-');
            document.getElementById('searchbox').value = replaced_q;
        };

        // Range search
        // // Create pill from selected age range, with ability to remove from query string
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
        function removeRange(currentQuery,facetName) {
            var re = new RegExp('[\\s&-]*'+ facetName +':\\[\\d+\\sTO\\s\\d+\\][\\s&-]*');
            newQuery = currentQuery.replace(re, "");
            document.getElementById('searchbox').value = newQuery;
            document.getElementById('dataset-search-form').submit();
        }

        // Front-page
        // // Create styled elements from facets
        function createFacetPills(facets, facetType) {
            var labelPit = "";
            for (const facet of facets) {
                labelPit += '<li><a href="{% url_for "dataset.search" %}?' + facetType + '=' + facet + '" class="category-select">' + facet + '</a></li>';
            }
            return labelPit;
        }

        // // Create modal for constructs or labels on frontpage
        function fillModal(facetLabel,modalTitle) {
                document.getElementById('modalTitle').innerHTML = modalTitle;
                document.getElementById('modalBody').innerHTML = createFacetPills(conKeys, facetLabel);
        }

        // Site-wide search box
        function updateSearchContext ($form) {
            var dataOrContent = $form.find('.search-form-context:checked').val()
            $form.attr('action', dataOrContent === 'datasets' ? '/dataset' : $('.ss-search-url').first().val())
            $form.find('input[type="text"]').attr('name', dataOrContent === 'datasets' ? 'q' : 'Search')
        }

        // Handle search form context switch
        $('.search-form-context').on('change', function (e) {
            updateSearchContext($(this).closest('form'))
        })

        // Initialise search form state
        $('.site-search-wrap').each(function () {
            updateSearchContext($(this))
        })

        $('form.search-form').on('submit', function (e) {
            $(this).find('.search-form-context').attr('disabled', 'disabled')
            return true
        })


        $( "#buttonCollapse" ).on( "click", function() {
            if( $('#buttonCollapse').hasClass('js-nav-open') ) {
                $('#buttonCollapse').removeClass('js-nav-open')
                $('#collapseDiv').css("display", "none");
            } else {
                $('#buttonCollapse').addClass('js-nav-open')
                $('#collapseDiv').css("display", "block");
                $('#collapseDiv').css("height", "auto");
            }
        });

        // .icon-globe and .icon-filter is part of the core ckan codebase
        // instead of copying over a lot of core templates, just applied the aria-hidden here
        $( 'i.icon-globe, i.icon-filter' ).attr('aria-hidden', 'true');

    });
}(jQuery));
