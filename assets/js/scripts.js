/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Keep the footer copyright year current automatically
    const copyrightYear = document.body.querySelector('#copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Landing hero animation: one slow uniform fade-and-rise per element,
    // staggered top to bottom; the link icons reveal on scroll. Choreography
    // is in styles.css; this just starts it and ends it.
    runBuildSequence();

    // Scroll reveal: flip .is-visible on each .reveal element once it enters view,
    // then stop observing it. Reduced-motion or no IntersectionObserver: reveal all.
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('is-visible'));
        } else {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
            revealEls.forEach(el => io.observe(el));

            // Fallback: reveal anything already in view, in case the observer never
            // delivers (e.g. the page finished loading while its tab was hidden).
            const revealInView = () => {
                document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
                    const r = el.getBoundingClientRect();
                    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
                        el.classList.add('is-visible');
                    }
                });
            };
            let ticking = false;
            const onScroll = () => {
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(() => { ticking = false; revealInView(); });
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('load', revealInView);
            window.addEventListener('pageshow', revealInView);
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) revealInView();
            });
            revealInView(); // reveal whatever is already above the fold right away
        }
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// ===========================================================================
// Landing hero animation controller
// ---------------------------------------------------------------------------
// The choreography lives in CSS (styles.css, "Landing hero animation"): every
// hero piece shares the hero-rise keyframe, gated on .js-build.build-in, with
// a staggered delay. This fires the starting gun, reveals the link icons when
// they scroll into view (below the fold on phones), and ~3s later adds
// .build-done to drop the hidden-state rules. prefers-reduced-motion: skip
// straight to done. A <head> failsafe also adds .build-done after 3.6s if this
// never runs.
// ===========================================================================
function runBuildSequence() {
    var root = document.documentElement;
    if (!root.classList.contains('js-build')) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        root.classList.add('build-done');
        return;
    }

    var start = Date.now();

    // Start on the next frame so the pre-paint hidden state is committed first.
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            root.classList.add('build-in');
        });
    });

    // Link icons: reveal on scroll-into-view rather than on the timer, since
    // they're usually below the fold on phones. If they're already on screen
    // at load (desktop), hold them until the rest of the hero has finished so
    // they still come in last.
    var icons = document.querySelector('#about .social-icons');
    if (icons) {
        var revealIcons = function () { icons.classList.add('icons-in'); };
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries, obs) {
                if (!entries[0].isIntersecting) return;
                obs.disconnect();
                var elapsed = Date.now() - start;
                // On screen within the first moment => it was visible at load,
                // hold to ~1.2s so it lands just behind the rest. Otherwise the
                // user scrolled to it: reveal now.
                var wait = elapsed < 1100 ? Math.max(0, 1600 - elapsed) : 0;
                window.setTimeout(revealIcons, wait);
            }, { threshold: 0.2 });
            io.observe(icons);
        } else {
            window.setTimeout(revealIcons, 1600);
        }
    }

    // End once the last piece has landed (see the delays in styles.css), which
    // drops the hidden-state and animation rules so nothing lingers.
    window.setTimeout(function () {
        root.classList.add('build-done');
    }, 3000);
}
