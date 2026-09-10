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

    // Landing "build" sequence: the hero assembles itself on load. Each piece
    // gets a randomised entry vector (direction, rotation, scale), easing and
    // delay, so the page comes together a little differently every visit. CSS
    // (.js-build / .build-el / #about h2::after) holds the hidden state and the
    // transitions; this picks the numbers and flips .build-in.
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
// Landing "build" sequence
// ---------------------------------------------------------------------------
// The hero assembles itself on load. Every piece (each letter of the name, the
// title, the accent rule, the contact line, the bio, each link icon and label,
// the sidebar photo and nav links) gets a randomised entry: direction it flies
// in from, rotation, scale, easing, and a jittered delay. The CSS holds the
// pre-paint hidden state and the transitions; this only picks numbers and
// flips .build-in. prefers-reduced-motion or a thrown error: everything just
// shows. A <head> failsafe adds .build-done after 5s if this never runs.
// ===========================================================================
function runBuildSequence() {
    var root = document.documentElement;
    if (!root.classList.contains('js-build')) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
        root.classList.add('build-done');
        return;
    }

    try {
        var about = document.getElementById('about');
        if (!about) {
            root.classList.add('build-done');
            return;
        }

        var rand = function (min, max) { return min + Math.random() * (max - min); };
        var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

        // A random "flew in from over there" transform.
        //   dist  - how far out it starts (px)
        //   rot   - max rotation (deg, +/-)
        //   shrink- how much smaller it starts (0 = same size, 0.6 = 40% size)
        var entryVector = function (dist, rot, shrink) {
            var angle = rand(0, Math.PI * 2);
            var d = dist * rand(0.6, 1);
            var x = Math.cos(angle) * d;
            var y = Math.sin(angle) * d;
            var r = rand(-rot, rot);
            var s = 1 - Math.random() * (shrink || 0);
            return 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px) rotate(' +
                r.toFixed(1) + 'deg) scale(' + s.toFixed(3) + ')';
        };

        var units = []; // { el, transform, dur, ease, delay }
        var add = function (el, transform, dur, ease, delay) {
            if (el) units.push({ el: el, transform: transform, dur: dur, ease: ease, delay: delay });
        };

        var bounce = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
        var glide = 'cubic-bezier(0.16, 1, 0.3, 1)';

        // ---- 1. The name, letter by letter --------------------------------
        var h1 = about.querySelector('h1');
        var letters = h1 ? splitIntoLetters(h1) : [];
        if (h1) h1.style.opacity = '1';
        var letterStart = 0.15;
        letters.forEach(function (letter, i) {
            add(
                letter,
                entryVector(rand(26, 70), 42, 0.7),
                rand(0.5, 0.8),
                bounce,
                letterStart + i * 0.045 + rand(0, 0.05)
            );
        });
        var nameEnd = letterStart + Math.max(0, letters.length - 1) * 0.045 + 0.8;

        // ---- 2. The title, sliding in from one side ----------------------
        var h2 = about.querySelector('h2');
        var titleDelay = rand(0.45, 0.65);
        add(
            h2,
            'translate(' + pick([-1, 1]) * rand(45, 90) + 'px, ' + rand(-6, 10).toFixed(1) + 'px) rotate(' + rand(-3, 3).toFixed(1) + 'deg)',
            0.7,
            glide,
            titleDelay
        );

        // ---- 3. The accent rule draws across ----------------------------
        if (h2) {
            var drawDelay = Math.max(nameEnd, titleDelay + 0.5) + rand(0, 0.15);
            h2.style.setProperty('--draw-delay', drawDelay.toFixed(2) + 's');
        }

        // ---- 4. Contact line, then bio --------------------------------
        var subheading = about.querySelector('.subheading');
        add(
            subheading,
            'translate(' + rand(-12, 12).toFixed(1) + 'px, ' + rand(16, 32).toFixed(1) + 'px)',
            0.6,
            glide,
            rand(0.95, 1.15)
        );

        var bio = about.querySelector('p.lead');
        if (bio) bio.style.filter = 'blur(6px)';
        add(
            bio,
            'translate(' + pick([-1, 1]) * rand(28, 52) + 'px, ' + rand(6, 18).toFixed(1) + 'px)',
            0.85,
            glide,
            rand(1.15, 1.35)
        );

        // ---- 5. The link icons, each from its own direction ------------
        var iconItems = about.querySelectorAll('.social-icons .social-icon-item');
        var iconBase = 1.45;
        iconItems.forEach(function (item, i) {
            var icon = item.querySelector('.social-icon');
            var label = item.querySelector('.social-icon-label');
            var d = iconBase + i * rand(0.1, 0.19) + rand(0, 0.06);
            add(icon, entryVector(rand(80, 150), 55, 0.7), rand(0.6, 0.85), bounce, d);
            add(
                label,
                'translate(0, ' + rand(8, 16).toFixed(1) + 'px)',
                0.4,
                glide,
                d + rand(0.18, 0.3)
            );
        });

        // ---- 6. Sidebar photo and nav links (desktop) -----------------
        var photo = document.querySelector('#sideNav .img-profile');
        add(
            photo,
            'translate(' + rand(-10, 10).toFixed(1) + 'px, ' + rand(-34, -14).toFixed(1) + 'px) rotate(' + rand(-10, 10).toFixed(1) + 'deg) scale(0.72)',
            0.8,
            bounce,
            rand(0.15, 0.32)
        );

        var navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
        navLinks.forEach(function (link, i) {
            add(
                link,
                'translate(' + rand(-28, -14).toFixed(1) + 'px, 0)',
                0.45,
                glide,
                0.3 + i * 0.055 + rand(0, 0.03)
            );
        });

        // ---- Apply: hide + arm, then release on the next frame ---------
        var maxEnd = 0;
        units.forEach(function (u) {
            u.el.classList.add('build-el');
            u.el.style.transform = u.transform;
            u.el.style.setProperty('--build-dur', u.dur.toFixed(2) + 's');
            u.el.style.setProperty('--build-ease', u.ease);
            u.el.style.setProperty('--build-delay', u.delay.toFixed(2) + 's');
            maxEnd = Math.max(maxEnd, u.delay + u.dur);
        });

        // Two rAFs so the hidden/transformed state is painted before .build-in
        // turns on the transition.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                units.forEach(function (u) { u.el.classList.add('build-in'); });
                if (h2) h2.classList.add('title-drawn');
            });
        });

        // Tidy up once everything has landed: drop the inline transform hints
        // so nothing lingers to fight a later :hover, and mark done.
        window.setTimeout(function () {
            units.forEach(function (u) {
                u.el.style.transform = '';
                u.el.style.removeProperty('--build-dur');
                u.el.style.removeProperty('--build-ease');
                u.el.style.removeProperty('--build-delay');
                u.el.style.filter = '';
            });
            root.classList.add('build-done');
        }, Math.ceil(maxEnd * 1000) + 400);
    } catch (err) {
        root.classList.add('build-done');
    }
}

