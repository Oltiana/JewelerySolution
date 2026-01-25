document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider, .product-image");

  sliders.forEach((root) => {
    const slides = Array.from(root.querySelectorAll(".slide"));
    if (slides.length === 0) return;

    // dots container (krijo nëse s’ekziston)
    let dotsWrap = root.querySelector(".dots");
    if (!dotsWrap) {
      dotsWrap = document.createElement("div");
      dotsWrap.className = "dots";
      root.appendChild(dotsWrap);
    } else {
      dotsWrap.innerHTML = "";
    }

    let index = 0;
    let timer = null;

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.className = "dot";
      b.type = "button";
      b.setAttribute("aria-label", `Slide ${i + 1}`);
      b.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(b);
      return b;
    });

    function render() {
      slides.forEach((s, i) => s.classList.toggle("active", i === index));
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }

    function next() {
      goTo(index + 1);
    }

    function start() {
      // mos auto-slide nese user preferon reduce motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(next, 3500);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function restart() {
      stop();
      start();
    }

    // pause on hover/focus (nice UX)
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // init
    render();
    start();
  });
});
