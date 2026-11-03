// Homepage hero headline sparkle reveal.
(() => {
 const title=document.querySelector('[data-sprinkle-title]');
 if(!title || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 requestAnimationFrame(()=>title.classList.add('is-sprinkling'));
})();