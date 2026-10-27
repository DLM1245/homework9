const name = 'Dylan';
let hasDownloadedResume = false;
let startDate = '2026-10-12'
let endDate = '2030-10-26'

console.log('Hello World!');

document.getElementById('resumeButton').addEventListener('click', () => { 
    alert('Your resume is downloaded successfully!');
});

function showGreeting(name) 
{
    return "Hello, my name is " + name + "! Welcome to my Portfolio!";
}

function calculateDays(startDate, endDate) 
{
    let start = new Date(startDate);
    let end = new Date(endDate);
    let timeDifference = end - start;
    let daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference;
}

console.log(calculateDays(startDate, endDate));

// step 8-4 count the number of times the resume has downloaded
let downloadCount = 0;

const resumeButton = document.getElementById('resumeButton');
const downloadTracker = document.getElementById('downloadTracker');

function incrementDownloadCount() 
{
    downloadCount++;
    downloadTracker.textContent = downloadCount;
}

resumeButton.addEventListener('click', incrementDownloadCount);

// step 8-5 make the education and experience section dynamic
const experienceData = [
    { role: "Intern", company: "TBD", dates: "Some time in the future" },
    { role: "Game Tester", company: "PlaytestCloud", dates: "09/2025 - 05/2026" }
];

const educationData = [
    { degree: "Highschool Diploma", institution: "Hannan High", dates: "Graduated 2025" },
    { degree: "Bachelor of Science in Immersive Media and Games", institution: "Northern Arizona University", dates: "Ongoing" }
];

function generateBootstrapTable(containerId, headers, dataset, keys) 
{
    const targetContainer = document.getElementById(containerId);
    if (!targetContainer) return;
    const table = document.createElement('table');
    table.className = "table table-bordered table-striped align-middle";
    let theadHtml = '<thead><tr>';
    headers.forEach(headerText => {
        theadHtml += `<th scope="col">${headerText}</th>`;
    });
    theadHtml += '</tr></thead>';
    let tbodyHtml = '<tbody>';
    dataset.forEach(entry => {
        keys.forEach(key => {
            tbodyHtml += `<td>${entry[key]}</td>`;
        });
        tbodyHtml += '</tr>';
    });
    tbodyHtml += '</tbody>';
    table.innerHTML = theadHtml + tbodyHtml;
    targetContainer.appendChild(table);
}

generateBootstrapTable(
    'experienceContainer', 
    ['Job Title / Role', 'Company / Organization', 'Dates Active'], 
    experienceData, 
    ['role', 'company', 'dates']
);

generateBootstrapTable(
    'educationContainer', 
    ['Degree / Certification', 'School / University', 'Timeline Dates'], 
    educationData, 
    ['degree', 'institution', 'dates']
);

