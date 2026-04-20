import { API_BASE_URL } from "../../../constants/constant.js";

// --- ICONS (SVG Strings for reuse) ---
const icons = {
    location: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    salary: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
            <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
            </svg>`,
    briefcase: '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    graduation: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    users: '<svg class="icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    x: '<svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    trash: '<svg class="icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>'
};

// --- STATE ---
// Holds jobs fetched from server. Each job also stores its fetched applicants once expanded.
let jobsState = [];      // [{ ...jobDoc, applicants: null | [] }]

// --- API HELPERS ---

async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        credentials: 'include',   // send cookies (session / JWT cookie) for verifyAdmin
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
    }
    return data;          // { statusCode, data, message }
}

// GET /api/v1/jobs/company  — all jobs posted by this company
async function fetchCompanyJobs() {
    const response = await apiFetch(`${API_BASE_URL}/jobs/company`);
    return response.data;   // array of job documents (with totalApplications field)
}

// GET /api/v1/applyed-jobs/applicants/:jobId  — ranked applicants for a job
async function fetchApplicantsForJob(jobId) {
    const response = await apiFetch(`${API_BASE_URL}/applyed-jobs/applicants/${jobId}`);
    // response.data = { job: {...}, applicants: [...] }
    return response.data.applicants;
}

// DELETE /api/v1/jobs/delete/:jobId
async function apiDeleteJob(jobId) {
    await apiFetch(`${API_BASE_URL}/jobs/delete/${jobId}`, { method: 'DELETE' });
}

// PUT /api/v1/applyed-jobs/update-status/:applicationId
async function apiUpdateStatus(applicationId, status) {
    const response = await apiFetch(`${API_BASE_URL}/applyed-jobs/update-status/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
    return response.data;  // updated application doc
}

// --- CORE LOGIC ---

async function initDashboard() {
    initProfileMenu();
    await loadJobs();
}

async function loadJobs() {
    try {
        const jobs = await fetchCompanyJobs();
        // Preserve already-fetched applicants across re-renders
        jobsState = jobs.map(job => {
            const existing = jobsState.find(j => j._id === job._id);
            return { ...job, applicants: existing ? existing.applicants : null };
        });
        updateStatistics();
        renderJobList();
    } catch (err) {
        console.error('Failed to load jobs:', err);
        document.getElementById('job-list-container').innerHTML =
            `<div class="empty-state">Failed to load jobs. ${err.message}</div>`;
    }
}

function updateStatistics() {
    const totalJobs = jobsState.length;
    const totalApps = jobsState.reduce((sum, j) => sum + (j.totalApplications || 0), 0);

    // Count shortlisted across all already-loaded applicant lists
    let shortlisted = 0;
    jobsState.forEach(j => {
        if (j.applicants) {
            shortlisted += j.applicants.filter(a => a.status === 'Shortlisted').length;
        }
    });

    document.getElementById('stat-total-jobs').innerText = totalJobs;
    document.getElementById('stat-total-apps').innerText = totalApps;
    document.getElementById('stat-shortlisted').innerText = shortlisted;
}

async function toggleJobAccordion(jobId) {
    const card = document.getElementById(`job-card-${jobId}`);
    const isExpanded = card.classList.contains('expanded');

    if (isExpanded) {
        card.classList.remove('expanded');
        return;
    }

    // Fetch applicants only if not yet loaded for this job
    const jobEntry = jobsState.find(j => j._id === jobId);
    if (jobEntry && jobEntry.applicants === null) {
        try {
            const applicants = await fetchApplicantsForJob(jobId);
            jobEntry.applicants = applicants;
            updateStatistics();
            // Re-render just the applicants section of this card
            renderApplicantsForCard(jobId);
        } catch (err) {
            console.error(`Failed to fetch applicants for job ${jobId}:`, err);
            const list = card.querySelector('.applicant-list');
            if (list) list.innerHTML = `<div class="empty-state">Failed to load applicants. ${err.message}</div>`;
        }
    }

    card.classList.add('expanded');
}

