// Shared between the server layout (pre-paint script) and the client intro.

export const INTRO_STORAGE_KEY = "bs-intro-seen";

/**
 * Runs synchronously before first paint. Sets html[data-intro] to "play" or
 * "skip" (already seen this session, or reduced motion). If the intro never
 * hands over (for example a script failed to load), it releases the page after
 * 7 seconds so nothing stays covered.
 */
export const INTRO_BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var s=window.sessionStorage.getItem("${INTRO_STORAGE_KEY}");d.dataset.intro=r||s?"skip":"play"}catch(e){d.dataset.intro="skip"}setTimeout(function(){if(d.dataset.intro==="play")d.dataset.intro="done"},7000)})();`;
