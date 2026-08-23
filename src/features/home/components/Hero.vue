<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import Banner from "../../../components/Banner.vue";
import { preloaderVisible } from "../../../composables/usePreloader";
import { t } from "../../../i18n/utils/translate";

let animationFrame = 0;

const handleMouseMove = (event: MouseEvent) => {
  if (animationFrame) return;

  animationFrame = requestAnimationFrame(() => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;

    /*
     * Small movement so the wall follows
     * the 3D room without moving too much.
     */
    document.documentElement.style.setProperty(
      "--hero-wall-x",
      `${x * 6}px`
    );

    document.documentElement.style.setProperty(
      "--hero-wall-y",
      `${y * 5}px`
    );

    animationFrame = 0;
  });
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove, {
    passive: true,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", handleMouseMove);

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  document.documentElement.style.removeProperty("--hero-wall-x");
  document.documentElement.style.removeProperty("--hero-wall-y");
});
</script>

<template>
  <div class="hero">

    <!-- =====================================================
         BLACK HERO WALL
    ====================================================== -->
    <div class="hero-wall"></div>

    <!-- =====================================================
         HERO CONTENT
    ====================================================== -->
    <div class="hero-content grid">

      <div
        class="hero-content-inner"
        id="hero-content-inner"
      >

        <div class="hero-content-copys">

          <!-- =================================================
               NAME + BANNER
          ================================================== -->
          <div class="hero-primary">

            <h1 class="hero-title">
              Keshav<br />Gupta
            </h1>

            <Banner
              class="hero-banner"
              :copy="t('job-title')"
              v-if="!preloaderVisible"
              animated
            />

          </div>

          <!-- =================================================
               TAGLINE
          ================================================== -->
          <p class="hero-tagline">
            Full-stack developer with real-world cloud experience.
          </p>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">

/* ============================================================
   HERO
============================================================ */

.hero {
  max-height: calc(var(--lvh) * 100);
  height: calc(var(--lvh) * 100);

  width: 100%;

  display: flex;

  position: relative;

  overflow: hidden;


/* ============================================================
   BLACK WALL
============================================================ */

  &-wall {
    position: absolute;

    /*
     * Slightly extend the wall outside
     * the viewport so the cream background
     * cannot appear during parallax.
     */
    top: -10px;
    left: -15px;

    width: calc(41.5% + 30px);
    height: calc(100% + 20px);

    background: #080c10;

    z-index: 1;

    /*
     * Angled bottom edge.
     */
    clip-path: polygon(
      0 0,
      100% 0,
      100% 58%,
      96% 63%,
      78% 69%,
      55% 76%,
      30% 85%,
      0 94%
    );

    pointer-events: none;

    /*
     * Mouse parallax.
     *
     * clamp() guarantees that the wall
     * can never move too far.
     */
    transform: translate3d(
      clamp(-6px, var(--hero-wall-x, 0px), 6px),
      clamp(-5px, var(--hero-wall-y, 0px), 5px),
      0
    );

    transition: transform 0.15s ease-out;

    will-change: transform;


    @include mixins.mq("lg") {
      width: calc(40.5% + 30px);

      clip-path: polygon(
        0 0,
        100% 0,
        100% 58%,
        97% 63%,
        82% 69%,
        60% 77%,
        32% 86%,
        0 94%
      );
    }
  }


/* ============================================================
   HERO CONTENT
============================================================ */

  &-content {
    position: relative;

    z-index: 2;

    align-items: center;

    justify-content: flex-start;

    height: 100%;


    @include mixins.landscape {
      height: 100%;

      padding-bottom: 0;
    }


    @include mixins.mq("lg") {
      padding-left: 4.5%;
    }


    @include mixins.mq("xl") {
      padding-left: 5%;
    }


/* ==========================================================
   HERO INNER
========================================================== */

    &-inner {
      transform-origin: center center;

      grid-column: 1 / 6;

      display: flex;

      flex-direction: column;

      align-items: flex-start;

      justify-content: center;

      width: 100%;

      position: relative;

      left: 0;

      transform: none;


      @include mixins.landscape {
        grid-column: 1 / 6;

        left: 0;

        transform: none;

        width: 100%;
      }


      @include mixins.mq("lg") {
        grid-column: 1 / 6;
      }
    }


/* ==========================================================
   COPY CONTAINER
========================================================== */

    &-copys {
      display: flex;

      flex-direction: column;

      align-items: flex-start;

      gap: 0;

      width: 100%;


      @include mixins.mq("md") {
        gap: 0;
      }
    }


    &-button {
      width: fit-content;
    }
  }


/* ============================================================
   NAME + BANNER
============================================================ */

  &-primary {
    position: relative;

    width: fit-content;

    display: block;
  }


/* ============================================================
   NAME
============================================================ */

  &-title {
    font-weight: 900;

    letter-spacing: 0.02em;

    font-size: var(--font-size-title-lg);

    margin: 0;

    /*
     * White text on black wall.
     */
    color: var(--color-white-400);

    position: relative;

    z-index: 2;


    @include mixins.landscape {
      font-size: var(--font-size-title-lg);
    }


    @include mixins.landscape-large {

      @include mixins.mq("sm") {
        font-size: var(--font-size-title-xl);
      }


      @include mixins.mq("xl") {
        font-size: var(--font-size-title-xxl);
      }

    }
  }


/* ============================================================
   SOFTWARE DEVELOPER BANNER
============================================================ */

  &-banner {
    position: absolute;

    bottom: 0;

    right: -16px;

    z-index: 10;

    transform:
      rotate(-5deg)
      translate(0, 65%);


    @include mixins.mq("sm") {
      right: -24px;

      transform:
        rotate(-5deg)
        translate(0, 70%);
    }


    @include mixins.mq("lg") {
      right: -32px;

      transform:
        rotate(-5deg)
        translate(0, 80%);
    }
  }


/* ============================================================
   TAGLINE
============================================================ */

  &-tagline {
    margin: 70px 0 0 0;

    max-width: 430px;

    font-size: var(--font-size-md);

    line-height: 1.5;

    font-weight: 500;

    letter-spacing: 0.01em;

    text-align: left;

    color: var(--color-white-400);

    opacity: 0.85;

    position: relative;

    z-index: 2;


    @include mixins.mq("md") {
      margin-top: 75px;

      font-size: var(--font-size-lg);

      max-width: 450px;
    }


    @include mixins.landscape {
      max-width: 430px;
    }


    @include mixins.mq("lg") {
      margin-top: 78px;
    }
  }


/* ============================================================
   MOBILE
============================================================ */

  @media (max-width: 767px) {

    &-wall {
      width: calc(100% + 30px);

      height: calc(63% + 20px);

      top: -10px;

      left: -15px;

      clip-path: polygon(
        0 0,
        100% 0,
        100% 88%,
        82% 94%,
        55% 98%,
        0 100%
      );
    }


    &-content {
      align-items: flex-start;
      justify-content: center;

      padding-top: 150px;
      padding-left: 8%;

      padding-right: 8%;
    }


    &-content-inner {
      grid-column: 1 / 13;

      width: 100%;
    }


    &-title {
      font-size: var(--font-size-title-lg);
    }


    &-tagline {
      max-width: 85%;

      margin-top: 65px;

      font-size: var(--font-size-md);
    }
  }

}

</style>
