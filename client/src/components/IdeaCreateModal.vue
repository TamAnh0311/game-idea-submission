<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" prepend-icon="mdi-plus" variant="tonal">
        Submit your Idea!
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card title="Submit your idea!">
        <v-card-text>
          <form>
            <p class="mb-4">Title</p>
            <v-text-field
              required
              label="Title"
              v-model="idea.title"
            ></v-text-field>

            <p class="mb-4">Description</p>
            <v-textarea
              required
              clearable
              label="Description"
              v-model="idea.description"
              clear-icon="mdi-close-circle"
            ></v-textarea>
          </form>

          <genre-selection @update="handleGenreSelection" />

          <p class="mb-4">Cover Image</p>

          <v-select
            placeholder="Select cover image"
            :items="themes"
            item-title="label"
            item-value="src"
            density="compact"
            @update:model-value="handleCoverSelection"
          ></v-select>

          <v-img height="100px" :src="idea.coverImg" cover></v-img>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Submit"
            color="primary"
            @click="submit(isActive)"
          ></v-btn>
          <v-btn
            text="Close Dialog"
            color="secondary"
            @click="closeDialog(isActive)"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { STORE_KEY } from "@/constant";
import { useEventsBus } from "@/plugins/useEventBus";
import { useAppStore } from "@/stores/app";
import { generateId } from "@/use/useGenerateID";
import { ref } from "vue";

const themes = ref([
  {
    label: "Cover 1",
    src: "https://funfactco.com/cdn/shop/articles/fun-facts-about-video-games.jpg?v=1699969164&width=2000",
  },
  {
    label: "Cover 2",
    src: "https://img.freepik.com/premium-photo/seamless-80s-retro-pattern-with-video-game-theme_841543-3843.jpg",
  },
  {
    label: "Cover 3",
    src: "https://github.blog/wp-content/uploads/2024/10/game-off-og.png?fit=1200%2C630",
  },
]);

const idea = ref({
  title: "",
  description: "",
  genres: [],
  coverImg: themes.value[0].src,
});

const handleGenreSelection = (data) => {
  idea.value.genres = data;
};

const handleCoverSelection = (selectedTheme) => {
  idea.value.coverImg = selectedTheme;
};

const appStore = useAppStore();
const submit = (isActive) => {
  if (!idea.value.title.length || !idea.value.description.length) {
    alert("Cannot submit idea without title or description");
    return;
  }

  const newIdea = {
    id: generateId(STORE_KEY),
    title: idea.value.title,
    description: idea.value.description,
    upvotes: [],
    downvotes: [],
    genres: idea.value.genres,
    coverImg: idea.value.coverImg,
    created_by: JSON.parse(appStore.userID),
    created_at: new Date(),
  };

  const currentIdeas = JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  currentIdeas.push(newIdea);
  localStorage.setItem(STORE_KEY, JSON.stringify(currentIdeas));

  closeDialog(isActive);
  useEventsBus().emit("refreshData");
};

const closeDialog = (isActive) => {
  idea.value = {
    title: "",
    description: "",
    genres: [],
  };
  isActive.value = false;
};
</script>