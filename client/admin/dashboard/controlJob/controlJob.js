
        // --- DUMMY DATA (Expanded based on User Schema) ---
        
        const dummyUsers = [
            { _id: 'u1', name: 'Alice Smith', email: 'alice.smith@example.com', profilePicture: { url: 'https://i.pravatar.cc/150?img=1' } },
            { _id: 'u2', name: 'Bob Johnson', email: 'bob.j@example.com', profilePicture: { url: 'https://i.pravatar.cc/150?img=11' } },
            { _id: 'u3', name: 'Charlie Davis', email: 'charlie.d@example.com', profilePicture: { url: 'https://i.pravatar.cc/150?img=12' } },
            { _id: 'u4', name: 'Diana Prince', email: 'diana.p@example.com', profilePicture: { url: 'https://i.pravatar.cc/150?img=5' } },
            { _id: 'u5', name: 'Evan Wright', email: 'evan.w@example.com', profilePicture: { url: 'https://i.pravatar.cc/150?img=15' } },
            { _id: 'u6', name: 'Fiona Gallagher', email: 'fiona.g@example.com', profilePicture: { url: 'https://i.pravatar.cc/150?img=9' } },
        ];

        const dummyJobs = [
            { 
                _id: 'job_8f72a', 
                title: 'Senior Full Stack MERN Developer', 
                location: ['Kolkata', 'Remote'], 
                salaryRange: '100k - 150k',
                jobType: 'Full-time', 
                workMode: 'Hybrid',
                experiences: { years: 5 },
                qualifications: [{ degree: 'B.Tech in Computer Science' }],
                requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'AWS', 'System Design'],
                applicationDeadline: new Date('2026-12-15T00:00:00'),
                vacancies: 2 
            },
            { 
                _id: 'job_3b91c', 
                title: 'UX/UI Product Designer', 
                location: ['Pune'], 
                salaryRange: '90k - 115k',
                jobType: 'Contract', 
                workMode: 'On-site', 
                experiences: { years: 3 },
                qualifications: [{ degree: 'B.Tech or equivalent' }],
                requiredSkills: ['Figma', 'Prototyping', 'User Research', 'Wireframing'],
                applicationDeadline: new Date('2026-10-30T00:00:00'),
                vacancies: 1 
            },
            { 
                _id: 'job_5d44e', 
                title: 'Frontend Developer Intern', 
                location: ['Remote'], 
                salaryRange: '20k / month',
                jobType: 'Internship', 
                workMode: 'Remote', 
                experiences: { years: 0 },
                qualifications: [{ degree: 'Currently pursuing B.Tech/B' }],
                requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React Basics'],
                applicationDeadline: new Date('2026-11-10T00:00:00'),
                vacancies: 5 
            }
        ];

        let dummyAppliedJobs = [
            { _id: 'app_1', job: 'job_8f72a', applicant: 'u1', status: 'Pending' },
            { _id: 'app_2', job: 'job_8f72a', applicant: 'u2', status: 'Shortlisted' },
            { _id: 'app_3', job: 'job_8f72a', applicant: 'u3', status: 'Pending' },
            { _id: 'app_4', job: 'job_3b91c', applicant: 'u4', status: 'Pending' },
            { _id: 'app_5', job: 'job_3b91c', applicant: 'u5', status: 'Rejected' },
            { _id: 'app_6', job: 'job_5d44e', applicant: 'u6', status: 'Pending' },
        ];

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

        // --- CORE LOGIC ---

        function initDashboard() {
            updateStatistics();
            renderJobList();
            initProfileMenu();
        }

        function updateStatistics() {
            const totalJobs = dummyJobs.length;
            const totalApps = dummyAppliedJobs.length;
            const shortlisted = dummyAppliedJobs.filter(app => app.status === 'Shortlisted').length;

            document.getElementById('stat-total-jobs').innerText = totalJobs;
            document.getElementById('stat-total-apps').innerText = totalApps;
            document.getElementById('stat-shortlisted').innerText = shortlisted;
        }

        function toggleJobAccordion(jobId) {
            const card = document.getElementById(`job-card-${jobId}`);
            card.classList.toggle('expanded');
        }

        function updateApplicationStatus(appId, newStatus, event) {
            // Prevent event from bubbling up and closing the accordion
            if(event) event.stopPropagation();

            const application = dummyAppliedJobs.find(app => app._id === appId);
            if (application) {
                application.status = newStatus;
            }
            
            updateStatistics();
            renderJobList();
            
            // Keep the accordion open after re-rendering
            if(application) {
                const card = document.getElementById(`job-card-${application.job}`);
                if(card) card.classList.add('expanded');
            }
        }

        function deletePostJob(jobId, event) {
            if (event) event.stopPropagation();

            const jobIndex = dummyJobs.findIndex(job => job._id === jobId);
            if (jobIndex === -1) {
                return;
            }

            dummyJobs.splice(jobIndex, 1);
            dummyAppliedJobs = dummyAppliedJobs.filter(app => app.job !== jobId);
            updateStatistics();
            renderJobList();
        }

        function getJobApplicants(jobId) {
            return dummyAppliedJobs
                .filter(app => app.job === jobId)
                .map(app => {
                    const user = dummyUsers.find(u => u._id === app.applicant);
                    return { ...app, user };
                });
        }

        function formatDate(date) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        function getApplicantMatchPercentage(app, job) {
            const seed = `${app._id}${job._id}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
            const statusBonus = app.status === 'Shortlisted' ? 8 : app.status === 'Rejected' ? -10 : 0;
            return Math.max(35, Math.min(98, 62 + (seed % 29) + statusBonus));
        }

        function renderJobList() {
            const container = document.getElementById('job-list-container');
            container.innerHTML = '';

            if (dummyJobs.length === 0) {
                container.innerHTML = `<div class="empty-state">No posted jobs yet. Post a new role to start receiving applications.</div>`;
                return;
            }

            dummyJobs.forEach(job => {
                const applicants = getJobApplicants(job._id);
                const skillsHtml = job.requiredSkills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
                const deadlineText = formatDate(job.applicationDeadline);
                
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
                            <span>${job.location[0]} (${job.workMode})</span>
                        </div>
                        <div class="data-item" title="Salary Range">
                            ${icons.salary}
                            <span>${job.salaryRange || 'Not specified'}</span>
                        </div>
                        <div class="data-item" title="Experience & Type">
                            ${icons.briefcase}
                            <span>${job.experiences.years}+ Years • ${job.jobType}</span>
                        </div>
                        <div class="data-item" title="Qualification">
                            ${icons.graduation}
                            <span>${job.qualifications[0]?.degree || 'Any Degree'}</span>
                        </div>
                    </div>

                    <div class="job-skills">
                        ${skillsHtml}
                    </div>

                    <div class="job-expand-footer">
                        <div class="applicant-count">
                            ${icons.users}
                            Applicants <span>${applicants.length} / ${job.vacancies} needed</span>
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

                if (applicants.length === 0) {
                    applicantList.innerHTML = `<div class="empty-state">No applications received yet. Keep sharing your job post!</div>`;
                } else {
                    applicants.forEach(app => {
                        const isPending = app.status === 'Pending';
                        const matchPercentage = getApplicantMatchPercentage(app, job);
                        
                        let badgeHtml = '';
                        if(app.status === 'Shortlisted') {
                            badgeHtml = `<span class="status-badge status-shortlisted">${icons.check} Shortlisted</span>`;
                        } else if(app.status === 'Rejected') {
                            badgeHtml = `<span class="status-badge status-rejected">${icons.x} Rejected</span>`;
                        }

                        const appItem = document.createElement('div');
                        appItem.className = 'applicant-item';
                        appItem.innerHTML = `
                            <div class="applicant-profile">
                                <img src="${app.user.profilePicture.url}" alt="${app.user.name}" class="applicant-img">
                                <div class="applicant-details">
                                    <h4>${app.user.name}</h4>
                                    <p>${app.user.email}</p>
                                </div>
                            </div>
                            <div class="applicant-actions">
                                <p>Matched</p>
                                <div class="match-ring" style="--match: ${matchPercentage};" aria-label="${matchPercentage}% profile match">
                                    <span>${matchPercentage}%</span>
                                </div>
                                ${!isPending ? badgeHtml : `
                                    <button class="btn btn-select" onclick="updateApplicationStatus('${app._id}', 'Shortlisted', event)">Select</button>
                                    <button class="btn btn-reject" onclick="updateApplicationStatus('${app._id}', 'Rejected', event)">Reject</button>
                                `}
                            </div>
                        `;
                        applicantList.appendChild(appItem);
                    });
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

            if (!profileMenuButton || !profilePopup) {
                return;
            }

            function isProfilePopupOpen() {
                return !profilePopup.hidden;
            }

            function openProfilePopup() {
                lastFocusedElement = profileMenuButton;
                profilePopup.hidden = false;
                profilePopup.classList.add('open');
                profileMenuButton.setAttribute('aria-expanded', 'true');

                window.requestAnimationFrame(() => {
                    if (logoutButton) {
                        logoutButton.focus();
                    }
                });
            }

            function closeProfilePopup(shouldRestoreFocus = true) {
                if (!isProfilePopupOpen()) {
                    return;
                }

                profilePopup.hidden = true;
                profilePopup.classList.remove('open');
                profileMenuButton.setAttribute('aria-expanded', 'false');

                if (shouldRestoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                    lastFocusedElement.focus();
                }
            }

            function toggleProfilePopup() {
                if (isProfilePopupOpen()) {
                    closeProfilePopup();
                    return;
                }

                openProfilePopup();
            }

            profileMenuButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleProfilePopup();
            });

            profilePopup.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    console.log('Logout requested');
                    closeProfilePopup();
                });
            }

            document.addEventListener('click', (event) => {
                if (!isProfilePopupOpen()) {
                    return;
                }

                if (profileMenuButton.contains(event.target) || profilePopup.contains(event.target)) {
                    return;
                }

                closeProfilePopup(false);
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && isProfilePopupOpen()) {
                    event.preventDefault();
                    closeProfilePopup();
                }
            });
        }

        document.addEventListener('DOMContentLoaded', initDashboard);