// step 9-1 Dynamic Skills Form with Validation and Array Management
$(document).ready(function() {
    let programmingSkills = [
        "Familiarity with multiple programming languages",
        "Practice with pair programming"
    ];

    const validateEntry = (rawInput, collection, ruleCallback) => {
        return ruleCallback(rawInput.trim(), collection);
    };

    const checkSkillsValidity = (skill, list) => {
        if (!skill) {
            return { valid: false, reason: "Please enter a valid skill name." };
        }
        const matchesExisting = list.some(item => item.toLowerCase() === skill.toLowerCase());
        if (matchesExisting) {
            return { valid: false, reason: `"${skill}" is already present in your list.` };
        }
        return { valid: true, reason: "" };
    };

    function reindexDOMItems() {
        $('#programmingList li').each(function(newIndex) {
            $(this).attr('data-index', newIndex);
        });
    }

    function refreshSkillsView(dataArray) {
        const $targetList = $('#programmingList');
        $targetList.empty();
        dataArray.forEach((skill, id) => {
            $targetList.append(`
                <li class="mb-2 d-flex justify-content-between align-items-center programming-item" data-index="${id}">
                    <span class="skill-display-text" style="cursor: pointer; flex-grow: 1;">${skill}</span>
                </li>
            `);
        });
    }

    $('#skillForm').on('submit', function(event) {
        event.preventDefault();
        const $textInput = $('#skillInput');
        const $errorArea = $('#validationFeedback');
        const candidateValue = $textInput.val();
        const outcome = validateEntry(candidateValue, programmingSkills, checkSkillsValidity);
        if (!outcome.valid) 
        {
            $errorArea.text(outcome.reason).slideDown(150);
            $textInput.addClass('is-invalid');
            return;
        }
        $errorArea.slideUp(150);
        $textInput.removeClass('is-invalid');
        programmingSkills.push(candidateValue.trim());
        $textInput.val('');
        const newIndex = programmingSkills.length - 1;
        const $newItem = $(`
            <li class="mb-2 d-flex justify-content-between align-items-center programming-item" data-index="${newIndex}">
                <span class="skill-display-text" style="cursor: pointer; flex-grow: 1;">${candidateValue.trim()}</span>
            </li>
        `).hide();
        $('#programmingList').append($newItem);
        $newItem.slideDown(300);
    });

    $('#programmingList').on('click', '.skill-display-text', function() {
        const $textNode = $(this);
        const $parentLi = $textNode.closest('li');
        const indexValue = $parentLi.data('index');
        const originalText = programmingSkills[indexValue];
        const inlineInputTemplate = `
            <div class="input-group input-group-sm inline-edit-wrap">
                <input type="text" class="form-control inline-edit-field" value="${originalText}">
                <button class="btn btn-success confirm-edit-btn p-0" type="button" title="Save" style="width: 32px; height: 31px;"></button>
                <button class="btn btn-secondary drop-edit-btn p-0" type="button" title="Cancel" style="width: 32px; height: 31px;"></button>
                <button class="btn btn-danger delete-skill-btn p-0" type="button" title="Delete" style="width: 32px; height: 31px; border-top-right-radius: .25rem; border-bottom-right-radius: .25rem;"></button>
            </div>
        `;
        $textNode.hide();
        $parentLi.prepend(inlineInputTemplate);
        $parentLi.find('.inline-edit-field').focus().select();
    });

    $('#programmingList').on('click', '.confirm-edit-btn', function() {
        const $parentLi = $(this).closest('li');
        const indexValue = $parentLi.data('index');
        const modifiedValue = $parentLi.find('.inline-edit-field').val().trim();
        const alternateSet = programmingSkills.filter((_, idx) => idx !== indexValue);
        const checkResult = validateEntry(modifiedValue, alternateSet, checkSkillsValidity);
        if (!checkResult.valid) 
        {
            alert(checkResult.reason);
            return;
        }
        programmingSkills[indexValue] = modifiedValue;
        $parentLi.find('.inline-edit-wrap').remove();
        $parentLi.append(`<span class="skill-display-text" style="cursor: pointer; flex-grow: 1;">${modifiedValue}</span>`);
    });

    $('#programmingList').on('click', '.drop-edit-btn', function() {
        const $parentLi = $(this).closest('li');
        $parentLi.find('.inline-edit-wrap').remove();
        $parentLi.find('.skill-display-text').fadeIn(200);
    });

    $('#programmingList').on('click', '.delete-skill-btn', function(e) {
        e.stopPropagation(); 
        const $parentLi = $(this).closest('li');
        const indexValue = $parentLi.data('index');
        programmingSkills.splice(indexValue, 1);
        $parentLi.slideUp(300, function() {
            $(this).remove();      
            reindexDOMItems();     
        });
    });

    refreshSkillsView(programmingSkills);

    // step 9-2 Dynamically Rendering the Navigation Menu:
    const menuItems = [
        { label: "Introduction", target: "#Introduction" },
        { label: "Skills", target: "#Skills" },
        { label: "Projects", target: "#Projects" },
        { label: "Education and Experience", target: "#Education" },
        { label: "Contact", target: "#Contact" }
    ];

    function renderNavigationMenu(items) {
        const $menuList = $('#portfolioNavbarList');
        $menuList.empty();
        items.forEach((item, index) => {
            const activeClass = (index === 0) ? 'active' : '';
            const navItemHTML = `
                <li class="nav-item">
                    <a class="nav-link fw-medium ${activeClass}" href="${item.target}">
                        ${item.label}
                    </a>
                </li>
            `;
            $menuList.append(navItemHTML);
        });
    }

    $('#portfolioNavbarList').on('click', '.nav-link', function(event) {
        event.preventDefault(); 
        const $clickedLink = $(this);
        const targetSelector = $clickedLink.attr('href');
        const $targetElement = $(targetSelector);
        if ($targetElement.length) {
            $('.nav-link').removeClass('active');
            $clickedLink.addClass('active');
            const targetOffsetPosition = $targetElement.offset().top - 20;
            $('html, body').animate({
                scrollTop: targetOffsetPosition
            }, 400);
        }
    });

    let downloadCount = 0;
    $('#resumeButton').on('click', function() {
        downloadCount++;
        $('#downloadTracker').text(downloadCount);
    });

    renderNavigationMenu(menuItems);

    // step 9-3 Projects Section with Sorting by Deadline
    const projectsList = [
        {
            title: "Fur in the Shadows",
            description: "Game made for a two-week-long game jam. It's a short arcade game where you deflect the enemies' bullets back towards them to eliminate them and gain power. Uploaded to itch.io.",
            deadlineStr: "09/20/2026",
            imageUrls: [
                "./Images/Screenshot 2026-09-07 200325.png",
                "./Images/Screenshot 2026-09-07 200305.png"
            ],
            imageCaptions: [
                "Front page of the Itch.io game",
                "Gameplay image, near the starting area"
            ]
        },
        {
            title: "Project 2: Electric Boogaloo",
            description: "So basically this is a super cool project where I make you read the description and then you realize it means nothing. Have a good time grading!",
            deadlineStr: "10/26/2030",
            imageUrls: [],
            imageCaptions: []
        },
        {
            title: "Showcaser 8000",
            description: "This just showcases the code.",
            deadlineStr: "05/04/2027",
            imageUrls: [],
            imageCaptions: []
        }
    ];

    function renderProjects(arrayToRender) {
        const $container = $('#projectsContainer');
        $container.empty(); // Flush previous structural order
        const currentDate = new Date();
        for (let i = 0; i < arrayToRender.length; i++) {
            const currentItem = arrayToRender[i];
            const deadlineDate = new Date(currentItem.deadlineStr);
            let statusText = "Completed";
            let statusClass = "bg-success";
            if (deadlineDate > currentDate) {
                statusText = "Ongoing";
                statusClass = "bg-primary";
            }
            let projectItemHTML = `
                <div class="mb-4 project-animated-wrapper" style="display: none;">
                    <h4 class="fw-semibold text-dark mb-1">
                        ${currentItem.title}
                    </h4>
                    <span class="badge ${statusClass} mb-2">${statusText}</span>
                    <p class="text-muted mb-1">
                        ${currentItem.description}
                    </p>
            `;

            if (currentItem.imageUrls && currentItem.imageUrls.length > 0) {
                projectItemHTML += `<div class="row text-center my-3">`;
                for (let j = 0; j < currentItem.imageUrls.length; j++) {
                    const caption = currentItem.imageCaptions[j] || `Project Image ${j + 1}`;
                    projectItemHTML += `
                        <div class="col-12 col-md-6">
                            <figure class="figure border p-2 bg-light rounded">
                                <img src="${currentItem.imageUrls[j]}" alt="Project Img" class="img-fluid rounded" style="max-height: 300px;">
                                <figcaption class="figure-caption mt-2">${caption}</figcaption>
                            </figure>
                        </div>
                    `;
                }
                
                projectItemHTML += `</div>`;
            }

            projectItemHTML += `
                    <h5 class="text-secondary small fw-bold mt-2">
                        Due: ${currentItem.deadlineStr}
                    </h5>
                </div>
            `;

            $container.append(projectItemHTML);
        }

        $container.find('.project-animated-wrapper').slideDown(350);
    }

    function executeSortSequence() {
        const activeOrder = $('#projectSortSelect').val();
        projectsList.sort(function(projectA, projectB) {
            const timeA = new Date(projectA.deadlineStr);
            const timeB = new Date(projectB.deadlineStr);

            return (activeOrder === 'earliest') ? (timeA - timeB) : (timeB - timeA);
        });

        renderProjects(projectsList);
    }

    $('#projectSortSelect').on('change', function() {
        $('#projectsContainer').fadeOut(150, function() {
            executeSortSequence();
            $(this).fadeIn(150);
        });
    });

    executeSortSequence();

    // step 9-4 Keyboard Event Listener with Custom Actions:
    const handleEnterKey = (event, $inputField) => {
        event.preventDefault();
        $('#skillForm').submit();
    };

    const handleEscapeKey = ($inputField, $errorArea) => {
        $inputField.val('');
        $inputField.removeClass('is-invalid');
        $errorArea.slideUp(150);
    };

    $('#skillInput').on('keydown', function(event) {
        const $input = $(this);
        const $feedback = $('#validationFeedback');
        if (event.key === 'Enter') {
            handleEnterKey(event, $input);
        } 
        else if (event.key === 'Escape') {
            handleEscapeKey($input, $feedback);
        }
    });
});
