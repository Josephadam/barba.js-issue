gsap.registerPlugin(ScrollTrigger);

let scroll;

    const body = document.body;
    const select = (e) => document.querySelector(e);
    const selectAll = (e) => document.querySelectorAll(e);

    // Call the animation function on page load
    initLoader();
    initLoaderHome();
    initPageTransitions();

    // Animation - First Page Load
    function initLoader() {
    var tl = gsap.timeline();

    console.log('first page load');

    // Animation for loading screen
    tl.set(".once-in", {
        y: "10vh",
        opacity: 0,
    });

    tl.to(".once-in", {
        duration: 0.6,
        rotation: 0,
        yPercent: 0,
        ease: "Expo.easeOut",
        delay: 0.1,
        stagger: 0.05,
    });

    tl.to(
        ".once-in",
        {
            duration: 0.8,
            rotation: 0,
            yPercent: -400,
            ease: "Expo.easeIn",
            stagger: -0.05,
        },
        "=-.1"
    );

    tl.set(
        "html",
        {
            cursor: "auto",
        },
        "=-.2"
    );

    

    // Animation for once-in content
    tl.to(
        ".once-in",
        {
            duration: 0.5,
            y: "0vh",
            opacity: 1,
            ease: "Expo.easeOut",
            stagger: -0.075,
            onStart: staggerSpanH1,
        },
        "=-0.5"
    );

    function staggerSpanH1() {
        gsap.to("once-in", {
            duration: 0.5,
            yPercent: 0,
            rotate: 0,
            ease: "Expo.easeOut",
            stagger: -0.075,
            delay: 0.2,
        });
    }
}


    function initLoaderHome() {
    const tl = gsap.timeline();
    gsap.set("#rectangle", { transformOrigin: "50% 100%", y: 100 });
    tl.to("#rectangle", { duration: 1, y: 0, ease: "power2.out" });
    tl.add("scaleAnimation");
    tl.to("#rectangle-svg", { duration: 1, scale: 2, ease: "ease.out(1, 0.3)" }, "scaleAnimation");
    }


// Animation first load 

// Animation - Page transition In
function pageTransitionIn() {
	var tl = gsap.timeline();
     console.log('Transitioning page in...')

	tl.call(function () {
		scroll.stop();
	});

	tl.set(".loading-screen", {
		top: "200%",
	});

	tl.set("html", {
		cursor: "wait",
	});

	tl.to(".loading-screen", {
		duration: 0.8,
		top: "0%",
		ease: "Power2.easeIn",
	});

	tl.to(".loading-screen", {
		duration: 0.8,
		top: "-200%",
		ease: "Power2.easeOut",
		delay: 0.2,
	});

	tl.set(
		"html",
		{
			cursor: "auto",
		},
		"=-0.2"
	);

	tl.set(".loading-screen", {
		top: "200%",
	});
}


// Animation - Page transition Out
function pageTransitionOut() {
	var tl = gsap.timeline();

	tl.call(function () {
		scroll.start();
	});

	tl.set("once-in span", {
		yPercent: 250,
	});

	tl.set(".once-in", {
		y: "20vh",
		opacity: 0,
	});

	tl.set(".inner .inner-wrap", {
		top: "-20vh",
	});

	tl.to(".inner .inner-wrap", {
		duration: 1.6,
		top: 0,
		ease: "Expo.easeOut",
	});

	tl.to(
		".once-in",
		{
			duration: 1.6,
			y: "0vh",
			opacity: 1,
			ease: "Expo.easeOut",
			stagger: -0.075,
			onStart: staggerSpanH1,
		},
		"=-1.6"
	);

	function staggerSpanH1() {
		gsap.to("h1 .outer-span span", {
			duration: 1.6,
			yPercent: 0,
			rotate: 0,
			ease: "Expo.easeOut",
			stagger: -0.075,
			delay: 0.075,
		});
	}
}