// Wrap each visible character of an element's text in
// <span class="build-word"><span class="build-letter build-el">x</span>...</span>
// so individual glyphs can be transformed without letting words break across
// lines. Recurses into child elements (e.g. the coloured surname span).
function splitIntoLetters(container) {
    var walk = function (node) {
        var kids = Array.prototype.slice.call(node.childNodes);
        kids.forEach(function (child) {
            if (child.nodeType === 3) {
                var text = child.textContent;
                if (!text.trim()) return;
                var frag = document.createDocumentFragment();
                text.split(/(\s+)/).forEach(function (chunk) {
                    if (chunk === '') return;
                    if (/^\s+$/.test(chunk)) {
                        frag.appendChild(document.createTextNode(chunk));
                        return;
                    }
                    var word = document.createElement('span');
                    word.className = 'build-word';
                    Array.prototype.forEach.call(chunk, function (ch) {
                        var s = document.createElement('span');
                        s.className = 'build-letter build-el';
                        s.textContent = ch;
                        word.appendChild(s);
                    });
                    frag.appendChild(word);
                });
                child.parentNode.replaceChild(frag, child);
            } else if (child.nodeType === 1) {
                walk(child);
            }
        });
    };
    walk(container);
    return Array.prototype.slice.call(container.querySelectorAll('.build-letter'));
}
