<script setup lang="ts">
import { Howler } from "howler";
import { soundsEnabled, howlerUnlocked } from "../features/sounds/composables/useHowler";
import ButtonRound from "./ButtonRound.vue";
import Volume from "./icons/Volume.vue";
import { t } from "../i18n/utils/translate";
const props = defineProps<{
  isDarkTheme: boolean;
}>();

const toggleSounds = async () => {
  // Mobile browsers require audio to be unlocked from a user gesture.
  try {
    if (Howler.ctx?.state !== "running") {
      await Howler.ctx?.resume();
    }
  } catch {
    // The browser may not expose AudioContext.resume(); the next gesture
    // will try again.
  }

  howlerUnlocked.value = true;
  soundsEnabled.value = !soundsEnabled.value;
};
</script>

<template>
  <ButtonRound
    v-if="true"
    variant="theme"
    :class="{ 'music-toggle': true, 'music-toggle-dark': props.isDarkTheme, 'children-unclickable': true }"
    @click="toggleSounds"
    :aria-label="soundsEnabled && howlerUnlocked ? t('disable-sounds') : t('enable-sounds')"
    data-cursor="circle-white"
    data-sound="click"
    data-hoversound="hover"
  >
    <Volume :active="soundsEnabled && howlerUnlocked" />
  </ButtonRound>
</template>

<style scoped lang="scss">
.music-toggle {
  &-dark {
    background-color: var(--color-dark-blue-500);
    color: var(--color-white-400);
    --icon-color: var(--color-white-400);
  }
}
</style>