function initPageTransitions() {
    // do something before the transition starts
	barba.hooks.before(() => {
		select("html").classList.add("is-transitioning");
	});

    // do something after the transition finishes
	barba.hooks.after(() => {
		select("html").classList.remove("is-transitioning");
		// reinit locomotive scroll
		scroll.init();
		scroll.stop();
	});

    // scroll to the top of the page
	barba.hooks.enter(() => {
		scroll.destroy();
	});

	// scroll to the top of the page
	barba.hooks.afterEnter(() => {
		window.scrollTo(0, 0);
	});

    barba.init({
		sync: true,
		debug: true,
		timeout: 7000,
		transitions: [
			{
				name: "default",
				once(data) {
					// do something once on the initial page load
					initSmoothScroll(data.next.container);
					initScript();
					initLoader();
				},
				async leave(data) {
					// animate loading screen in
					pageTransitionIn(data.current);
					await delay(795);
					data.current.container.remove();
				},
				async enter(data) {
					// animate loading screen away
					pageTransitionOut(data.next);
				},
				async beforeEnter(data) {
					ScrollTrigger.getAll().forEach((t) => t.kill());
					scroll.destroy();
					initSmoothScroll(data.next.container);
					initScript();
				},
			},
		],
	});

    function initSmoothScroll(container) {
    let scroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true,
        lerp: 0.075,
    });

    scroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed",
    });

    window.addEventListener('resize', () => {
        scroll.update();
        ScrollTrigger.refresh();
    });

    ScrollTrigger.addEventListener("refresh", () => scroll.update());

    ScrollTrigger.refresh();
}
}


//for barba.js
function delay(n) {
	n = n || 2000;
	return new Promise((done) => {
		setTimeout(() => {
			done();
		}, n);
	});
}

function initScript() {
    select("body").classList.remove("is-loading");
    initBasicFunctions();
    initScrolltriggerAnimations()
}

/**
 * Basic Functions
 */
function initBasicFunctions() {
    // Toggle Navigation
    $('[data-navigation-toggle="toggle"]').click(function() {
        $(this).toggleClass('active');
        var isActive = $(this).hasClass('active');
        $('[data-navigation-status]').attr('data-navigation-status', isActive ? 'active' : 'not-active');
        
        // Adjust the transform for both layers
        if(isActive) {
            $('.mobile-nav-box').css('transform', 'translateY(0%) rotate(0.001deg)');
            $('.mobile-nav-behind-layer').css('transform', 'translateY(-10%)'); // Slower movement
             $('.logo span').addClass('logo-open');
             
        } else {
            $('.mobile-nav-box').css('transform', 'translateY(-110%) rotate(0.001deg)');
            $('.mobile-nav-behind-layer').css('transform', 'translateY(-120%)');
             $('.logo span').removeClass('logo-open');
             
        }
    });

    // Key ESC - Close Navigation, add similar adjustments for the behind layer
    $(document).keydown(function(e) {
        if (e.keyCode == 27) { // ESC key
            var $hamburger = $('.hamburger');
            if ($hamburger.hasClass('active')) {
                $hamburger.removeClass('active');
                $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
                $('.mobile-nav-box').css('transform', 'translateY(-110%) rotate(0.001deg)');
                $('.mobile-nav-behind-layer').css('transform', 'translateY(-120%)');
            }
        }
    });
}







/**
 * Scrolltrigger Animations Desktop + Mobile
 */
function initScrolltriggerAnimations() {
    // Only apply animations on screens wider than 1024px
    ScrollTrigger.matchMedia({
        "(min-width: 1025px)": function() {
            // Target each .bg-img element
            gsap.utils.toArray(".bg-img").forEach(targetElement => {
                // Directly ensure full opacity at the start to avoid conflicts
                gsap.set(targetElement, {opacity: 1});

                // Create the fade-out animation with Power3.easeOut
                gsap.to(targetElement, {
                    opacity: 0, // Fade to no opacity
                    ease: "Power3.easeOut", // Use Power3.easeOut for the transition
                    scrollTrigger: {
                        trigger: targetElement,
                        scroller: "[data-scroll-container]", // Use Locomotive Scroll's container
                        start: "100% 100%", // Adjust this to control when fading starts
                        end: "105% 0%", // Adjust this to control when fading ends
                        scrub: true,
                        // Uncomment the following line for debugging purposes
                        
                    }
                });
            });
        }
    });
}


gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});