// Shared between the server layout (pre-paint script) and the client intro.

/**
 * Runs synchronously before first paint. Sets html[data-intro] to "play" on
 * every full page load, or "skip" when the visitor prefers reduced motion.
 * If the intro never hands over (for example a script failed to load), it
 * releases the page after 7 seconds so nothing stays covered.
 */
export const INTRO_BOOT_SCRIPT = `(function(){var d=document.documentElement;window.__introStart=performance.now();try{d.dataset.intro=window.matchMedia("(prefers-reduced-motion: reduce)").matches?"skip":"play"}catch(e){d.dataset.intro="skip"}setTimeout(function(){if(d.dataset.intro==="play")d.dataset.intro="done"},7000)})();`;
