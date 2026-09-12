console.log("PORTFOLIO SCRIPT LOADED");

/* =========================================================
   ANIL RIJAL PORTFOLIO
   Professional Portfolio JavaScript
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const GITHUB_USERNAME = "Anil702429";

const PORTFOLIO_TOPIC = "portfolio";

const FEATURED_TOPIC = "featured";

const MAX_PROJECTS = 20;


/* =========================================================
   DOM
   ========================================================= */

const body = document.body;

const themeToggle =
    document.getElementById("themeToggle");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const navLinks =
    document.querySelectorAll(".nav-link");

const scrollProgress =
    document.getElementById("scrollProgress");

const projectsGrid =
    document.getElementById("projectsGrid");


/* =========================================================
   THEME
   ========================================================= */

function getStoredTheme() {

    return (
        localStorage.getItem("portfolio-theme") ||
        "dark"
    );

}


function setTheme(theme) {

    body.classList.remove(
        "dark-mode",
        "light-mode"
    );

    body.classList.add(
        `${theme}-mode`
    );

    localStorage.setItem(
        "portfolio-theme",
        theme
    );


    if (themeToggle) {

        const icon =
            themeToggle.querySelector("i");

        if (icon) {

            icon.className =
                theme === "dark"
                    ? "fas fa-sun"
                    : "fas fa-moon";

        }

    }

}


setTheme(
    getStoredTheme()
);


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            const newTheme =
                body.classList.contains("dark-mode")
                    ? "light"
                    : "dark";

            setTheme(newTheme);

        }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function closeMenu() {

    if (!navMenu || !menuToggle) {
        return;
    }


    navMenu.classList.remove("active");

    menuToggle.classList.remove("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    body.classList.remove(
        "menu-open"
    );

}


function toggleMenu() {

    if (!navMenu || !menuToggle) {
        return;
    }


    const isOpen =
        navMenu.classList.toggle(
            "active"
        );


    menuToggle.classList.toggle(
        "active",
        isOpen
    );


    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );


    body.classList.toggle(
        "menu-open",
        isOpen
    );

}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        toggleMenu
    );

}


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                closeMenu();

            }
        );

    }
);


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function updateScrollProgress() {

    if (!scrollProgress) {
        return;
    }


    const scrollTop =
        window.scrollY;


    const documentHeight =
        document.documentElement
            .scrollHeight -
        window.innerHeight;


    if (documentHeight <= 0) {
        return;
    }


    const percentage =
        (scrollTop /
            documentHeight) *
        100;


    scrollProgress.style.width =
        `${percentage}%`;

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function updateActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const scrollPosition =
        window.scrollY + 160;


    let currentSection = "";


    sections.forEach(
        section => {

            if (
                scrollPosition >=
                    section.offsetTop
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    navLinks.forEach(
        link => {

            const href =
                link.getAttribute(
                    "href"
                );


            link.classList.toggle(
                "active",
                href ===
                    `#${currentSection}`
            );

        }
    );

}


/* =========================================================
   SCROLL HANDLER
   ========================================================= */

let ticking = false;


function handleScroll() {

    if (ticking) {
        return;
    }


    window.requestAnimationFrame(
        () => {

            updateScrollProgress();

            updateActiveNavigation();

            ticking = false;

        }
    );


    ticking = true;

}


window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
);


/* =========================================================
   INTERSECTION OBSERVER
   ========================================================= */

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }


                    entry.target.classList.add(
                        "visible"
                    );


                    revealObserver.unobserve(
                        entry.target
                    );

                }
            );

        },
        {
            threshold: 0.08,

            rootMargin:
                "0px 0px -40px 0px"
        }
    );


function observeRevealElements() {

    document
        .querySelectorAll(
            ".work-item, .skill-card, .about-main, .about-stats, .contact-box"
        )
        .forEach(
            element => {

                element.classList.add(
                    "fade-in"
                );

                revealObserver.observe(
                    element
                );

            }
        );

}


/* =========================================================
   GITHUB PROJECTS
   ========================================================= */

