/* ================================================================
   HARK COSMOS LABS
   CORE EXPERIENCE CONTROLLER

   Controls:
   • General reveal animations
   • Mission navigation state
   • Smooth internal navigation
   • Navigation background behavior
   • Section tracking
   • Footer year
   • Progressive enhancement

   No external libraries required.
================================================================ */

(() => {
    "use strict";


    /* ============================================================
       MOTION PREFERENCE
    ============================================================ */

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    /* ============================================================
       GENERAL REVEAL SYSTEM
    ============================================================ */

    const revealElements =
        Array.from(
            document.querySelectorAll(
                ".reveal"
            )
        );


    function initializeReveals() {

        if (!revealElements.length) {
            return;
        }


        if (reduceMotion.matches) {

            revealElements.forEach(
                (element) => {

                    element.classList.add(
                        "visible"
                    );
                }
            );

            return;
        }


        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        "visible"
                                    );


                                /*
                                 * General page reveals happen once.
                                 * More cinematic sections use their
                                 * own dedicated observers.
                                 */

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.14,

                    rootMargin:
                        "0px 0px -7% 0px"
                }
            );


        revealElements.forEach(
            (element) => {

                observer.observe(
                    element
                );
            }
        );
    }


    /* ============================================================
       INTERNAL NAVIGATION
    ============================================================ */

    const internalLinks =
        Array.from(
            document.querySelectorAll(
                'a[href^="#"]'
            )
        );


    function initializeInternalNavigation() {

        if (!internalLinks.length) {
            return;
        }


        internalLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                href
                            );


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView(
                            {
                                behavior:
                                    reduceMotion.matches
                                        ? "auto"
                                        : "smooth",

                                block:
                                    "start"
                            }
                        );


                        /*
                         * Keep the URL meaningful without forcing
                         * the browser to perform a second jump.
                         */

                        if (
                            window.history &&
                            window.history.pushState
                        ) {

                            window.history.pushState(
                                null,
                                "",
                                href
                            );
                        }
                    }
                );
            }
        );
    }


    /* ============================================================
       MISSION NAVIGATION
    ============================================================ */

    const missionNav =
        document.querySelector(
            ".mission-nav"
        );


    let navFrame =
        null;


    function updateNavigationState() {

        navFrame = null;


        if (!missionNav) {
            return;
        }


        const isScrolled =
            window.scrollY > 40;


        missionNav.classList.toggle(
            "mission-nav-scrolled",
            isScrolled
        );
    }


    function requestNavigationUpdate() {

        if (navFrame) {
            return;
        }


        navFrame =
            requestAnimationFrame(
                updateNavigationState
            );
    }


    function initializeNavigationState() {

        if (!missionNav) {
            return;
        }


        window.addEventListener(
            "scroll",
            requestNavigationUpdate,
            {
                passive: true
            }
        );


        updateNavigationState();
    }


    /* ============================================================
       ACTIVE SECTION TRACKING
    ============================================================ */

    const navLinks =
        Array.from(
            document.querySelectorAll(
                ".mission-links a[href^='#']"
            )
        );


    function initializeSectionTracking() {

        if (!navLinks.length) {
            return;
        }


        const sectionMap =
            new Map();


        navLinks.forEach(
            (link) => {

                const selector =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !selector ||
                    selector === "#"
                ) {
                    return;
                }


                const section =
                    document.querySelector(
                        selector
                    );


                if (section) {

                    sectionMap.set(
                        section,
                        link
                    );
                }
            }
        );


        if (!sectionMap.size) {
            return;
        }


        const visibility =
            new Map();


        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            visibility.set(
                                entry.target,
                                entry.intersectionRatio
                            );
                        }
                    );


                    let strongestSection =
                        null;

                    let strongestRatio =
                        0;


                    sectionMap.forEach(
                        (
                            link,
                            section
                        ) => {

                            const ratio =
                                visibility.get(
                                    section
                                ) || 0;


                            if (
                                ratio >
                                strongestRatio
                            ) {

                                strongestRatio =
                                    ratio;

                                strongestSection =
                                    section;
                            }
                        }
                    );


                    navLinks.forEach(
                        (link) => {

                            link.classList.remove(
                                "active"
                            );

                            link.removeAttribute(
                                "aria-current"
                            );
                        }
                    );


                    if (
                        strongestSection &&
                        strongestRatio > 0
                    ) {

                        const activeLink =
                            sectionMap.get(
                                strongestSection
                            );


                        if (activeLink) {

                            activeLink.classList.add(
                                "active"
                            );

                            activeLink.setAttribute(
                                "aria-current",
                                "page"
                            );
                        }
                    }
                },
                {
                    threshold: [
                        0,
                        0.08,
                        0.15,
                        0.25,
                        0.4,
                        0.6
                    ],

                    rootMargin:
                        "-20% 0px -55% 0px"
                }
            );


        sectionMap.forEach(
            (
                link,
                section
            ) => {

                visibility.set(
                    section,
                    0
                );

                observer.observe(
                    section
                );
            }
        );
    }


    /* ============================================================
       KEYBOARD / FOCUS SUPPORT
    ============================================================ */

    function initializeInputMode() {

        document.body.classList.add(
            "using-pointer"
        );


        window.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Tab"
                ) {

                    document.body
                        .classList
                        .remove(
                            "using-pointer"
                        );
                }
            }
        );


        window.addEventListener(
            "pointerdown",
            () => {

                document.body
                    .classList
                    .add(
                        "using-pointer"
                    );
            },
            {
                passive: true
            }
        );
    }


    /* ============================================================
       FOOTER YEAR
    ============================================================ */

    function initializeFooterYear() {

        const yearElement =
            document.querySelector(
                "[data-current-year]"
            );


        if (!yearElement) {
            return;
        }


        yearElement.textContent =
            new Date()
                .getFullYear();
    }


    /* ============================================================
       PAGE READY STATE
    ============================================================ */

    function markPageReady() {

        requestAnimationFrame(
            () => {

                document.documentElement
                    .classList
                    .add(
                        "cosmos-ready"
                    );
            }
        );
    }


    /* ============================================================
       REDUCED-MOTION CHANGE
    ============================================================ */

    function handleMotionPreferenceChange() {

        if (!reduceMotion.matches) {
            return;
        }


        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible"
                );
            }
        );
    }


    if (
        typeof reduceMotion.addEventListener ===
        "function"
    ) {

        reduceMotion.addEventListener(
            "change",
            handleMotionPreferenceChange
        );

    } else if (
        typeof reduceMotion.addListener ===
        "function"
    ) {

        reduceMotion.addListener(
            handleMotionPreferenceChange
        );
    }


    /* ============================================================
       INITIALIZE EXPERIENCE
    ============================================================ */

    initializeReveals();

    initializeInternalNavigation();

    initializeNavigationState();

    initializeSectionTracking();

    initializeInputMode();

    initializeFooterYear();

    markPageReady();

})();