async function updateApplicationStatus(appId, newStatus, event) {
    if (event) event.stopPropagation();

    try {
        await apiUpdateStatus(appId, newStatus);

        // Update local state
        jobsState.forEach(job => {
            if (!job.applicants) return;
            const app = job.applicants.find(a => a.applicationId?.toString() === appId || a._id?.toString() === appId);
            if (app) app.status = newStatus;
        });

        updateStatistics();

        // Find which job this app belongs to and re-render its card keeping it open
        const ownerJob = jobsState.find(job =>
            job.applicants?.some(a => (a.applicationId || a._id)?.toString() === appId)
        );

        renderJobList();

        if (ownerJob) {
            const card = document.getElementById(`job-card-${ownerJob._id}`);
            if (card) card.classList.add('expanded');
        }
    } catch (err) {
        console.error('Failed to update status:', err);
        alert(`Could not update status: ${err.message}`);
    }
}

async function deletePostJob(jobId, event) {
    if (event) event.stopPropagation();

    try {
        await apiDeleteJob(jobId);
        jobsState = jobsState.filter(j => j._id !== jobId);
        updateStatistics();
        renderJobList();
    } catch (err) {
        console.error('Failed to delete job:', err);
        alert(`Could not delete job: ${err.message}`);
    }
}

function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

// --- RENDER ---

function renderApplicantsForCard(jobId) {
    const card = document.getElementById(`job-card-${jobId}`);
    if (!card) return;
    const list = card.querySelector('.applicant-list');
    if (!list) return;

    const jobEntry = jobsState.find(j => j._id === jobId);
    if (!jobEntry || !jobEntry.applicants) return;

    renderApplicantList(list, jobEntry.applicants, jobEntry);
}

function renderApplicantList(listEl, applicants, job) {
    listEl.innerHTML = '';

    if (applicants.length === 0) {
        listEl.innerHTML = `<div class="empty-state">No applications received yet. Keep sharing your job post!</div>`;
        return;
    }

    applicants.forEach(app => {
        // Support both shapes: ranked applicant object from algorithm API
        // { applicationId, status, appliedAt, matchScore, applicant: {...} }
        const user = app.applicant || {};
        const appId = app.applicationId || app._id;
        const isPending = app.status === 'Pending';
        const matchPercentage = app.matchScore !== undefined ? app.matchScore : '—';

        let badgeHtml = '';
        if (app.status === 'Shortlisted') {
            badgeHtml = `<span class="status-badge status-shortlisted">${icons.check} Shortlisted</span>`;
        } else if (app.status === 'Rejected') {
            badgeHtml = `<span class="status-badge status-rejected">${icons.x} Rejected</span>`;
        }

        const profilePic = user.profilePicture?.url || `https://i.pravatar.cc/150?u=${appId}`;

        const appItem = document.createElement('div');
        appItem.className = 'applicant-item';
        appItem.innerHTML = `
            <div class="applicant-profile">
                <img src="${profilePic}" alt="${user.name || 'Applicant'}" class="applicant-img">
                <div class="applicant-details">
                    <h4>${user.name || 'Unknown'}</h4>
                    <p>${user.email || ''}</p>
                </div>
            </div>
            <div class="applicant-actions">
                <p>Matched</p>
                <div class="match-ring" style="--match: ${matchPercentage};" aria-label="${matchPercentage}% profile match">
                    <span>${matchPercentage}%</span>
                </div>
                ${!isPending ? badgeHtml : `
                    <button class="btn btn-select" onclick="updateApplicationStatus('${appId}', 'Shortlisted', event)">Select</button>
                    <button class="btn btn-reject" onclick="updateApplicationStatus('${appId}', 'Rejected', event)">Reject</button>
                `}
            </div>
        `;
        listEl.appendChild(appItem);
    });
}

