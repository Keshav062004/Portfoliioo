import gsap from "gsap";

export const sceneWeights = {
  hero: 1,
  about: 0,
  "about-1": 0,
  "about-2": 0,
  projects: 0,
  contact: 0,
};

const sceneWeightKeys = Object.keys(sceneWeights);

//in = 1 and out = 0 = fully visible
//in = 0 and out = 0 = not reached yet
//out = 1 = scrolled past

export const sceneWeightsInOut = {
  hero: {
    in: 1,
    out: 0,
  },
  about: {
    in: 0,
    out: 0,
  },
  "about-1": {
    in: 0,
    out: 0,
  },
  "about-2": {
    in: 0,
    out: 0,
  },
  contact: {
    in: 0,
    out: 0,
  },
};

// -----------------------------------------------------------------------------
// DEFAULT / FRESH-LOAD STATE
// -----------------------------------------------------------------------------
// sceneWeights and sceneWeightsInOut are module-level singletons that are
// mutated in place by scrubbed GSAP timelines (see transitions/about.ts and
// transitions/contact.ts). GSAP's tl.kill() / matchMedia.revert() does NOT
// reset plain-object tween targets back to their starting values (that only
// happens for DOM inline-style reverts) - so without an explicit reset here,
// whatever in/out values were active the moment the route changed away from
// Home stay frozen and get reused verbatim the next time Home mounts. That
// is what produced the "stuck" Hero/Contact scenes after returning from
// /certificates.

const defaultSceneWeights = { ...sceneWeights };
const defaultSceneWeightsInOut = JSON.parse(JSON.stringify(sceneWeightsInOut)) as typeof sceneWeightsInOut;

const resetWeights = () => {
  for (const key of sceneWeightKeys) {
    sceneWeights[key as keyof typeof sceneWeights] =
      defaultSceneWeights[key as keyof typeof defaultSceneWeights];
  }

  for (const key of Object.keys(sceneWeightsInOut) as (keyof typeof sceneWeightsInOut)[]) {
    sceneWeightsInOut[key].in = defaultSceneWeightsInOut[key].in;
    sceneWeightsInOut[key].out = defaultSceneWeightsInOut[key].out;
  }
};

const init = () => {
  // Defensive: always start a fresh init from the known-good default state,
  // regardless of whether destroy() ran cleanly beforehand.
  resetWeights();
  gsap.ticker.add(tick);
};

const tick = () => {
  for (const key of sceneWeightKeys) {
    const inOut = sceneWeightsInOut[key as keyof typeof sceneWeightsInOut];
    if (!inOut) continue;

    sceneWeights[key as keyof typeof sceneWeights] = Math.max(0, Math.min(1, inOut.in * (1 - inOut.out)));
  }
};

const destroy = () => {
  gsap.ticker.remove(tick);
  resetWeights();
};

export const scenes = { init, destroy, resetWeights };
