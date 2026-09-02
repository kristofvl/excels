document.documentElement.classList.add("js");

const currentYear = document.querySelector("[data-current-year]");

if (currentYear) {
	currentYear.textContent = String(new Date().getFullYear());
}

const navToggle = document.querySelector(".nav-toggle");
const primaryNavigation = document.getElementById("primary-navigation");

if (navToggle && primaryNavigation) {
	const closeNavigation = () => {
		primaryNavigation.classList.remove("is-open");
		navToggle.setAttribute("aria-expanded", "false");
		navToggle.querySelector(".sr-only").textContent = "Open navigation";
	};

	navToggle.addEventListener("click", () => {
		const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
		primaryNavigation.classList.toggle("is-open", willOpen);
		navToggle.setAttribute("aria-expanded", String(willOpen));
		navToggle.querySelector(".sr-only").textContent = willOpen ? "Close navigation" : "Open navigation";
	});

	primaryNavigation.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", (event) => {
			const targetSelector = link.getAttribute("href");
			const target = targetSelector?.startsWith("#") ? document.querySelector(targetSelector) : null;
			const navigationWasOpen = primaryNavigation.classList.contains("is-open");

			closeNavigation();

			if (navigationWasOpen && target) {
				event.preventDefault();
				window.history.pushState(null, "", targetSelector);
				window.requestAnimationFrame(() => target.scrollIntoView());
			}
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
			closeNavigation();
			navToggle.focus();
		}
	});

	window.matchMedia("(min-width: 1081px)").addEventListener("change", closeNavigation);
}
