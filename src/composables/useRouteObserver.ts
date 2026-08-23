import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isTransitioning } from "./useProjectTransition";
import { lenis } from "./useScroll";

// -----------------------------------------------------------------------------
// GLOBAL REACTIVE PATH
// -----------------------------------------------------------------------------

export const path = ref(
  typeof window !== "undefined" ? window.location.pathname : "/"
);

// -----------------------------------------------------------------------------
// ROUTE HELPERS
// -----------------------------------------------------------------------------

export const isProjectRoute = (currentPath: string) => {
  return currentPath.match(/^\/project\/([^/]+)$/);
};

export const projectId = computed(() => {
  const match = isProjectRoute(path.value);
  return match ? match[1] : null;
});

export const projectVisible = computed(() => {
  return projectId.value !== null && !isTransitioning.value;
});

export const recentProject = ref<string | null>(null);

export const recentProjectId = computed(() => {
  if (projectId.value) {
    recentProject.value = projectId.value;
  }

  return recentProject.value;
});

// -----------------------------------------------------------------------------
// CERTIFICATES -> HOME FRESH RELOAD
// -----------------------------------------------------------------------------
// Home contains long-lived GSAP/Three.js/Lenis state. When Vue swaps the
// certificates route back to Home in the same SPA instance, some of that
// state can survive the route change and leave the Hero/Contact scene stuck.
//
// For this specific transition we intentionally do a real browser reload.
// This gives Home the exact same clean initialization as a fresh visit and
// avoids changing any of the existing Hero/Contact animation code.
//
// A session flag lets the newly loaded Home page start at the real top.
// -----------------------------------------------------------------------------

const HOME_RELOAD_FLAG = "portfolio-home-reload-after-certificates";

const markHomeReloadAndReload = () => {
  try {
    sessionStorage.setItem(HOME_RELOAD_FLAG, "1");
  } catch {
    // sessionStorage can be unavailable in restricted browser contexts.
  }

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.location.reload();
};

const restoreFreshHomePosition = () => {
  if (typeof window === "undefined" || window.location.pathname !== "/") {
    return;
  }

  let shouldReset = false;

  try {
    shouldReset = sessionStorage.getItem(HOME_RELOAD_FLAG) === "1";

    if (shouldReset) {
      sessionStorage.removeItem(HOME_RELOAD_FLAG);
    }
  } catch {
    shouldReset = false;
  }

  if (!shouldReset) return;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  // Wait for Home, Lenis and its GSAP/ScrollTrigger instances to mount.
  void nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis.value?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      });
    });
  });
};

// -----------------------------------------------------------------------------
// HISTORY PATCH
// -----------------------------------------------------------------------------

let historyPatched = false;

function patchHistory() {
  if (historyPatched || typeof window === "undefined") {
    return;
  }

  historyPatched = true;

  const wrap = (key: "pushState" | "replaceState") => {
    const original = window.history[key];

    window.history[key] = function (
      this: History,
      ...args: Parameters<History["pushState"]>
    ) {
      original.apply(this, args);

      queueMicrotask(() => {
        window.dispatchEvent(new Event("route-change"));
      });
    } as History["pushState"];
  };

  wrap("pushState");
  wrap("replaceState");
}

// -----------------------------------------------------------------------------
// ROUTE OBSERVER
// -----------------------------------------------------------------------------

export function useRouteObserver() {
  const update = () => {
    if (typeof window === "undefined") {
      return;
    }

    const newPath = window.location.pathname;
    const previousPath = path.value;

    if (newPath === previousPath) {
      return;
    }

    // IMPORTANT:
    // Do not try to repair the old Home animation state in-place here.
    // Reload the actual "/" document instead. This is deliberately limited
    // to the Certificates -> Home transition.
    if (previousPath === "/certificates" && newPath === "/") {
      markHomeReloadAndReload();
      return;
    }

    path.value = newPath;

    if (newPath === "/certificates" || newPath === "/") {
      lenis.value?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      if (newPath === "/") {
        void nextTick(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              ScrollTrigger.clearScrollMemory();
              ScrollTrigger.refresh();
              ScrollTrigger.update();
            });
          });
        });
      }
    }
  };

  onMounted(() => {
    patchHistory();

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    update();
    restoreFreshHomePosition();

    window.addEventListener("popstate", update);
    window.addEventListener("route-change", update);
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", update);
    window.removeEventListener("route-change", update);
  });

  return {
    path,
    projectId,
    recentProjectId,
  };
}