async function loadGitHubProjects() {

    if (!projectsGrid) {
        console.error("❌ projectsGrid not found");
        return;
    }

    console.log("🔵 Starting GitHub project loading...");

    showLoading();

    const apiUrl =
        "https://api.github.com/search/repositories" +
        `?q=user:${encodeURIComponent(GITHUB_USERNAME)}+topic:${encodeURIComponent(PORTFOLIO_TOPIC)}` +
        "&sort=updated" +
        "&order=desc" +
        `&per_page=${MAX_PROJECTS}`;

    console.log("🌐 GitHub API URL:", apiUrl);

    try {

        const response = await fetch(apiUrl, {
            headers: {
                Accept: "application/vnd.github+json"
            }
        });

        console.log("📡 GitHub HTTP status:", response.status);
        console.log("📡 GitHub response OK:", response.ok);

        const data = await response.json();

        console.log("📦 GitHub API response:", data);
        console.log("📊 Total repositories found:", data.total_count);

        if (!response.ok) {
            throw new Error(
                data.message ||
                `GitHub API error: ${response.status}`
            );
        }

        let repositories =
            Array.isArray(data.items)
                ? data.items
                : [];

        console.log(
            "📁 Repositories returned:",
            repositories.map(repo => ({
                name: repo.name,
                topics: repo.topics,
                language: repo.language,
                url: repo.html_url
            }))
        );

        repositories = repositories.filter(
            repository =>
                repository.name.toLowerCase() !== "portfolio"
        );

        if (repositories.length === 0) {

            console.warn(
                "⚠️ GitHub returned no portfolio repositories."
            );

            showEmptyState();
            return;
        }

        repositories.sort((a, b) => {

            const aFeatured =
                Array.isArray(a.topics) &&
                a.topics.includes(FEATURED_TOPIC);

            const bFeatured =
                Array.isArray(b.topics) &&
                b.topics.includes(FEATURED_TOPIC);

            if (aFeatured !== bFeatured) {
                return bFeatured ? 1 : -1;
            }

            return (
                new Date(b.updated_at) -
                new Date(a.updated_at)
            );

        });

        console.log(
            "✅ Rendering repositories:",
            repositories.length
        );

        projectsGrid.innerHTML = "";

        repositories.forEach(
            (repository, index) => {

                projectsGrid.appendChild(
                    createProjectCard(
                        repository,
                        index
                    )
                );

            }
        );

        initializeProjectLinks();
        observeRevealElements();

        console.log("✅ GitHub projects rendered successfully.");

    } catch (error) {

        console.error(
            "❌ Unable to load GitHub projects:",
            error
        );

        showErrorState();
    }
}


/* =========================================================
   PROJECT CARD
   ========================================================= */

