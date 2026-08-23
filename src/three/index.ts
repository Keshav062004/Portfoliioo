import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { objects } from "./objects";
import { renderTarget } from "./core/renderTarget";
import { threeSizes } from "./utils/sizes";
import { resources } from "../utils/resources";
import { raycast } from "./utils/raycast";

let canvas: HTMLCanvasElement | null = null;

const init = (_canvas: HTMLCanvasElement) => {
  canvas = _canvas;

  const initialize = () => {
    // Resources may already be loaded when the Home page is
    // mounted again after SPA navigation. In that case, waiting
    // for the one-shot "ready" event would leave Three.js
    // uninitialized and the home scene would disappear.
    threeSizes.init(_canvas);
    camera.init();
    renderTarget.init();
    renderer.init(canvas);

    objects.init();
    raycast.init();
  };

  if (resources.isReady) {
    initialize();
  } else {
    resources.once("ready", initialize);
  }
};

const destroy = () => {
  threeSizes.destroy();
  renderTarget.destroy();
  renderer.destroy();
  objects.destroy();
  camera.destroy();
  canvas = null;
};

export const three = { init, destroy };
