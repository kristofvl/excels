document.documentElement.classList.add("js");

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
		link.addEventListener("click", closeNavigation);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
			closeNavigation();
			navToggle.focus();
		}
	});

	window.matchMedia("(min-width: 1081px)").addEventListener("change", closeNavigation);
}
