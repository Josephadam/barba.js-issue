function initTimeZone() {
	// Time zone
	// https://stackoverflow.com/questions/39418405/making-a-live-clock-in-javascript/67149791#67149791
	// https://stackoverflow.com/questions/8207655/get-time-of-specific-timezone
	// https://stackoverflow.com/questions/63572780/how-to-update-intl-datetimeformat-with-new-date

	var timeSpanHeader = document.querySelector("#timeTeller");
	var timeSpanFooter = document.querySelector("#timeSpanFooter");

	const optionsTime = {
		timeZone: "America/Los_Angeles",
		timeZoneName: "short",
		// year: 'numeric',
		// month: 'numeric',
		// day: 'numeric',
		hour: "2-digit",
		hour24: "true",
		minute: "numeric",
		second: "numeric",
	};

	const formatter = new Intl.DateTimeFormat([], optionsTime);
	updateTime();
	setInterval(updateTime, 1000);

	function updateTime() {
		const dateTime = new Date();
		const formattedDateTime = formatter.format(dateTime);
		if (timeSpanHeader) {
			timeSpanHeader.textContent = formattedDateTime;
		}
		if (timeSpanFooter) {
			timeSpanFooter.textContent = formattedDateTime;
		}
	}
}

/**
 * Magnetic Buttons
 */
function initMagneticButtons() {
  // Only proceed if the viewport is wider than 540px.
  if (window.innerWidth > 540) {
    const magnets = document.querySelectorAll('.magnetic');

    magnets.forEach((magnet) => {
      magnet.addEventListener('mousemove', (event) => {
        const bounding = magnet.getBoundingClientRect();
        const strength = magnet.dataset.strength || 20; // Using dataset for attribute access
        const x = (((event.clientX - bounding.left) / bounding.width) - 0.5) * strength;
        const y = (((event.clientY - bounding.top) / bounding.height) - 0.5) * strength;

        // Here we ensure force3D: true is added for performance optimization
        gsap.to(magnet, { duration: 0.5, x: x, y: y, ease: "power3.out", force3D: true });
      });

      // This listener is correctly placed inside the forEach loop to apply to each magnet
      magnet.addEventListener('mouseleave', () => {
        // Ensure force3D: true is also included here for consistency
        gsap.to(magnet, { duration: 0.5, x: 0, y: 0, ease: "power3.out", force3D: true });
      });
    });
  }
}

/**
 * Basic Functions
 */
function initBasicFunctions() {
    // Toggle Navigation
    $('[data-navigation-toggle="toggle"]').click(function() {
        $(this).toggleClass('active'); // This line toggles the active state of the hamburger
        var isActive = $(this).hasClass('active');
        $('[data-navigation-status]').attr('data-navigation-status', isActive ? 'active' : 'not-active');
    });

    // Key ESC - Close Navigation
    $(document).keydown(function(e) {
        if (e.keyCode == 27) { // ESC key
            var $hamburger = $('.hamburger');
            if ($hamburger.hasClass('active')) {
                $hamburger.removeClass('active');
                $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
            }
        }
    });
}



document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    let scroll;

    const body = document.body;
    const select = (e) => document.querySelector(e);
    const selectAll = (e) => document.querySelectorAll(e);

    // Call the animation function on page load
    initLoader();
    initLoaderHome();

    // Animation - First Page Load
    function initLoader() {
        var tl = gsap.timeline();

       

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


});





// Call this function when the DOM content has loaded
document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);
    initMagneticButtons();
    initTimeZone();
    initBasicFunctions();
    initScrolltriggerCheckScroll();
    initSmoothScroll();
    initScrolltriggerAnimations();
});


/**
 * Scrolltrigger Scroll Check
 */
function initScrolltriggerCheckScroll() {
	ScrollTrigger.create({
		start: "top -20%",
		onUpdate: (self) => {
			$("main").addClass("scrolled");
		},
		onLeaveBack: () => {
			$("main").removeClass("scrolled");
		},
	});
}

function initSmoothScroll() {
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
 