(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const preview = document.querySelector(".project-preview");
  const previewImage = preview?.querySelector("img");
  const previewLabel = preview?.querySelector("span");
  const portrait = document.querySelector("[data-parallax='portrait']");
  const roleLockup = document.querySelector("[data-role]");

  if (roleLockup) {
    const role = roleLockup.dataset.role || roleLockup.textContent.trim();
    roleLockup.textContent = "";
    [...role].forEach((character, index) => {
      const letter = document.createElement("span");
      letter.className = "role-letter";
      letter.textContent = character === " " ? "\u00a0" : character;
      letter.style.animationDelay = `${index * 0.035}s`;
      roleLockup.appendChild(letter);
    });
  }

  if (!reduceMotion && portrait) {
    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      portrait.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(3deg)`;
    });
    window.addEventListener("scroll", () => {
      const offset = Math.min(window.scrollY * 0.06, 18);
      portrait.style.marginTop = `${offset}px`;
    }, { passive: true });
  }

  if (!reduceMotion && cursorDot && cursorRing) {
    window.addEventListener("pointermove", (event) => {
      cursorDot.style.left = `${event.clientX}px`;
      cursorDot.style.top = `${event.clientY}px`;
      cursorRing.animate(
        { left: `${event.clientX}px`, top: `${event.clientY}px` },
        { duration: 420, fill: "forwards", easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    });
    document.querySelectorAll("a, .project-trigger").forEach((element) => {
      element.addEventListener("mouseenter", () => cursorRing.classList.add("is-hover"));
      element.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hover"));
    });
  }

  document.querySelectorAll(".project-trigger").forEach((project) => {
    project.addEventListener("mouseenter", () => {
      if (!preview || !previewImage || !previewLabel) return;
      previewImage.src = project.dataset.image;
      previewImage.alt = `${project.querySelector("h3")?.textContent || "Project"} preview`;
      previewLabel.textContent = project.dataset.label || "";
      preview.classList.add("is-visible");
    });
    project.addEventListener("mousemove", (event) => {
      if (!preview) return;
      preview.style.left = `${event.clientX + 24}px`;
      preview.style.top = `${event.clientY + 24}px`;
    });
    project.addEventListener("mouseleave", () => preview?.classList.remove("is-visible"));
  });

  if (reduceMotion || typeof gsap === "undefined") {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".hero .reveal", { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" });
  gsap.utils.toArray(".reveal").forEach((element) => {
    if (element.closest(".hero")) return;
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
  });
})();
