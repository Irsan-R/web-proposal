const canvas = document.querySelector("#petals");
const ctx = canvas.getContext("2d");
const note = document.querySelector(".answer-note");
const yesButton = document.querySelector(".yes");
const maybeButton = document.querySelector(".maybe");

let width = 0;
let height = 0;
let petals = [];
let intensity = 1;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createPetal(extra = false) {
  return {
    x: Math.random() * width,
    y: extra ? height + Math.random() * 120 : Math.random() * height,
    size: 5 + Math.random() * 10,
    speed: 0.45 + Math.random() * 1.2,
    drift: -0.55 + Math.random() * 1.1,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: 0.008 + Math.random() * 0.025,
    hue: Math.random() > 0.45 ? "rgba(255, 188, 199, 0.78)" : "rgba(255, 226, 205, 0.78)"
  };
}

function seedPetals(count = 46) {
  petals = Array.from({ length: count }, () => createPetal());
}

function drawPetal(petal) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.spin);
  ctx.fillStyle = petal.hue;
  ctx.beginPath();
  ctx.ellipse(0, 0, petal.size * 0.45, petal.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animatePetals() {
  ctx.clearRect(0, 0, width, height);

  petals.forEach((petal) => {
    petal.y += petal.speed * intensity;
    petal.x += petal.drift + Math.sin(petal.spin) * 0.28;
    petal.spin += petal.spinSpeed;

    if (petal.y > height + 30 || petal.x < -30 || petal.x > width + 30) {
      Object.assign(petal, createPetal(true), { y: -30 });
    }

    drawPetal(petal);
  });

  requestAnimationFrame(animatePetals);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

if (yesButton) {
  yesButton.addEventListener("click", () => {
    note.textContent = "Kamu baru saja membuat halaman ini punya awal paling indah.";
    document.body.classList.add("celebrate");
    intensity = 2.8;
    petals.push(...Array.from({ length: 42 }, () => createPetal(true)));

    setTimeout(() => {
      window.location.href = "memories.html";
    }, 450);
  });
}

if (maybeButton) {
  maybeButton.addEventListener("click", () => {
    note.textContent = "Tidak apa-apa, tarik napas dulu. Aku tetap di sini.";
    maybeButton.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-8px)" },
        { transform: "translateX(8px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 420, easing: "ease" }
    );
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
seedPetals();
animatePetals();
