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
            <v-text-field
              required
              label="Title"
              v-model="idea.title"
            ></v-text-field>

            <v-textarea
              required
              clearable
              label="Description"
              v-model="idea.description"
              clear-icon="mdi-close-circle"
            ></v-textarea>
          </form>
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
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { STORE_KEY } from "@/constant";
import { useEventsBus } from "@/plugins/useEventBus";
import { generateId } from "@/use/useGenerateID";
import { ref } from "vue";

const idea = ref({
  title: "",
  description: "",
});

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
  };

  const currentIdeas = JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  currentIdeas.push(newIdea);
  localStorage.setItem(STORE_KEY, JSON.stringify(currentIdeas));

  isActive.value = false;
  useEventsBus().emit("refreshData");
};
</script>

<style>
</style>