/* ================================================================
   HARK COSMOS LABS
   COSMOS MIP — MISSION CONTROL SIMULATION

   Illustrative interface concept only.
   NOT LIVE SPACECRAFT DATA.

   Simulates:
   • Spacecraft telemetry
   • Mission data throughput
   • Signal state
   • Power and thermal state
   • Event processing
   • AI-assisted anomaly assessment

   No external libraries required.
================================================================ */

(() => {
    "use strict";


    /* ============================================================
       CONFIGURATION
    ============================================================ */

    const UPDATE_INTERVAL = 1600;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    /* ============================================================
       TELEMETRY ELEMENTS
    ============================================================ */

    const telemetry = {

        distance:
            document.querySelector(
                "[data-telemetry='distance']"
            ),

        velocity:
            document.querySelector(
                "[data-telemetry='velocity']"
            ),

        signal:
            document.querySelector(
                "[data-telemetry='signal']"
            ),

        power:
            document.querySelector(
                "[data-telemetry='power']"
            ),

        thermal:
            document.querySelector(
                "[data-telemetry='thermal']"
            ),

        dataRate:
            document.querySelector(
                "[data-telemetry='data-rate']"
            ),

        events:
            document.querySelector(
                "[data-telemetry='events']"
            )
    };


    /* ============================================================
       INITIAL SIMULATED STATE
    ============================================================ */

    const state = {

        distance: 7.420,

        velocity: 17.41,

        power: 87.2,

        dataRate: 3421,

        events: 128472,

        signal: "NOMINAL",

        thermal: "NOMINAL"
    };


    /* ============================================================
       HELPERS
    ============================================================ */

    function randomBetween(
        min,
        max
    ) {

        return (
            Math.random() *
            (max - min)
        ) + min;
    }


    function clamp(
        value,
        minimum,
        maximum
    ) {

        return Math.min(
            Math.max(
                value,
                minimum
            ),
            maximum
        );
    }


    function formatInteger(
        value
    ) {

        return Math.round(
            value
        ).toLocaleString(
            "en-US"
        );
    }


    /* ============================================================
       UPDATE SIMULATED STATE
    ============================================================ */

    function updateState() {

        /*
         * Distance increases very slowly to imply an outbound
         * autonomous science explorer.
         */

        state.distance +=
            randomBetween(
                0.00002,
                0.00007
            );


        /*
         * Velocity receives only small variations.
         */

        state.velocity +=
            randomBetween(
                -0.018,
                0.018
            );


        state.velocity =
            clamp(
                state.velocity,
                17.32,
                17.50
            );


        /*
         * Power changes gradually.
         */

        state.power +=
            randomBetween(
                -0.08,
                0.045
            );


        state.power =
            clamp(
                state.power,
                84.0,
                88.5
            );


        /*
         * Simulated science / engineering data throughput.
         */

        state.dataRate +=
            randomBetween(
                -115,
                125
            );


        state.dataRate =
            clamp(
                state.dataRate,
                2950,
                3900
            );


        /*
         * Simulated processed-event counter.
         */

        state.events +=
            Math.round(
                randomBetween(
                    2900,
                    3800
                )
            );


        /*
         * Most states remain nominal.
         */

        state.signal =
            Math.random() > 0.025
                ? "NOMINAL"
                : "DEGRADED";


        state.thermal =
            Math.random() > 0.018
                ? "NOMINAL"
                : "WATCH";
    }


    /* ============================================================
       RENDER TELEMETRY
    ============================================================ */

    function renderTelemetry() {

        if (telemetry.distance) {

            telemetry.distance.textContent =
                state.distance.toFixed(3);
        }


        if (telemetry.velocity) {

            telemetry.velocity.textContent =
                state.velocity.toFixed(2);
        }


        if (telemetry.power) {

            telemetry.power.textContent =
                state.power.toFixed(1);
        }


        if (telemetry.dataRate) {

            telemetry.dataRate.textContent =
                formatInteger(
                    state.dataRate
                );
        }


        if (telemetry.events) {

            telemetry.events.textContent =
                formatInteger(
                    state.events
                );
        }


        if (telemetry.signal) {

            telemetry.signal.textContent =
                state.signal;

            telemetry.signal.dataset.status =
                state.signal.toLowerCase();
        }


        if (telemetry.thermal) {

            telemetry.thermal.textContent =
                state.thermal;

            telemetry.thermal.dataset.status =
                state.thermal.toLowerCase();
        }
    }


    /* ============================================================
       MISSION CLOCK
    ============================================================ */

    const missionClock =
        document.querySelector(
            "[data-mission-clock]"
        );


    const simulationStart =
        Date.now();


    function renderMissionClock() {

        if (!missionClock) {
            return;
        }


        const elapsed =
            Date.now() -
            simulationStart;


        const totalSeconds =
            Math.floor(
                elapsed / 1000
            );


        const hours =
            Math.floor(
                totalSeconds / 3600
            );


        const minutes =
            Math.floor(
                (
                    totalSeconds % 3600
                ) / 60
            );


        const seconds =
            totalSeconds % 60;


        missionClock.textContent =
            [
                hours,
                minutes,
                seconds
            ]
                .map(
                    (value) =>
                        String(value)
                            .padStart(
                                2,
                                "0"
                            )
                )
                .join(":");
    }


    /* ============================================================
       PIPELINE ACTIVITY
    ============================================================ */

    const pipelineNodes =
        Array.from(
            document.querySelectorAll(
                ".mission-pipeline-node"
            )
        );


    let pipelineIndex = 0;


    function updatePipeline() {

        if (!pipelineNodes.length) {
            return;
        }


        pipelineNodes.forEach(
            (node) => {

                node.classList.remove(
                    "processing"
                );

                node.removeAttribute(
                    "aria-current"
                );
            }
        );


        const activeNode =
            pipelineNodes[
                pipelineIndex
            ];


        if (activeNode) {

            activeNode.classList.add(
                "processing"
            );

            activeNode.setAttribute(
                "aria-current",
                "step"
            );
        }


        pipelineIndex =
            (
                pipelineIndex + 1
            ) %
            pipelineNodes.length;
    }


    /* ============================================================
       SIMULATED EVENT LOG
    ============================================================ */

    const eventLog =
        document.querySelector(
            "[data-mission-log]"
        );


    const eventMessages = [

        "Telemetry frame validated",

        "Navigation solution synchronized",

        "Science packet indexed",

        "Thermal model updated",

        "Mission knowledge graph enriched",

        "Streaming event correlation complete",

        "Autonomous diagnostic cycle complete",

        "Telemetry schema validation passed",

        "Scientific event routed for analysis",

        "Mission-state vector refreshed"
    ];


    function addMissionEvent() {

        if (!eventLog) {
            return;
        }


        const line =
            document.createElement(
                "div"
            );


        line.className =
            "mission-log-line";


        const time =
            new Date()
                .toISOString()
                .substring(
                    11,
                    19
                );


        const message =
            eventMessages[
                Math.floor(
                    Math.random() *
                    eventMessages.length
                )
            ];


        line.innerHTML =
            `<span>${time}</span> ${message}`;


        eventLog.prepend(
            line
        );


        /*
         * Keep the simulated console small and efficient.
         */

        while (
            eventLog.children.length >
            6
        ) {

            eventLog.removeChild(
                eventLog.lastElementChild
            );
        }
    }


    /* ============================================================
       ANOMALY ASSESSMENT
    ============================================================ */

    const anomalyConfidence =
        document.querySelector(
            "[data-anomaly-confidence]"
        );


    const anomalyStatus =
        document.querySelector(
            "[data-anomaly-status]"
        );


    const anomalyRecommendation =
        document.querySelector(
            "[data-anomaly-recommendation]"
        );


    function renderAnomalyAssessment() {

        if (anomalyConfidence) {

            anomalyConfidence.textContent =
                "97.4%";
        }


        if (anomalyStatus) {

            anomalyStatus.textContent =
                "Reaction Wheel #3 vibration signature";
        }


        if (anomalyRecommendation) {

            anomalyRecommendation.textContent =
                "Run diagnostic sequence HCL-RW-03";
        }
    }


    /* ============================================================
       SIMULATION LOOP
    ============================================================ */

    let telemetryTimer = null;

    let clockTimer = null;

    let eventTimer = null;

    let pipelineTimer = null;


    function stopSimulation() {

        if (telemetryTimer) {

            clearInterval(
                telemetryTimer
            );

            telemetryTimer = null;
        }


        if (clockTimer) {

            clearInterval(
                clockTimer
            );

            clockTimer = null;
        }


        if (eventTimer) {

            clearInterval(
                eventTimer
            );

            eventTimer = null;
        }


        if (pipelineTimer) {

            clearInterval(
                pipelineTimer
            );

            pipelineTimer = null;
        }
    }


    function startSimulation() {

        stopSimulation();


        /*
         * Always render a complete initial state.
         */

        renderTelemetry();

        renderMissionClock();

        renderAnomalyAssessment();

        updatePipeline();

        addMissionEvent();


        /*
         * Reduced-motion users receive a stable interface rather
         * than continuously changing values.
         */

        if (reduceMotion.matches) {
            return;
        }


        telemetryTimer =
            window.setInterval(
                () => {

                    updateState();

                    renderTelemetry();

                },
                UPDATE_INTERVAL
            );


        clockTimer =
            window.setInterval(
                renderMissionClock,
                1000
            );


        eventTimer =
            window.setInterval(
                addMissionEvent,
                3100
            );


        pipelineTimer =
            window.setInterval(
                updatePipeline,
                820
            );
    }


    /* ============================================================
       PAGE VISIBILITY
    ============================================================ */

    function handleVisibilityChange() {

        if (document.hidden) {

            stopSimulation();

        } else {

            startSimulation();
        }
    }


    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );


    /* ============================================================
       MOTION PREFERENCE
    ============================================================ */

    function handleMotionChange() {

        startSimulation();
    }


    if (
        typeof reduceMotion.addEventListener ===
        "function"
    ) {

        reduceMotion.addEventListener(
            "change",
            handleMotionChange
        );

    } else if (
        typeof reduceMotion.addListener ===
        "function"
    ) {

        reduceMotion.addListener(
            handleMotionChange
        );
    }


    /* ============================================================
       INITIALIZE
    ============================================================ */

    const missionControlExists =
        document.querySelector(
            "[data-mission-control]"
        );


    if (!missionControlExists) {
        return;
    }


    startSimulation();

})();