function renderJobList() {
    const container = document.getElementById('job-list-container');
    container.innerHTML = '';

    if (jobsState.length === 0) {
        container.innerHTML = `<div class="empty-state">No posted jobs yet. Post a new role to start receiving applications.</div>`;
        return;
    }

    jobsState.forEach(job => {
        const skillsHtml = (job.requiredSkills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('');
        const deadlineText = job.applicationDeadline ? formatDate(job.applicationDeadline) : 'N/A';
        const totalApps = job.totalApplications ?? (job.applicants?.length ?? 0);

        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.id = `job-card-${job._id}`;

        // --- 1. Rich Job Summary (Clickable) ---
        const jobSummary = document.createElement('div');
        jobSummary.className = 'job-summary';
        jobSummary.onclick = () => toggleJobAccordion(job._id);

        jobSummary.innerHTML = `
            <div class="job-header-top">
                <div class="job-title-group">
                    <h3>${job.title}</h3>
                </div>
                <div class="job-header-actions">
                    <div class="deadline-badge">
                        ${icons.clock} Ends: ${deadlineText}
                    </div>
                    <button class="delete-job-btn" type="button" aria-label="Delete ${job.title}" onclick="deletePostJob('${job._id}', event)">
                        ${icons.trash}
                    </button>
                </div>
            </div>

            <div class="job-data-grid">
                <div class="data-item" title="Location & Mode">
                    ${icons.location}
                    <span>${(job.location || [])[0] || 'N/A'} (${job.workMode || 'N/A'})</span>
                </div>
                <div class="data-item" title="Salary Range">
                    ${icons.salary}
                    <span>${job.salaryRange || 'Not specified'}</span>
                </div>
                <div class="data-item" title="Experience & Type">
                    ${icons.briefcase}
                    <span>${job.experiences?.years ?? job.experiences?.min ?? 0}+ Years • ${job.jobType || 'N/A'}</span>
                </div>
                <div class="data-item" title="Qualification">
                    ${icons.graduation}
                    <span>${job.qualifications?.[0]?.degree || 'Any Degree'}</span>
                </div>
            </div>

            <div class="job-skills">
                ${skillsHtml}
            </div>

            <div class="job-expand-footer">
                <div class="applicant-count">
                    ${icons.users}
                    Applicants <span>${totalApps} / ${job.vacancies ?? '?'} needed</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    View Details
                    <svg class="icon expand-icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>
        `;

        // --- 2. Applicants Container ---
        const applicantsContainer = document.createElement('div');
        applicantsContainer.className = 'applicants-container';

        const applicantList = document.createElement('div');
        applicantList.className = 'applicant-list';

        if (job.applicants === null) {
            // Not yet fetched — will load on expand
            applicantList.innerHTML = `<div class="empty-state">Click to load applicants...</div>`;
        } else {
            renderApplicantList(applicantList, job.applicants, job);
        }

        applicantsContainer.appendChild(applicantList);
        jobCard.appendChild(jobSummary);
        jobCard.appendChild(applicantsContainer);
        container.appendChild(jobCard);
    });
}

function initProfileMenu() {
    const profileMenuButton = document.getElementById('profileMenuButton');
    const profilePopup = document.getElementById('profilePopup');
    const logoutButton = document.getElementById('logoutButton');
    let lastFocusedElement = null;

    if (!profileMenuButton || !profilePopup) return;

    function isProfilePopupOpen() {
        return !profilePopup.hidden;
    }

    function openProfilePopup() {
        lastFocusedElement = profileMenuButton;
        profilePopup.hidden = false;
        profilePopup.classList.add('open');
        profileMenuButton.setAttribute('aria-expanded', 'true');
        window.requestAnimationFrame(() => {
            if (logoutButton) logoutButton.focus();
        });
    }

    function closeProfilePopup(shouldRestoreFocus = true) {
        if (!isProfilePopupOpen()) return;
        profilePopup.hidden = true;
        profilePopup.classList.remove('open');
        profileMenuButton.setAttribute('aria-expanded', 'false');
        if (shouldRestoreFocus && lastFocusedElement?.focus) lastFocusedElement.focus();
    }

    function toggleProfilePopup() {
        isProfilePopupOpen() ? closeProfilePopup() : openProfilePopup();
    }

    profileMenuButton.addEventListener('click', (e) => { e.stopPropagation(); toggleProfilePopup(); });
    profilePopup.addEventListener('click', (e) => e.stopPropagation());

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('Logout requested');
            closeProfilePopup();
        });
    }

    document.addEventListener('click', (e) => {
        if (!isProfilePopupOpen()) return;
        if (profileMenuButton.contains(e.target) || profilePopup.contains(e.target)) return;
        closeProfilePopup(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isProfilePopupOpen()) { e.preventDefault(); closeProfilePopup(); }
    });
}

// Expose to window so inline onclick handlers in HTML work
window.deletePostJob = deletePostJob;
window.updateApplicationStatus = updateApplicationStatus;

document.addEventListener('DOMContentLoaded', initDashboard);