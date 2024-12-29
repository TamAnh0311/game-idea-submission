<template>
  <div>
    <span class="mb-4">Genres</span>

    <v-select
      chips
      multiple
      clearable
      closable-chips
      density="compact"
      placeholder="Select cover image"
      v-model="selecteGenres"
      :items="genres"
      @update:model-value="handleGenreSelection"
    />
  </div>
</template>

<script setup>
import { GENRES } from "@/constant";
import { ref } from "vue";

const genres = ref(GENRES);
const selecteGenres = ref([]);

const emit = defineEmits(["update"]);

const handleGenreSelection = () => {
  emit("update", selecteGenres);
};
</script>

