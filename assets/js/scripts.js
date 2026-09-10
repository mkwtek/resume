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

    // Landing "build" sequence safety net: once the sequence has had time to
    // finish, add .build-done so a stalled animation can't leave the name or
    // bio stuck hidden. Harmless if the animation already ran.
    if (document.documentElement.classList.contains('js-build')) {
        window.setTimeout(function () {
            document.documentElement.classList.add('build-done');
        }, 2600);
    }

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
