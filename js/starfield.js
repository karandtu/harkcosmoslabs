/* ================================================================
   HARK COSMOS LABS
   COSMIC STARFIELD ENGINE

   Purpose:
   Creates a subtle multi-depth stellar environment behind the
   HARK COSMOS LABS experience.

   No external libraries required.
================================================================ */

(() => {
    "use strict";

    const canvas = document.getElementById("cosmic-starfield");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d", {
        alpha: true
    });

    if (!ctx) {
        return;
    }


    /* ============================================================
       CONFIGURATION
    ============================================================ */

    const STAR_DENSITY = 0.000105;

    const MIN_STARS = 120;
    const MAX_STARS = 520;

    const MAX_DEVICE_PIXEL_RATIO = 2;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    /* ============================================================
       STATE
    ============================================================ */

    let width = 0;
    let height = 0;

    let pixelRatio = 1;

    let stars = [];

    let animationFrame = null;

    let lastTimestamp = 0;

    let mouseX = 0;
    let mouseY = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;

    let scrollY = window.scrollY || 0;

    let targetScrollY = scrollY;

    let documentVisible = true;


    /* ============================================================
       HELPERS
    ============================================================ */

    function random(min, max) {
        return (
            Math.random() *
            (max - min)
        ) + min;
    }


    function clamp(value, min, max) {
        return Math.min(
            Math.max(value, min),
            max
        );
    }


    function starCount() {

        const calculated =
            Math.floor(
                width *
                height *
                STAR_DENSITY
            );

        return clamp(
            calculated,
            MIN_STARS,
            MAX_STARS
        );
    }


    /* ============================================================
       STAR FACTORY
    ============================================================ */

    function createStar() {

        const depth =
            Math.random();

        let radius;
        let opacity;
        let parallax;

        /*
         * Three broad depth layers.
         *
         * Far stars:
         * numerous, tiny, nearly static.
         *
         * Mid stars:
         * slightly brighter.
         *
         * Near stars:
         * rare, brighter and more responsive.
         */

        if (depth < 0.64) {

            radius =
                random(0.28, 0.72);

            opacity =
                random(0.20, 0.55);

            parallax =
                random(0.5, 1.8);

        } else if (depth < 0.91) {

            radius =
                random(0.55, 1.05);

            opacity =
                random(0.35, 0.72);

            parallax =
                random(1.8, 4.0);

        } else {

            radius =
                random(0.85, 1.45);

            opacity =
                random(0.50, 0.92);

            parallax =
                random(4.0, 7.5);
        }


        /*
         * Most stars remain neutral white-blue.
         * A very small percentage receive subtle spectral variation.
         */

        const colorRoll =
            Math.random();

        let color;

        if (colorRoll < 0.055) {

            color = {
                r: 166,
                g: 207,
                b: 255
            };

        } else if (colorRoll > 0.975) {

            color = {
                r: 255,
                g: 230,
                b: 188
            };

        } else {

            color = {
                r: 238,
                g: 246,
                b: 255
            };
        }


        return {

            x:
                Math.random() *
                width,

            y:
                Math.random() *
                height,

            radius,

            baseOpacity:
                opacity,

            opacity,

            color,

            parallax,

            twinkleSpeed:
                random(0.00025, 0.0011),

            twinkleOffset:
                random(
                    0,
                    Math.PI * 2
                ),

            drift:
                random(
                    -0.0025,
                    0.0025
                )
        };
    }


    /* ============================================================
       BUILD STAR FIELD
    ============================================================ */

    function buildStars() {

        const count =
            starCount();

        stars =
            Array.from(
                { length: count },
                createStar
            );
    }


    /* ============================================================
       RESIZE
    ============================================================ */

    function resizeCanvas() {

        width =
            window.innerWidth;

        height =
            window.innerHeight;

        pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                MAX_DEVICE_PIXEL_RATIO
            );


        canvas.width =
            Math.floor(
                width *
                pixelRatio
            );

        canvas.height =
            Math.floor(
                height *
                pixelRatio
            );


        canvas.style.width =
            `${width}px`;

        canvas.style.height =
            `${height}px`;


        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );


        buildStars();
    }


    /* ============================================================
       POINTER PARALLAX
    ============================================================ */

    function handlePointerMove(event) {

        if (reduceMotion.matches) {
            return;
        }

        targetMouseX =
            (
                event.clientX /
                width
            ) - 0.5;

        targetMouseY =
            (
                event.clientY /
                height
            ) - 0.5;
    }


    function handlePointerLeave() {

        targetMouseX = 0;
        targetMouseY = 0;
    }


    /* ============================================================
       SCROLL PARALLAX
    ============================================================ */

    function handleScroll() {

        targetScrollY =
            window.scrollY || 0;
    }


    /* ============================================================
       STAR DRAWING
    ============================================================ */

    function drawStar(
        star,
        timestamp
    ) {

        let x = star.x;
        let y = star.y;


        if (!reduceMotion.matches) {

            x +=
                mouseX *
                star.parallax *
                2.6;

            y +=
                mouseY *
                star.parallax *
                1.8;


            /*
             * Tiny scroll movement creates the impression that
             * different stellar layers exist at different depths.
             */

            y -=
                (
                    scrollY *
                    star.parallax *
                    0.002
                ) % height;
        }


        /*
         * Wrap stars around viewport.
         */

        if (x < -10) {
            x += width + 20;
        }

        if (x > width + 10) {
            x -= width + 20;
        }

        y =
            (
                (
                    y % height
                ) + height
            ) % height;


        /*
         * Subtle stellar scintillation.
         */

        let opacity =
            star.baseOpacity;

        if (!reduceMotion.matches) {

            const twinkle =
                Math.sin(
                    timestamp *
                    star.twinkleSpeed +
                    star.twinkleOffset
                );

            opacity +=
                twinkle *
                0.12;
        }


        opacity =
            clamp(
                opacity,
                0.08,
                1
            );


        const {
            r,
            g,
            b
        } = star.color;


        /*
         * Small glow only for the nearest stars.
         * Most stars remain sharp.
         */

        if (
            star.radius > 1.12 &&
            opacity > 0.6
        ) {

            const glow =
                ctx.createRadialGradient(
                    x,
                    y,
                    0,
                    x,
                    y,
                    star.radius * 5
                );

            glow.addColorStop(
                0,
                `rgba(${r}, ${g}, ${b}, ${opacity * 0.42})`
            );

            glow.addColorStop(
                1,
                `rgba(${r}, ${g}, ${b}, 0)`
            );


            ctx.beginPath();

            ctx.fillStyle =
                glow;

            ctx.arc(
                x,
                y,
                star.radius * 5,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }


        /*
         * Stellar point.
         */

        ctx.beginPath();

        ctx.fillStyle =
            `rgba(
                ${r},
                ${g},
                ${b},
                ${opacity}
            )`;

        ctx.arc(
            x,
            y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* ============================================================
       DRAW FRAME
    ============================================================ */

    function draw(timestamp = 0) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
         * Ease pointer and scroll values rather than immediately
         * snapping to them.
         */

        mouseX +=
            (
                targetMouseX -
                mouseX
            ) * 0.035;

        mouseY +=
            (
                targetMouseY -
                mouseY
            ) * 0.035;

        scrollY +=
            (
                targetScrollY -
                scrollY
            ) * 0.07;


        for (
            let index = 0;
            index < stars.length;
            index += 1
        ) {

            const star =
                stars[index];


            /*
             * Almost imperceptible stellar drift.
             */

            if (
                !reduceMotion.matches &&
                timestamp !== lastTimestamp
            ) {

                star.x +=
                    star.drift;
            }


            drawStar(
                star,
                timestamp
            );
        }


        lastTimestamp =
            timestamp;


        if (
            documentVisible &&
            !reduceMotion.matches
        ) {

            animationFrame =
                requestAnimationFrame(
                    draw
                );
        }
    }


    /* ============================================================
       STATIC REDUCED-MOTION FRAME
    ============================================================ */

    function renderAccordingToMotionPreference() {

        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;
        }


        if (reduceMotion.matches) {

            mouseX = 0;
            mouseY = 0;

            targetMouseX = 0;
            targetMouseY = 0;

            draw(0);

        } else if (
            documentVisible
        ) {

            animationFrame =
                requestAnimationFrame(
                    draw
                );
        }
    }


    /* ============================================================
       PAGE VISIBILITY
    ============================================================ */

    function handleVisibilityChange() {

        documentVisible =
            !document.hidden;


        if (!documentVisible) {

            if (animationFrame) {

                cancelAnimationFrame(
                    animationFrame
                );

                animationFrame = null;
            }

            return;
        }


        renderAccordingToMotionPreference();
    }


    /* ============================================================
       EVENT LISTENERS
    ============================================================ */

    window.addEventListener(
        "resize",
        resizeCanvas,
        {
            passive: true
        }
    );


    window.addEventListener(
        "pointermove",
        handlePointerMove,
        {
            passive: true
        }
    );


    document.documentElement.addEventListener(
        "mouseleave",
        handlePointerLeave
    );


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );


    if (
        typeof reduceMotion.addEventListener ===
        "function"
    ) {

        reduceMotion.addEventListener(
            "change",
            renderAccordingToMotionPreference
        );

    } else if (
        typeof reduceMotion.addListener ===
        "function"
    ) {

        /*
         * Compatibility for older browsers.
         */

        reduceMotion.addListener(
            renderAccordingToMotionPreference
        );
    }


    /* ============================================================
       INITIALIZE
    ============================================================ */

    resizeCanvas();

    renderAccordingToMotionPreference();

})();
