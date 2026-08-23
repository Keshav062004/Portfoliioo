<script setup lang="ts">
import Header from "./components/Header.vue";

import { useTranslations } from "./i18n/composables/useTranslations";
import { usePreloader } from "./composables/usePreloader";
import { useAgent } from "./composables/useAgent";

import Cursor from "./components/Cursor.vue";

import { useMusic } from "./features/sounds/composables/useMusic";
import { useHowler } from "./features/sounds/composables/useHowler";
import { useClickSound } from "./features/sounds/composables/useClickSounds";

import {
  useRouteObserver,
  path,
  projectVisible,
} from "./composables/useRouteObserver";

import Home from "./features/home/components/Home.vue";
import Project from "./features/projects/components/Project.vue";
import ProjectBackground from "./features/projects/components/ProjectBackground.vue";

import CertificatesPage from "./features/certificates/components/CertificatesPage.vue";

import { useProjectTransition } from "./composables/useProjectTransition";
import { useScroll } from "./composables/useScroll";

// -----------------------------------------------------------------------------
// GLOBAL COMPOSABLES
// -----------------------------------------------------------------------------

const { isTransitioning } = useProjectTransition();

useTranslations();
usePreloader();
useMusic();
useHowler();
useScroll();
useRouteObserver();
useClickSound();

const { isTouch } = useAgent();
</script>

<template>
  <!-- =========================================================
       SEPARATE CERTIFICATES PAGE
       No Header / Resume / Sound button / Cursor
  ========================================================== -->

  <CertificatesPage v-if="path === '/certificates'" />

  <!-- =========================================================
       NORMAL PORTFOLIO
  ========================================================== -->

  <template v-else>
    <Header />

    <!-- Main Home Page -->
    <div
      :class="{
        'home-wrapper-projectIsReady': projectVisible,
      }"
    >
      <Home />
    </div>

    <!-- Project Background -->
    <ProjectBackground />

    <!-- Project Page -->
    <div
      class="project-wrapper"
      :class="{
        'project-wrapper-visible': projectVisible,
        'project-wrapper-transitioning': isTransitioning,
      }"
    >
      <div class="project-content">
        <Project />
      </div>
    </div>

    <!-- Custom Cursor -->
    <Cursor v-if="!isTouch" />
  </template>
</template>

<style lang="scss">
/* =========================================================
   HOME
========================================================= */

.home-wrapper-projectIsReady {
  visibility: hidden;
  position: fixed;
  inset: 0;
}

/* =========================================================
   PROJECT PAGE
========================================================= */

.project-wrapper {
  position: fixed;
  inset: 0;

  overflow: hidden;

  z-index: var(--z-index-layout-project);

  visibility: hidden;
  pointer-events: none;

  &-visible {
    visibility: visible;
    pointer-events: auto;
    position: static;
  }
}

.project-content {
  width: 100%;
  height: 100%;

  overflow: hidden;
}
</style>
