// ─── CONFIG ───────────────────────────────────────────────────────────────────
// After deploying to Render, replace this URL with your actual Render URL
// Example: https://mo-shuly-portfolio-api.onrender.com
const API_URL = "https://portfolio-backend-1-e0wz.onrender.com";

// ─── NAV ──────────────────────────────────────────────────────────────────────
const mob = document.getElementById("mob-menu");
const nav = document.getElementById("nav-links");
if (mob && nav) {
  mob.addEventListener("click", () => nav.classList.toggle("open"));
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth" });
      if (nav) nav.classList.remove("open");
    }
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
let light = false;
const themeBtn = document.querySelector(".theme-btn");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    light = !light;
    const r = document.documentElement.style;
    r.setProperty("--bg",      light ? "#fff"     : "#000");
    r.setProperty("--bg1",     light ? "#f9f9f9"  : "#0a0a0a");
    r.setProperty("--bg2",     light ? "#f4f4f5"  : "#111");
    r.setProperty("--bg3",     light ? "#e4e4e7"  : "#1a1a1a");
    r.setProperty("--border",  light ? "#e4e4e7"  : "#222");
    r.setProperty("--border2", light ? "#d4d4d8"  : "#2a2a2a");
    r.setProperty("--text",    light ? "#09090b"  : "#fff");
    r.setProperty("--text2",   light ? "#52525b"  : "#a1a1aa");
    r.setProperty("--text3",   light ? "#a1a1aa"  : "#71717a");
    r.setProperty("--tag-bg",  light ? "#f4f4f5"  : "#1a1a1a");
    r.setProperty("--tag-border", light ? "#d4d4d8" : "#2a2a2a");
  });
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
const form = document.querySelector(".contact-form");
const submitBtn = document.getElementById("submit-btn");

if (form && submitBtn) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, textarea");
    const [name, email, subject, message] = inputs;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          subject: subject.value || "No subject",
          message: message.value,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        submitBtn.textContent = "Sent ✓";
        submitBtn.style.background = "#4ade80";
        submitBtn.style.color = "#000";
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = "Send Message ↗";
          submitBtn.style.background = "";
          submitBtn.style.color = "";
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error(data.detail || "Something went wrong");
      }
    } catch (err) {
      submitBtn.textContent = "Failed — try again";
      submitBtn.style.background = "#ef4444";
      submitBtn.style.color = "#fff";
      console.error("Contact form error:", err.message);
      setTimeout(() => {
        submitBtn.textContent = "Send Message ↗";
        submitBtn.style.background = "";
        submitBtn.style.color = "";
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}