function createProjectCard(repository, index) {

    const article = document.createElement("article");

    article.className = "work-item";

    const topics = Array.isArray(repository.topics)
        ? repository.topics.filter(topic =>
            topic !== PORTFOLIO_TOPIC &&
            topic !== FEATURED_TOPIC
        )
        : [];

    if (topics.length === 0 && repository.language) {
        topics.push(repository.language);
    }

    const visibleTopics = topics.slice(0, 4);

    const isFeatured =
        Array.isArray(repository.topics) &&
        repository.topics.includes(FEATURED_TOPIC);

    const description =
        repository.description ||
        "A software project developed by Anil Rijal.";

    const homepage =
        typeof repository.homepage === "string" &&
        repository.homepage.trim()
            ? repository.homepage.trim()
            : null;

    const githubUrl = repository.html_url;

    const language = repository.language || "Code";

    const stars = repository.stargazers_count || 0;
    const forks = repository.forks_count || 0;

    const tags = visibleTopics
        .map(topic => `
            <span class="project-tag">
                ${escapeHTML(formatTopic(topic))}
            </span>
        `)
        .join("");

    /*
     * Generate a clean visual instead of using GitHub's
     * OpenGraph image.
     */

    const projectInitial =
        repository.name
            .charAt(0)
            .toUpperCase();

    article.innerHTML = `

        <div class="project-visual">

            <div class="project-visual-grid"></div>

            <div class="project-visual-content">

                <span class="project-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <div class="project-icon">
                    ${escapeHTML(projectInitial)}
                </div>

                <span class="project-language">
                    ${escapeHTML(language)}
                </span>

            </div>

            ${
                isFeatured
                    ? `
                        <span class="featured-badge">
                            <i class="fas fa-star"></i>
                            Featured
                        </span>
                    `
                    : ""
            }

        </div>


        <div class="project-body">

            <div class="project-title-row">

                <h3>
                    ${escapeHTML(
                        formatProjectName(repository.name)
                    )}
                </h3>

            </div>


            <p class="project-description">
                ${escapeHTML(description)}
            </p>


            ${
                tags
                    ? `
                        <div class="work-tags">
                            ${tags}
                        </div>
                    `
                    : ""
            }


            <div class="project-meta">

                <span>
                    <i class="fas fa-star"></i>
                    ${stars}
                </span>

                <span>
                    <i class="fas fa-code-branch"></i>
                    ${forks}
                </span>

                <span>
                    <i class="fas fa-code"></i>
                    ${escapeHTML(language)}
                </span>

            </div>


            <div class="project-links">

                <a
                    href="${escapeHTML(githubUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                    data-external="true"
                >
                    <i class="fab fa-github"></i>
                    GitHub
                </a>


                ${
                    homepage
                        ? `
                            <a
                                href="${escapeHTML(homepage)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="project-link project-link-primary"
                                data-external="true"
                            >
                                <i class="fas fa-arrow-up-right-from-square"></i>
                                Live Demo
                            </a>
                        `
                        : ""
                }

            </div>

        </div>

    `;

    return article;
} {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "work-item";


    const topics =
        Array.isArray(
            repository.topics
        )
            ? repository.topics.filter(
                topic =>
                    topic !==
                        PORTFOLIO_TOPIC &&
                    topic !==
                        FEATURED_TOPIC
            )
            : [];


    if (
        topics.length === 0 &&
        repository.language
    ) {

        topics.push(
            repository.language
        );

    }


    const visibleTopics =
        topics.slice(0, 4);


    const tags =
        visibleTopics
            .map(
                topic =>
                    `<span>${escapeHTML(
                        formatTopic(topic)
                    )}</span>`
            )
            .join("");


    const isFeatured =
        Array.isArray(
            repository.topics
        ) &&
        repository.topics.includes(
            FEATURED_TOPIC
        );


    const imageUrl =
        `https://opengraph.githubassets.com/1/` +
        `${GITHUB_USERNAME}/` +
        `${repository.name}`;


    const fallbackImage =
        "https://images.unsplash.com/" +
        "photo-1555066931-4365d14bab8c" +
        "?w=1200&h=800&fit=crop";


    const description =
        repository.description ||
        "A software project developed by Anil Rijal.";


    const homepage =
        typeof repository.homepage ===
            "string" &&
        repository.homepage.trim()
            ? repository.homepage.trim()
            : null;


    article.innerHTML = `

        <div class="work-image">

            <img
                src="${imageUrl}"
                alt="${escapeHTML(
                    repository.name
                )}"
                loading="${
                    index < 2
                        ? "eager"
                        : "lazy"
                }"
                onerror="
                    this.onerror = null;
                    this.src = '${fallbackImage}';
                "
            >


            <div class="work-overlay">

                <div class="work-content">


                    <div class="project-title-row">

                        <h3>
                            ${escapeHTML(
                                formatProjectName(
                                    repository.name
                                )
                            )}
                        </h3>

                        ${
                            isFeatured
                                ? `
                                    <span class="featured-badge">
                                        Featured
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    <p>
                        ${escapeHTML(
                            description
                        )}
                    </p>


                    ${
                        tags
                            ? `
                                <div class="work-tags">
                                    ${tags}
                                </div>
                            `
                            : ""
                    }


                    <div class="project-links">

                        <a
                            href="${escapeHTML(
                                repository.html_url
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                            data-external="true"
                        >

                            <i class="fab fa-github"></i>

                            GitHub

                        </a>


                        ${
                            homepage
                                ? `
                                    <a
                                        href="${escapeHTML(
                                            homepage
                                        )}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="project-link"
                                        data-external="true"
                                    >

                                        <i class="fas fa-arrow-up-right-from-square"></i>

                                        Live Demo

                                    </a>
                                `
                                : ""
                        }

                    </div>

                </div>

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   PROJECT FORMATTING
   ========================================================= */

function formatProjectName(
    name
) {

    return name
        .replace(
            /[-_]+/g,
            " "
        )
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );

}


function formatTopic(
    topic
) {

    return topic
        .replace(
            /[-_]+/g,
            " "
        )
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );

}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value ?? "";


    return element.innerHTML;

}


/* =========================================================
   PROJECT STATES
   ========================================================= */

function showLoading() {

    projectsGrid.innerHTML = `

        <div class="projects-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading projects...
            </p>

        </div>

    `;

}


function showEmptyState() {

    projectsGrid.innerHTML = `

        <div class="projects-message">

            <i class="fab fa-github"></i>

            <h3>
                No portfolio projects yet
            </h3>

            <p>
                Add the
                <strong>portfolio</strong>
                topic to a GitHub repository
                to display it here.
            </p>

        </div>

    `;

}


function showErrorState() {

    projectsGrid.innerHTML = `

        <div class="projects-message">

            <i class="fas fa-circle-exclamation"></i>

            <h3>
                Projects unavailable
            </h3>

            <p>
                GitHub could not be reached.
                Please try again.
            </p>

            <button
                type="button"
                class="button button-secondary project-retry"
            >
                Try again
            </button>

        </div>

    `;


    const retryButton =
        projectsGrid.querySelector(
            ".project-retry"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadGitHubProjects
        );

    }

}


/* =========================================================
   EXTERNAL LINKS
   ========================================================= */

function initializeProjectLinks() {

    document
        .querySelectorAll(
            '[data-external="true"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        console.log(
                            "Opening:",
                            link.href
                        );

                    }
                );

            }
        );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        observeRevealElements();

        loadGitHubProjects();

        updateScrollProgress();

        updateActiveNavigation();

    }
);


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeMenu();

        }

    }
);


/* =========================================================
   PUBLIC API
   ========================================================= */

window.PortfolioApp = {

    loadGitHubProjects,

    setTheme,

    toggleMenu,

    closeMenu

};