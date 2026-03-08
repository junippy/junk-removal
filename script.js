const isMobile = () => window.innerWidth <= 520;

const tooltip = document.createElement("div");
tooltip.className = "hint-tooltip";
document.body.appendChild(tooltip);

document.querySelectorAll(".hint-btn").forEach((btn) => {
  const inlineBox = btn.closest(".field").querySelector(".hint-inline");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (isMobile()) {
      const isOpen = inlineBox.classList.contains("visible");
      document
        .querySelectorAll(".hint-inline")
        .forEach((b) => b.classList.remove("visible"));
      document
        .querySelectorAll(".hint-btn")
        .forEach((b) => (b.textContent = "▸"));
      if (!isOpen) {
        inlineBox.textContent = btn.dataset.tip;
        inlineBox.classList.add("visible");
        btn.textContent = "▾";
      }
    } else {
      const rect = btn.getBoundingClientRect();
      const isVisible =
        tooltip.style.display === "block" &&
        tooltip.dataset.owner === btn.dataset.tip;
      tooltip.style.display = isVisible ? "none" : "block";
      tooltip.dataset.owner = btn.dataset.tip;
      tooltip.textContent = btn.dataset.tip;
      tooltip.style.top = rect.top - 4 + "px";
      tooltip.style.left = rect.right + 10 + "px";
      btn.textContent = isVisible ? "▸" : "▾";
    }
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("hint-btn")) {
    tooltip.style.display = "none";
    document
      .querySelectorAll(".hint-inline")
      .forEach((b) => b.classList.remove("visible"));
    document
      .querySelectorAll(".hint-btn")
      .forEach((b) => (b.textContent = "▸"));
  }
});

function toggleDark() {
  const isDark = document.body.classList.toggle("dark");
  document.getElementById("darkToggle").textContent = isDark
    ? "Light Mode"
    : "Dark Mode";
  localStorage.setItem("darkMode", isDark);
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  document.getElementById("darkToggle").textContent = "Light Mode";
}
