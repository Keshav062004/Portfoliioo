import { waypoints } from "./waypoints";
import { scenes } from "./scenes";
import { about } from "./transitions/about";
import { contact } from "./transitions/contact";
import { intro } from "./intro";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const transitions = {
  about,
  contact,
};

let isInitialized = false;

const init = () => {
  if (isInitialized) return;
  scenes.init();
  waypoints.init();
  intro.play();
  isInitialized = true;
};

const destroy = () => {
  if (!isInitialized) return;
  scenes.destroy();
  waypoints.destroy();
  isInitialized = false;
};

// -----------------------------------------------------------------------------
// REFRESH
// -----------------------------------------------------------------------------
// About.vue and Contact.vue create their own ScrollTriggers independently
// (gated behind their own mount / refs being ready), slightly after this
// module's init() runs. Calling ScrollTrigger.refresh() only here is not
// enough - it can fire before those triggers exist, calculate against an
// unsettled layout, and never get a correct second pass. Callers (Home.vue)
// should call this again once those child triggers are known to exist
// (e.g. after `projectsLoaded` flips true and Contact has mounted).
const refresh = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    });
  });
};

export const animations = { init, destroy, refresh };
