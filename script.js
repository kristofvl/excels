const currentYear = document.querySelector("[data-current-year]");

if (currentYear) {
	currentYear.textContent = String(new Date().getFullYear());
}

const isWebAddress = (url) => /^(https?:)?\/\//i.test(url ?? "");

const openInNewTab = (link) => {
	link.target = "_blank";
	link.rel = "noopener noreferrer";

	const label = link.getAttribute("aria-label");

	if (label) {
		if (!/new tab/i.test(label)) link.setAttribute("aria-label", `${label} (opens in a new tab)`);
		return;
	}

	if (link.querySelector("[data-new-tab-hint]")) return;

	const hint = document.createElement("span");
	hint.className = "sr-only";
	hint.dataset.newTabHint = "";
	hint.textContent = " (opens in a new tab)";
	link.append(hint);
};

// Paste the published URLs into data-application-url and data-contact-url on <body>; until then each button keeps its in-page placeholder link.
const configuredUrls = {
	application: document.body.dataset.applicationUrl?.trim(),
	contact: document.body.dataset.contactUrl?.trim(),
};

Object.entries(configuredUrls).forEach(([name, url]) => {
	if (!url) return;

	document.querySelectorAll(`[data-link="${name}"]`).forEach((link) => {
		link.href = url;
	});
});

document.querySelectorAll("a[href]").forEach((link) => {
	if (isWebAddress(link.getAttribute("href"))) openInNewTab(link);
});

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

	document.addEventListener("click", (event) => {
		if (!primaryNavigation.classList.contains("is-open")) return;
		if (primaryNavigation.contains(event.target) || navToggle.contains(event.target)) return;

		closeNavigation();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
			closeNavigation();
			navToggle.focus();
		}
	});

	window.matchMedia("(min-width: 1200px)").addEventListener("change", closeNavigation);
}

const openFaqCategory = (hash) => {
	if (!hash?.startsWith("#faq-")) return;

	const category = document.getElementById(hash.slice(1));

	if (category?.matches("details.faq-group")) {
		category.open = true;
	}
};

document.querySelectorAll('a[href^="#faq-"]').forEach((link) => {
	link.addEventListener("click", () => openFaqCategory(link.hash));
});

window.addEventListener("hashchange", () => openFaqCategory(window.location.hash));
openFaqCategory(window.location.hash);
