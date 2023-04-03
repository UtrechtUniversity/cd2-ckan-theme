/**  
 * Custom CD2 js
 * 
 */

/**  
 * Replace characters in search fields
 */
var input_q = document.getElementById('searchbox');
if (input_q) { input_q.addEventListener('keyup', replaceCharacters); }
function replaceCharacters() {
    var value_q = input_q.value;
    var replaced_q = value_q.replace('AND ', '& ');
    var replaced_q = replaced_q.replace('NOT ', '- ');
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
        const elements = document.querySelectorAll(".debug");
        elements.forEach(function (el) {
            el.style.display = "inherit";
        });
    }
});

/**  
 * Toggle facets-display based on input field value
 * @param facet_input {string} - id of input field
 * @param facet_element {string} - class of li elements
 * invoked on snippets/facet_list.html
 */
function facetToggle(facet_input,facet_element,default_display) {
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
 * @param offsetVal {int} - vertical offset relative to parent element
 * @param icon {string} - (optional) font awesome icon to display
 */
function tooltipAddElement(el, label, offsetVal, icon) {
    const offset = tooltipGetOffset(el);
    const tooltipId = hashCode(el.outerHTML) + "_tooltip"; // unique reference to element by hashing outerHTML
    if (!document.getElementById(tooltipId)) {

        const newDiv = document.createElement("div");
        newDiv.classList.add("text-balloon");
        newDiv.id = tooltipId;
        newDiv.style.left = `${offset.left}px`;
        newDiv.style.top = `${offset.top}px`;   

        const newContent = document.createElement("div");
        newContent.classList.add("text-balloon-content");
        
        if (icon) {
            newContent.innerHTML = `<span class="fa fa-${icon}"></span> `;
        }
        newContent.innerHTML += label;
        newDiv.appendChild(newContent);
        document.body.appendChild(newDiv);

        const elementHeight = newDiv.offsetHeight;
        newDiv.style.top = `${offset.top - elementHeight - offsetVal + 20}px`;
        newDiv.animate({ opacity: 1 }, { duration: 200, queue: false });
    }
}


/**  
 * Remove tooltip
 * @param el {object} - parent element
 */
function tooltipRemoveElement(el) {
    const elementID = `${hashCode(el.outerHTML)}_tooltip`;
    const elementToRemove = document.getElementById(elementID);
    if (elementToRemove) {
        elementToRemove.remove();
    }
}

/**  
 * Create wave subject code legend
 * @param input {string} - subject code
 */
function createLegendString(input) {
    const dict = {
        'C': 'Child',
        'F': 'Father (biological or non-biological)',
        'M': 'Mother (biological or non-biological)',
        'P': 'Parent (biological and non-biological, incl. caregivers)',
        'S': 'Sibling (not part of multiple)',
        'I': 'Intimate partner of target (usually the child)',
        'Q': 'Intimate partner of sibling (not part of multiple)',
        'E': 'Family environment in the household',
        'T': 'Teacher/tutor',
        'B': 'Peer of target',
        'O': 'Observation',
        'G': 'Extended family',
        'R': 'Researcher',
        'W': 'Twin pair',
        'MC': 'mother-child',
        'PC': 'parent-child',
        'FC': 'father-child',
        'P1': 'Primary parent',
        'P2': 'Other parent',
        'P1C': 'primary parent on child',
        'P2C': 'other parent on child'
    };
    let legendString;
    if (input[0] === 'O') {
        legendString = `${dict[input[0]]} of ${dict[input.slice(1)]}`;
    } else if (/\d/.test(input)) {
        if ((input.includes('P1') || input.includes('P2')) && input.length === 4) {
            legendString = input[0] === input[2] ? 
                            `${dict[input.slice(0, 2)]} on self` :
                            `${dict[input.slice(0, 2)]} on ${dict[input.slice(2)]}`;
        } else if (input.length === 2) {
            legendString = `${dict[input]}`;
        } else {
            const [firstPair] = input.match(/[P\d]+/g);
            legendString = `${dict[firstPair]} on ${dict[input.replace(firstPair, '')]}`;
        }
    } else {
        if (input.length === 1) {
            legendString = dict[input];
        } else if (input.length === 2) {
            legendString = input[0] === input[1] ? 
                            `${dict[input[0]]} on self` : 
                            `${dict[input[0]]} on ${dict[input[1]]}`;
        }
    }
    console.log(legendString)
    return legendString;
}

/**  
 * Create construct definitions
 * @param input {string} - construct
 */
function constructLegend(input) {
    const legend = {
        'parenting' : `All actions related to the raising of a child from infancy to adulthood.`,
        'physiology' : `Science of the functions of organisms, including the chemical and physical processes involved and the activities of the cells, tissues, and organs, including anatomical and structural factors.`,
        'physical health' : `Condition of one\'s body, taking into consideration everything from the absence of disease to fitness level.`,
        'mental health' : `Emotional, psychological, and social well-being of an individual or group.`,
        'demographics' : `Population-based characteristics of individuals or groups. Demographic information includes factors such as age, race, sex, occupation, and socioeconomic status.`,
        'personality' : `Enduring configuration of characteristics and behavior that comprises an individual\'s unique adjustment to life, including major traits, interests, drives, values, self-concept, abilities, and emotional patterns.`,
        'cognition' : `All forms of knowing and awareness, such as perceiving, conceiving, remembering, reasoning, judging, imagining, and problem solving.`,
        'lifestyle' : `Typical way of life or manner of living that is characteristic of an individual or group, as expressed by behaviors, attitudes, interests, and other factors (APA, 2023).`,
        'life history' : `History of major events or significant changes in an individual\'s life, which alter their role, position, and/or resources such as the birth of children, death of family members, move to another place, job loss, declines in health etc.`,
        'sociocognitive and emotional development' : `Changes across life stages that are related to the way individuals understand, react to, and reflect on others as well as on themselves. Sociocognitive and emotional development includes the developmental trajectories of social, cognitive and emotional skills (e.g., communication, language, emotion regulation, empathy, and self-identity) that are important capabilities for healthy functioning in life and society.`,
        'relationships' : `Continuing and often committed association between two or more individuals, as in a family, friendship, marriage, partnership, or other interpersonal link in which the individuals have some degree of influence on each other\'s thoughts, feelings, and actions.`,
        'work and school' : `An individual\'s occupational and educational activities, including performance, abilities, interests, values, and ambitions.`,
        'mri' : `Technique that uses a magnetic field to create a computerized image of internal bodily structures.`,
        'eeg' : `Recording of electric currents generated in the brain by means of electrodes applied to the scalp, to the surface of the brain, or placed within the substance of the brain.`,
        'eyetracking' : `Technique that can measure an individual\'s gaze direction and what they are looking at in real-time. The technique converts eye movements (e.g., fixations, saccades, smooth pursuit) into a data stream that contains information such as pupil position, the gaze vector for each eye, and gaze point.`,
        'behavioral/cognitive task' : `Measurement, experiment, procedure, or paradigm to obtain an objective measure of an individual\'s behavioral/cognitive functioning.`,
        'biological sample/measurement' : `Biological material obtained from a living organism, or the test applied to this material. It includes, for example biological specimens of human organs, cells or tissues such as hair, muscle or tumor tissue, bodily fluids such as blood, urine, saliva, extracted material such as DNA and RNA, etc.`,
        'Anthropometrics/Body measures' : `Technique that deals with the measurement of the size, weight, and proportions of the human body.`,
        'echo' : `Visualization of deep structures of the body by recording the reflections or echoes of ultrasonic pulses directed into the tissues.`,
        'x-ray' : `Technique that uses electromagnetic emission of short wavelength produced by bombarding a heavy metal target, such as tungsten, with high-energy electrons in a vacuum tube. It is often used to visualize internal body structures.`,
        'emg' : `Recording of the changes in electric muscle activity by means of surface or needle electrodes.`,
        'ecg' : `Recording of the changes in electric activity of the heart by means of surface or needle electrodes.`,
        'selfAdministeredquestionnaire' : `Data collection method in which the respondent reads or listens to the questions, and enters the responses by him/herself; no live interviewer is present, or participates in the questionnaire administration.`,
        'measurementsandtests' : `Assessing specific properties (or characteristics) of beings, things, phenomena, (and/ or processes) by applying pre-established standards and/or specialized instruments or techniques.`,
        'interview' : `A pre-planned communication between two (or more) people - the interviewer(s) and the interviewee(s) - in which information is obtained by the interviewer(s) from the interviewee(s). If group interaction is part of the method, use "Focus group".`,
        'focusgroup' : `A group discussion on a particular topic, organized for research purposes. The individuals are selected with relevance to the topic, and interaction among the participants is used as part of the method.`,
        'selfAdministeredwritingsanddiaries' :	`Narratives, stories, diaries, and written texts created by the research subject.`,
        'contentcoding' : `As a mode of secondary data collection, content coding applies coding techniques to transform qualitative data (textual, video, audio or still-image) originally produced for other purposes into quantitative data (expressed in unit-by-variable matrices) in accordance with pre-defined categorization schemes.`,
        'transcription' : `Capturing information in writing from a different source, or from a different medium, alphabet, or form of notation, like scientific formulae, or musical notes. For transcribed interviews or observations, it is recommended to document the primary mode of collection, using one of the interview or observation terms.`,
        'compilationsynthesis' : `Collecting and assembling data from multiple, often heterogeneous sources that have one or more reference points in common, and at least one of the sources was originally produced for other purposes. The data are incorporated in a new entity. For example, providing data on the number of universities in the last 150 years using a variety of available sources (e.g. finance documents, official statistics, university registers), combining survey data with information about geographical areas from official statistics (e.g. population density, doctors per capita, etc.), or using RSS to collect blog posts or tweets, etc.`,
        'summary' :	`Presentation of information in a condensed form, by reducing it to its main points. For example, abstracts of interviews or reports that are published and used as data rather than the full-length interviews or reports.`,
        'aggregation' :	`Statistics that relate to broad classes, groups, or categories. The data are averaged, totaled, or otherwise derived from individual-level data, and it is no longer possible to distinguish the characteristics of individuals within those classes, groups, or categories. For example, the number and age group of the unemployed in specific geographic regions, or national level statistics on the occurrence of specific offences, originally derived from the statistics of individual police districts.`,
        'simulation' : `Modeling or imitative representation of real-world processes, events, or systems, often using computer programs. For example, a program modeling household consumption responses to indirect tax changes; or a dataset on hypothetical patients and their drug exposure, background conditions, and known adverse events.` }
    if (legend.hasOwnProperty(input.toLowerCase())) {
        return legend[input.toLowerCase()];
    } else {
        return ''; 
    }
}

/**  
 * Create timeline with sample points
 */
function waveTimeline(timepoints,barID) {
    for (const section of timepoints) {

        const barSections = document.querySelectorAll('#bar-container-'+barID+' > .bar-section');
        const barSection = barSections[section];

      barSection.style.backgroundColor = '#444';
      barSection.className = 'bar-section highLight';
      if (section == 0 || timepoints.length() == 1) {
        barSection.style.width = '5px';
      }
    }
  }


/**  
 * Create interactive search suggestions
 * - Display a popup with keywords based on text entered in the searchbox
 * - Create event listeners when searchbox is focussed for up and down keys to select suggestions
 * - Use tab-key to add suggestion to the searchbox
 */
function interactiveSuggestions(searchBox) {
    const specialCharacters = ['&', '|', '(', ')', '[', ']',':','"'];
    let selectedSuggestionIndex = -1;
    const url1 = "/api/3/action/package_search?facet.field=[%22dc_label%22]";
    const url2 = "/api/3/action/package_search?facet.field=[%22dc_construct%22]";
    const url3 = "/api/3/action/package_search?rows=1000";
    Promise.all([
      fetch(url1).then(res => res.json()),
      fetch(url2).then(res => res.json()),
      fetch(url3).then(res => res.json())
    ]).then(([data1, data2, data3]) => {
        // Create unique array of lowercase strings from labels, constructs and dataset titles
        const fetchData1 = Object.keys(data1.result.facets.dc_label);
        const fetchData2 = Object.keys(data2.result.facets.dc_construct);
        
        let titleSet = [];
        for (const result of data3.result.results) {
            titleSet.push(result.title)
        }
        const wordsArr = titleSet
            .map(str => str.split(' '))
            .reduce((acc, val) => acc.concat(val), []);
        const fetchData3 = [...new Set(wordsArr)];

        const uniqueKeywords = fetchData1
            .concat(fetchData2, fetchData3)
            .flatMap(str => str.split('/'))
            .map(str => str.toLowerCase().replace(/[^\w\s-–]/g, ''))
            .filter(str => str.length > 3)
            .filter((value, index, self) => self.indexOf(value) === index);

        function handleKeyDown(event) {
            // Add event listeners for selection of suggestions and entering values
            let searchSuggestionLinks = document.querySelectorAll('a.search-suggestion');
            if (searchSuggestionLinks.length == 0) { return; }
            if (searchBox !== document.activeElement) {
                return;
            }
            if (event.key === 'ArrowDown') {
                // Move selection down
                event.preventDefault();
                selectedSuggestionIndex =
                    (selectedSuggestionIndex + 1) % searchSuggestionLinks.length;
                updateSelectedSuggestion(selectedSuggestionIndex);
            } else if (event.key === 'ArrowUp') {
                // Move selection up
                event.preventDefault();
                if (selectedSuggestionIndex == -1) { selectedSuggestionIndex = 0}; 
                selectedSuggestionIndex =
                    (selectedSuggestionIndex - 1 + searchSuggestionLinks.length) %
                    searchSuggestionLinks.length;
                updateSelectedSuggestion(selectedSuggestionIndex);
            } else if (event.key === 'Enter') {
                // Simulate a click on the selected suggestion
                if (selectedSuggestionIndex >= 0) {
                    event.preventDefault();
                    searchSuggestionLinks[selectedSuggestionIndex].click();
                }
            } else if (event.key === 'Escape' || event.key === 'Esc') {
                let currTextBalloon = document.getElementById('search-balloon');
                if (currTextBalloon) { currTextBalloon.remove(); selectedSuggestionIndex = -1; }
                return;
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        // Change CSS styling of elements on selection
        function updateSelectedSuggestion(selectedSuggestionIndex) {
            let searchSuggestionLinks = document.querySelectorAll('a.search-suggestion');
            searchSuggestionLinks.forEach((link) => {
                link.style.backgroundColor = '';
                link.style.borderRadius = '';
            });
            const selectedSuggestionLink = searchSuggestionLinks[selectedSuggestionIndex];
                selectedSuggestionLink.style.backgroundColor = '#ccc';
                selectedSuggestionLink.style.borderRadius = '5px';
                searchBox.focus()
        }
        searchBox.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter') {
                return;
            }
            // Move the suggestion box relative to the cursor
            selectedSuggestionIndex = -1;
            const cursorX = searchBox.selectionStart;
            const rect = searchBox.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const cursorPixelX = rect.left + scrollLeft + (cursorX * 6); 
            getMatchingLabels(uniqueKeywords,cursorPixelX);
        });
        function getMatchingLabels(labels,cursorX) {
            // Get matching strings starting the the text entered
            const textBalloon = document.getElementById('search-balloon');       
            if (searchBox.value.endsWith(' ')) {   
                if (textBalloon) { textBalloon.remove(); selectedSuggestionIndex = -1; }
                return;
            };
            let lastSpecialCharIndex = -1;
            let currentText = searchBox.value; 
            for (let i = currentText.length - 1; i >= 0; i--) {
                if (specialCharacters.includes(currentText[i])) {
                    lastSpecialCharIndex = i;
                    break;
                }
            }
            input = currentText.slice(lastSpecialCharIndex + 1).trim();
            if (input.length < 3) {
                if (textBalloon) { textBalloon.remove(); selectedSuggestionIndex = -1; }
                return;
            }
            let matchingLabels = labels.filter(label => label.toLowerCase().startsWith(input.toLowerCase()));
            matchingLabels.sort();
            if (matchingLabels.length == 0) { 
                if (textBalloon) { textBalloon.remove(); selectedSuggestionIndex = -1; }
                return; 
            }
            displayLabels(matchingLabels,cursorX);
        }
        function displayLabels(matchingLabels,cursorX) { 
            showTextBalloon(matchingLabels,cursorX);
            let searchSuggestions = document.querySelectorAll('.search-suggestion');
            searchSuggestions.forEach(suggestion => {
                suggestion.addEventListener('click', () => {
                    // Get the current value of the searchbox
                    const currentText = searchBox.value;
                    let lastSpecialCharIndex = -1;
                    for (let i = currentText.length - 1; i >= 0; i--) {
                        if (specialCharacters.includes(currentText[i])) {
                            lastSpecialCharIndex = i;
                            break;
                        }
                    }
                    let newText;
                    suggestion.innerText = suggestion.innerText.replace(/(-)/g, '*');
                    if (lastSpecialCharIndex === -1) {
                        newText = '"' + suggestion.innerText + '" ';
                    } else {
                        if ((currentText.charAt(lastSpecialCharIndex) == '"')) { 
                            // check if string starts with quotes, then keep it within those quotes
                            newText = currentText.slice(0, lastSpecialCharIndex + 1) + suggestion.innerText + '" ';
                        } else {
                            // don't add whitespace when specified a search field 
                            let addWhiteSpace = ' ';
                            if ((currentText.charAt(lastSpecialCharIndex) == ':')) { addWhiteSpace = ''; }
                            newText = currentText.slice(0, lastSpecialCharIndex + 1) + addWhiteSpace + '"' + suggestion.innerText + '" ';
                        }
                    }
                    searchBox.value = newText;
                    selectedSuggestionIndex = -1;
                    let currTextBalloon = document.getElementById('search-balloon');
                    searchBox.focus();
                    if (currTextBalloon) { currTextBalloon.remove(); }
                });
            });
            function showTextBalloon(matchingLabels,cursorX) {
                if (!matchingLabels) {selectedSuggestionIndex = -1; return;  }
                let currTextBalloon = document.getElementById('search-balloon');
                if (currTextBalloon) { currTextBalloon.remove(); selectedSuggestionIndex = -1; }
                const textBalloon = document.createElement('div');
                textBalloon.classList.add('search-balloon');
                const links = matchingLabels.map(label => `<a class="search-suggestion">${label.toLowerCase()}</a>`);
                textBalloon.innerHTML = `<span style="color:grey"><em>Suggestions</em></span><br><span class="small" style="color:grey"><span class="fa fa-info-circle"></span> Use <kbd>up</kbd> <kbd>down</kbd> and <kbd>enter</kbd></span><br><hr style="border: none;height: 1px;background-color: gray;margin: 4px;">` + links.join('<br>');
                textBalloon.id = 'search-balloon';
                const searchboxRect = searchBox.getBoundingClientRect();
                const top = searchboxRect.bottom + window.pageYOffset + 5; 
                const left = cursorX;
                textBalloon.style.position = 'absolute';
                textBalloon.style.top = `${top}px`;
                textBalloon.style.left = `${left}px`;
                document.body.appendChild(textBalloon);
            } 
        }   

        document.addEventListener("click", function(event) {
            let searchBalloon = document.getElementById("search-balloon");
            if (searchBalloon) {
                if (event.target !== searchBox && !searchBalloon.contains(event.target)) {
                searchBalloon.remove();
                }
            }
        });
    });
}

const searchBox = document.getElementById('searchbox');       
if (searchBox) { 
    interactiveSuggestions(searchBox);
}



