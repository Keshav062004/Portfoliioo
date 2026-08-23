<script setup lang="ts">
import Link from "../../../components/Link.vue";
import Notch from "../../../components/Notch.vue";
import ArrowRightLong from "../../../components/icons/ArrowRightLong.vue";
import ButtonRound from "../../../components/ButtonRound.vue";

import { t } from "../../../i18n/utils/translate";
import { social } from "../../../content/social";

import Plus from "../../../components/icons/Plus.vue";

import type { ProjectPreview } from "../../../content/types";

const props = defineProps<{
  preview?: ProjectPreview;
}>();
</script>

<template>

  <!-- =====================================================
       NORMAL PROJECT CARD
  ===================================================== -->

  <Link
    v-if="props.preview"
    class="preview-card children-unclickable"
    :to="`/project/${props.preview.slug}`"
    :aria-label="
      t('switch-to-project', {
        project: props.preview.title,
      })
    "
    data-cursor="arrow"
    data-sound="click"
    data-hoversound="hover"
  >

    <!-- =================================================
         PROJECT IMAGE
    ================================================= -->

    <div class="preview-card-top">

      <div class="preview-card-image-wrapper">

        <div class="preview-card-image-container">

          <img
            :src="props.preview.thumbnail"
            :alt="props.preview.title"
            class="preview-card-image"
          />

        </div>

      </div>


      <!-- ===============================================
           HOVER OVERLAY
      ================================================ -->

      <div class="preview-card-overlay">

        <div class="preview-card-edge">

          <ButtonRound
            class="preview-card-button"
            variant="accent"
            renderAs="div"
          >
            <ArrowRightLong
              class="preview-card-button-arrow"
            />
          </ButtonRound>

        </div>


        <Notch
          class="
            preview-card-notch
            preview-card-notch-left
          "
        />

        <Notch
          class="
            preview-card-notch
            preview-card-notch-right
          "
        />

      </div>

    </div>


    <!-- =================================================
         PROJECT CONTENT
    ================================================= -->

    <div class="preview-card-content">

      <div class="preview-card-copys">

        <h3 class="preview-card-title">
          {{ props.preview.title }}
        </h3>

        <p class="preview-card-description">
          {{ props.preview.description }}
        </p>

      </div>

    </div>

  </Link>


  <!-- =====================================================
       START A NEW PROJECT CARD
  ===================================================== -->

  <Link
    v-else
    class="preview-card children-unclickable"
    data-cursor="arrow-external"
    data-hoversound="hover"
    external
    :href="social[0].url"
  >

    <div
      class="
        preview-card-top
        preview-card-top-empty
      "
    >

      <Plus
        class="preview-card-top-empty-icon"
      />

    </div>


    <div class="preview-card-content">

      <div class="preview-card-copys">

        <h3 class="preview-card-title">
          {{ t("start-a-new-project") }}
        </h3>

      </div>

    </div>

  </Link>

</template>


<style scoped lang="scss">

/* =========================================================
   MAIN CARD
========================================================= */

.preview-card {
  --hover: 0;

  position: relative;

  border-radius:
    var(--radius-xl);

  z-index:
    var(--z-index-layout);


  /* =======================================================
     HOVER BACKGROUND
  ======================================================= */

  &::after {
    content: "";

    position: absolute;

    top: -8px;
    left: -8px;

    width:
      calc(100% + 16px);

    height:
      calc(100% + 16px);

    background-color:
      var(--color-grayscale-400);

    border-radius:
      var(--radius-xl);

    z-index: -1;

    opacity: 0;

    pointer-events: none;

    transition:
      opacity
      0.1s
      ease-in-out;
  }


  /* =======================================================
     HOVER
  ======================================================= */

  @include mixins.hover {

    &:hover {
      --hover: 1;

      &::after {
        opacity: 1;
      }
    }

  }


  /* =======================================================
     CONTENT
  ======================================================= */

  &-content {
    display: flex;

    flex-direction: column;

    gap:
      var(--space-md);

    padding-top:
      var(--space-xs);
  }


  /* =======================================================
     OVERLAY
  ======================================================= */

  &-overlay {

    @include mixins.hover {
      display: none;
    }

  }


  /* =======================================================
     NOTCH
  ======================================================= */

  &-notch {
    position: absolute;

    color:
      var(--color-beige-400);

    --icon-color:
      var(--color-beige-400);

    transform:
      scale(-1)
      rotate(90deg);

    height:
      var(--radius-lg);


    &-left {
      bottom: 0;

      right: 50px;
    }


    &-right {
      bottom: 50px;

      right: 0;
    }

  }


  /* =======================================================
     ARROW EDGE
  ======================================================= */

  &-edge {
    position: absolute;

    bottom: -1px;

    right: -1px;

    background-color:
      var(--color-beige-400);

    padding-left: 6px;

    padding-top: 6px;

    border-radius:
      32px 0 0 0;

    padding-right: 1px;

    padding-bottom: 1px;
  }


  /* =======================================================
     ARROW
  ======================================================= */

  &-button {

    &-arrow {
      transition:
        transform
        0.1s
        ease-in-out;

      width: 100%;

      transform:
        rotate(
          calc(
            var(--hover) * -45deg
          )
        );
    }

  }


  /* =======================================================
     IMAGE
  ======================================================= */

  &-image {

    width: 100%;

    height: 100%;

    object-fit: cover;


    &-container {
      transition:
        transform
        0.1s
        ease-in-out;

      transform:
        scale(
          calc(
            1 +
            var(--hover) * 0.02
          )
        );

      aspect-ratio:
        16 / 9;
    }


    &-wrapper {
      border-radius:
        var(--radius-lg);

      overflow: hidden;

      background-color:
        var(--color-beige-500);
    }

  }


  /* =======================================================
     TOP IMAGE AREA
  ======================================================= */

  &-top {
    position: relative;

    width: 100%;

    aspect-ratio:
      16 / 9;


    /* ===============================================
       EMPTY CARD
    ================================================ */

    &-empty {
      border:
        4px dashed
        var(--color-grayscale-500);

      border-radius:
        var(--radius-lg);

      background-color:
        var(--color-grayscale-400);

      display: flex;

      align-items: center;

      justify-content: center;


      &-icon {
        width:
          var(--icon-size-lg);

        color:
          var(--color-text-300);

        --icon-color:
          var(--color-text-300);

        --stroke-width:
          4px;
      }

    }

  }


  /* =======================================================
     COPY
  ======================================================= */

  &-copys {
    display: flex;

    flex-direction: column;
  }


  /* =======================================================
     TITLE
  ======================================================= */

  &-title {
    font-size:
      var(--font-size-title-xs);

    font-weight: 700;

    color:
      var(--color-text-400);
  }


  /* =======================================================
     DESCRIPTION
  ======================================================= */

  &-description {
    font-size:
      var(--font-size-md);

    color:
      var(--color-text-300);

    font-weight: 500;
  }

}

</style>