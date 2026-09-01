/* ================================================================
   HARK COSMOS LABS
   CIVILIZATION HORIZON ENGINE

   Controls:
   • Great Questions reveal sequence
   • Pre-Type I → Type I → Type II → Type III progression
   • Civilization stage activation
   • Cosmic-scale reveal sequence

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
       GREAT QUESTIONS
    ============================================================ */

    const questions =
        Array.from(
            document.querySelectorAll(
                ".question"
            )
        );


    function initializeQuestions() {

        if (!questions.length) {
            return;
        }


        /*
         * Reduced-motion users receive the content immediately.
         */

        if (reduceMotion.matches) {

            questions.forEach(
                (question) => {
                    question.classList.add(
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

                            } else {

                                /*
                                 * Removing the state allows the
                                 * question to reveal again if the
                                 * visitor scrolls back through the
                                 * sequence.
                                 */

                                entry.target
                                    .classList
                                    .remove(
                                        "visible"
                                    );
                            }
                        }
                    );
                },
                {
                    threshold: 0.52,
                    rootMargin:
                        "-8% 0px -8% 0px"
                }
            );


        questions.forEach(
            (question) => {
                observer.observe(
                    question
                );
            }
        );
    }


    /* ============================================================
       CIVILIZATION STAGES
    ============================================================ */

    const civilizationStages =
        Array.from(
            document.querySelectorAll(
                ".civilization-stage"
            )
        );


    let currentCivilizationStage =
        null;


    function activateCivilizationStage(
        stage
    ) {

        if (!stage) {
            return;
        }


        civilizationStages.forEach(
            (item) => {

                const isCurrent =
                    item === stage;


                item.classList.toggle(
                    "active",
                    isCurrent
                );


                if (isCurrent) {

                    item.setAttribute(
                        "aria-current",
                        "step"
                    );

                } else {

                    item.removeAttribute(
                        "aria-current"
                    );
                }
            }
        );


        currentCivilizationStage =
            stage;


        updateCivilizationReadout(
            stage
        );
    }


    /* ============================================================
       CIVILIZATION READOUT
    ============================================================ */

    const civilizationReadout =
        document.querySelector(
            "[data-civilization-readout]"
        );


    function updateCivilizationReadout(
        stage
    ) {

        if (
            !civilizationReadout ||
            !stage
        ) {
            return;
        }


        const type =
            stage.dataset.type ||
            "CIVILIZATION";

        const label =
            stage.dataset.label ||
            "";


        civilizationReadout.textContent =
            label
                ? `${type} · ${label}`
                : type;
    }


    /* ============================================================
       CIVILIZATION OBSERVER
    ============================================================ */

    function initializeCivilizationTimeline() {

        if (!civilizationStages.length) {
            return;
        }


        /*
         * Always start with the first stage active.
         */

        activateCivilizationStage(
            civilizationStages[0]
        );


        if (reduceMotion.matches) {

            civilizationStages.forEach(
                (stage) => {
                    stage.style.opacity = "1";
                }
            );

            return;
        }


        const stageVisibility =
            new Map();


        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            stageVisibility.set(
                                entry.target,
                                entry.intersectionRatio
                            );
                        }
                    );


                    /*
                     * Select whichever civilization stage currently
                     * occupies the greatest amount of the viewport.
                     */

                    let strongestStage =
                        currentCivilizationStage;

                    let strongestRatio =
                        0;


                    civilizationStages.forEach(
                        (stage) => {

                            const ratio =
                                stageVisibility.get(
                                    stage
                                ) || 0;


                            if (
                                ratio >
                                strongestRatio
                            ) {

                                strongestRatio =
                                    ratio;

                                strongestStage =
                                    stage;
                            }
                        }
                    );


                    if (
                        strongestStage &&
                        strongestRatio > 0.18 &&
                        strongestStage !==
                            currentCivilizationStage
                    ) {

                        activateCivilizationStage(
                            strongestStage
                        );
                    }
                },
                {
                    threshold: [
                        0,
                        0.18,
                        0.3,
                        0.45,
                        0.6,
                        0.75
                    ],

                    rootMargin:
                        "-18% 0px -18% 0px"
                }
            );


        civilizationStages.forEach(
            (stage) => {

                stageVisibility.set(
                    stage,
                    0
                );

                observer.observe(
                    stage
                );
            }
        );
    }


    /* ============================================================
       CIVILIZATION CINEMATIC SECTIONS
    ============================================================ */

    const cinematicSections =
        Array.from(
            document.querySelectorAll(
                ".civilization-cinematic"
            )
        );


    function initializeCinematicSections() {

        if (!cinematicSections.length) {
            return;
        }


        if (reduceMotion.matches) {

            cinematicSections.forEach(
                (section) => {
                    section.classList.add(
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
                            }
                        }
                    );
                },
                {
                    threshold: 0.24
                }
            );


        cinematicSections.forEach(
            (section) => {
                observer.observe(
                    section
                );
            }
        );
    }


    /* ============================================================
       COSMIC SCALE
    ============================================================ */

    const scaleStages =
        Array.from(
            document.querySelectorAll(
                ".scale-stage"
            )
        );


    function initializeCosmicScale() {

        if (!scaleStages.length) {
            return;
        }


        if (reduceMotion.matches) {

            scaleStages.forEach(
                (stage) => {
                    stage.classList.add(
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

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.34,
                    rootMargin:
                        "0px 0px -8% 0px"
                }
            );


        scaleStages.forEach(
            (stage) => {
                observer.observe(
                    stage
                );
            }
        );
    }


    /* ============================================================
       CIVILIZATION PROGRESS
    ============================================================ */

    const civilizationSection =
        document.querySelector(
            ".civilization-section"
        );


    const civilizationProgress =
        document.querySelector(
            "[data-civilization-progress]"
        );


    let progressFrame =
        null;


    function calculateCivilizationProgress() {

        progressFrame =
            null;


        if (
            !civilizationSection ||
            !civilizationProgress
        ) {
            return;
        }


        const rect =
            civilizationSection
                .getBoundingClientRect();


        const viewportHeight =
            window.innerHeight;


        const totalTravel =
            rect.height +
            viewportHeight;


        const travelled =
            viewportHeight -
            rect.top;


        let progress =
            travelled /
            totalTravel;


        progress =
            Math.min(
                Math.max(
                    progress,
                    0
                ),
                1
            );


        civilizationProgress.style
            .setProperty(
                "--civilization-progress",
                progress
            );


        civilizationProgress
            .setAttribute(
                "aria-valuenow",
                Math.round(
                    progress * 100
                )
            );
    }


    function requestProgressUpdate() {

        if (progressFrame) {
            return;
        }


        progressFrame =
            requestAnimationFrame(
                calculateCivilizationProgress
            );
    }


    function initializeProgress() {

        if (
            !civilizationSection ||
            !civilizationProgress
        ) {
            return;
        }


        window.addEventListener(
            "scroll",
            requestProgressUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestProgressUpdate,
            {
                passive: true
            }
        );


        calculateCivilizationProgress();
    }


    /* ============================================================
       MOTION PREFERENCE CHANGE
    ============================================================ */

    function handleMotionPreferenceChange() {

        if (reduceMotion.matches) {

            questions.forEach(
                (question) => {
                    question.classList.add(
                        "visible"
                    );
                }
            );


            scaleStages.forEach(
                (stage) => {
                    stage.classList.add(
                        "visible"
                    );
                }
            );


            cinematicSections.forEach(
                (section) => {
                    section.classList.add(
                        "visible"
                    );
                }
            );
        }
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
       INITIALIZE
    ============================================================ */

    initializeQuestions();

    initializeCivilizationTimeline();

    initializeCinematicSections();

    initializeCosmicScale();

    initializeProgress();

})();
