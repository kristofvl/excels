// Tech-Themed Canvas Animation: Circuit Traces, Signal Waves, Binary Rain
const canvas = document.getElementById("tech-canvas");
const ctx = canvas.getContext("2d");

const navToggle = document.querySelector(".nav-toggle");
const primaryNavigation = document.getElementById("primary-navigation");

function closeNavigation() {
	primaryNavigation.classList.remove("is-open");
	navToggle.setAttribute("aria-expanded", "false");
	navToggle.querySelector(".sr-only").textContent = "Open navigation";
}

navToggle.addEventListener("click", () => {
	const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
	primaryNavigation.classList.toggle("is-open", willOpen);
	navToggle.setAttribute("aria-expanded", String(willOpen));
	navToggle.querySelector(".sr-only").textContent = willOpen ? "Close navigation" : "Open navigation";
});

primaryNavigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeNavigation(); });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const signals = [];
const binaryDrops = [];

// --- Circuit Trace Particles ---
class Particle {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.size = Math.random() * 2 + 1;
		this.speedX = Math.random() * 0.5 - 0.25;
		this.speedY = Math.random() * 0.5 - 0.25;
		this.color = `rgba(115, 52, 96, ${Math.random() * 0.5 + 0.5})`;
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
		if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

// --- Signal Waves ---
class Signal {
	constructor() {
		this.reset();
	}
	reset() {
		this.y = Math.random() * canvas.height;
		// Full width of the viewport
		this.points = [];
		this.step = 14;
		// Analog characteristics
		this.amplitude = Math.random() * 20 + 8;
		this.speed = Math.random() * 0.4 + 0.15;
		this.offset = Math.random() * 1000;
		// Softer cyan
		this.color = `rgba(80, 230, 255, ${Math.random() * 0.08 + 0.06})`;
		// Generate a smooth random waveform
		let value = 0;
		for (let x = 0; x <= canvas.width + this.step; x += this.step) {
			value += (Math.random() - 0.5) * 10; // random walk
			value *= 0.92; // damping
			value = Math.max(-1, Math.min(1, value)); // clamp
			this.points.push(value);
		}
	}

	update() {
		this.offset += this.speed;
		ctx.beginPath();
		for (let i = 0; i < this.points.length; i++) {
			const x = i * this.step;
			// interpolate between neighboring samples for smooth scrolling
			const shift = this.offset % this.step;
			const idx =
				(i + Math.floor(this.offset / this.step)) % this.points.length;
			const next = (idx + 1) % this.points.length;
			const t = shift / this.step;
			const sample = this.points[idx] * (1 - t) + this.points[next] * t;
			const y = this.y + sample * this.amplitude;
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		// Very subtle glow
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 4;
		ctx.globalAlpha = 0.3;
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.lineWidth = 2;
		ctx.stroke();
	}
}

// --- Binary Rain ---
class BinaryDrop {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * -200;
		this.speed = Math.random() * 1.5 + 0.8; // slower
		this.size = Math.random() * 10 + 18; // much larger text
		this.char = Math.random() > 0.5 ? "0" : "1";
		// Softer Matrix green
		this.color = `rgba(80, 255, 140, ${Math.random() * 0.18 + 0.08})`;
	}
	update() {
		this.y += this.speed;
		if (this.y > canvas.height + 50) {
			this.y = Math.random() * -200;
			this.x = Math.random() * canvas.width;
		}
		ctx.fillStyle = this.color;
		ctx.font = `${this.size}px Orbitron, monospace`;
		ctx.fillText(this.char, this.x, this.y);
	}
}

// Initialize
for (let i = 0; i < 50; i++) particles.push(new Particle());
for (let i = 0; i < 7; i++) signals.push(new Signal());
for (let i = 0; i < 20; i++) binaryDrops.push(new BinaryDrop());

// Animation loop
function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Draw a subtle grid
	ctx.beginPath();
	ctx.strokeStyle = "rgba(15, 52, 96, 0.3)";
	ctx.lineWidth = 1;
	for (let i = 0; i < canvas.width; i += 30) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, canvas.height);
	}
	for (let i = 0; i < canvas.height; i += 30) {
		ctx.moveTo(0, i);
		ctx.lineTo(canvas.width, i);
	}
	ctx.stroke();
	// Update and draw all elements
	particles.forEach((p) => p.update());
	// Additive blending only for glowing signals
	ctx.globalCompositeOperation = "lighter";
	signals.forEach((s) => s.update());
	ctx.globalCompositeOperation = "source-over";
	binaryDrops.forEach((b) => b.update());
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) animate();
// Resize canvas
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
