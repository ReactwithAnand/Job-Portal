(function () {
    var currentStep = 1;
    var totalSteps = 3;
    var sections = Array.from(document.querySelectorAll(".form-section"));
    var stepItems = Array.from(document.querySelectorAll(".step-item"));
    var formControls = Array.from(document.querySelectorAll(".form-control"));
    var postingAsPills = Array.from(document.querySelectorAll("[data-posting-as]"));
    var backButton = document.getElementById("btnBack");
    var nextButton = document.getElementById("btnNext");
    var successOverlay = document.getElementById("successOverlay");
    var postAnotherJobButton = document.getElementById("postAnotherJobButton");
    var applicationDeadlineInput = document.getElementById("applicationDeadline");
    var profileMenuButton = document.getElementById("profileMenuButton");
    var profilePopup = document.getElementById("profilePopup");
    var logoutButton = document.getElementById("logoutButton");
    var lastProfileMenuFocusedElement = null;

    function $(id) {
        return document.getElementById(id);
    }

    function getPostingAs() {
        var activePill = postingAsPills.find(function (pill) {
            return pill.classList.contains("active");
        });

        return activePill ? activePill.getAttribute("data-posting-as") : "";
    }

    function parseCommaSeparated(value) {
        return value.split(",").map(function (item) {
            return item.trim();
        }).filter(Boolean);
    }

    function setError(groupId) {
        var group = $(groupId);

        if (group) {
            group.classList.add("has-error");
        }
    }

    function clearErrorForField(field) {
        var group = field.closest(".form-group");

        if (group) {
            group.classList.remove("has-error");
        }
    }

    function validateStep(step) {
        var isValid = true;
        var expMin;
        var expMax;
        var salaryMin;
        var salaryMax;

        if (step === 1) {
            if (!$("title").value.trim()) {
                setError("group-title");
                isValid = false;
            }

            if (!$("jobType").value) {
                setError("group-jobType");
                isValid = false;
            }

            if (!$("workMode").value) {
                setError("group-workMode");
                isValid = false;
            }

            if (!parseCommaSeparated($("location").value).length) {
                setError("group-location");
                isValid = false;
            }

            if (!$("vacancies").value || Number($("vacancies").value) < 1) {
                setError("group-vacancies");
                isValid = false;
            }
        } else if (step === 2) {
            expMin = Number($("expMin").value);
            expMax = Number($("expMax").value);

            if (!$("expMin").value || !$("expMax").value || expMin > expMax) {
                setError("group-experience");
                isValid = false;
            }

            if (!parseCommaSeparated($("requiredSkills").value).length) {
                setError("group-skills");
                isValid = false;
            }

            if (!parseCommaSeparated($("qualifications").value).length) {
                setError("group-qualifications");
                isValid = false;
            }
        } else if (step === 3) {
            salaryMin = Number($("salaryMin").value);
            salaryMax = Number($("salaryMax").value);

            if (!$("salaryMin").value || !$("salaryMax").value || salaryMin > salaryMax) {
                setError("group-salary");
                isValid = false;
            }

            if (!$("applicationDeadline").value) {
                setError("group-deadline");
                isValid = false;
            }

            if (!$("description").value.trim()) {
                setError("group-description");
                isValid = false;
            }
        }

        return isValid;
    }

    function updateStepUI() {
        sections.forEach(function (section, index) {
            section.classList.toggle("active", index + 1 === currentStep);
        });

        stepItems.forEach(function (item, index) {
            item.classList.toggle("active", index + 1 === currentStep);
            item.classList.toggle("completed", index + 1 < currentStep);
        });

        if (backButton) {
            backButton.style.display = currentStep > 1 ? "block" : "none";
        }

        if (nextButton) {
            nextButton.textContent = currentStep === totalSteps ? "Post Job" : "Next";
        }
    }

    function isProfilePopupOpen() {
        return Boolean(profilePopup && !profilePopup.hidden);
    }

    function openProfilePopup() {
        if (!profilePopup || !profileMenuButton) {
            return;
        }

        lastProfileMenuFocusedElement = profileMenuButton;
        profilePopup.hidden = false;
        profilePopup.classList.add("open");
        profileMenuButton.setAttribute("aria-expanded", "true");

        window.requestAnimationFrame(function () {
            if (logoutButton) {
                logoutButton.focus();
            }
        });
    }

    function closeProfilePopup() {
        if (!profilePopup || !profileMenuButton || profilePopup.hidden) {
            return;
        }

        profilePopup.hidden = true;
        profilePopup.classList.remove("open");
        profileMenuButton.setAttribute("aria-expanded", "false");

        if (lastProfileMenuFocusedElement && typeof lastProfileMenuFocusedElement.focus === "function") {
            lastProfileMenuFocusedElement.focus();
        }
    }

    function toggleProfilePopup() {
        if (isProfilePopupOpen()) {
            closeProfilePopup();
            return;
        }

        openProfilePopup();
    }

    function goNext() {
        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep < totalSteps) {
            currentStep += 1;
            updateStepUI();
            return;
        }

        submitForm();
    }

    function goBack() {
        if (currentStep <= 1) {
            return;
        }

        currentStep -= 1;
        updateStepUI();
    }

    function submitForm() {
        var jobData = {
            postingAs: getPostingAs(),
            title: $("title").value.trim(),
            description: $("description").value.trim(),
            location: parseCommaSeparated($("location").value),
            salaryRange: $("salaryMin").value + "-" + $("salaryMax").value,
            jobType: $("jobType").value,
            qualifications: parseCommaSeparated($("qualifications").value),
            experiences: {
                years: $("expMin").value + "-" + $("expMax").value
            },
            applicationDeadline: $("applicationDeadline").value,
            workMode: $("workMode").value,
            requiredSkills: parseCommaSeparated($("requiredSkills").value),
            ageLimit: $("ageLimit").value ? Number($("ageLimit").value) : null,
            vacancies: Number($("vacancies").value)
        };

        if (!jobData.ageLimit) {
            delete jobData.ageLimit;
        }

        console.log("=== PAYLOAD READY FOR API ===");
        console.log(JSON.stringify(jobData, null, 2));

        if (successOverlay) {
            successOverlay.hidden = false;
            successOverlay.classList.add("is-visible");
        }
    }

    postingAsPills.forEach(function (pill) {
        pill.addEventListener("click", function () {
            postingAsPills.forEach(function (item) {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });

            pill.classList.add("active");
            pill.setAttribute("aria-pressed", "true");
        });
    });

    formControls.forEach(function (field) {
        field.addEventListener("input", function () {
            clearErrorForField(field);
        });

        field.addEventListener("change", function () {
            clearErrorForField(field);
        });
    });

    if (applicationDeadlineInput) {
        applicationDeadlineInput.min = new Date().toISOString().split("T")[0];
    }

    if (backButton) {
        backButton.addEventListener("click", goBack);
    }

    if (nextButton) {
        nextButton.addEventListener("click", goNext);
    }

    if (postAnotherJobButton) {
        postAnotherJobButton.addEventListener("click", function () {
            window.location.reload();
        });
    }

    if (profileMenuButton) {
        profileMenuButton.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleProfilePopup();
        });
    }

    if (profilePopup) {
        profilePopup.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            console.log("Logout requested");
            closeProfilePopup();
        });
    }

    document.addEventListener("click", function (event) {
        if (!isProfilePopupOpen()) {
            return;
        }

        if (profileMenuButton && profileMenuButton.contains(event.target)) {
            return;
        }

        if (profilePopup && profilePopup.contains(event.target)) {
            return;
        }

        closeProfilePopup();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && isProfilePopupOpen()) {
            event.preventDefault();
            closeProfilePopup();
        }
    });

    updateStepUI();
}());
