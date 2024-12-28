<template>
  <v-container class="fill-height">
    <v-responsive class="align-top fill-height mx-auto" max-width="900">
      <v-text-field
        single-line
        hide-details
        variant="solo"
        density="default"
        append-inner-icon="mdi-close"
        placeholder="Search by title"
        class="my-5"
        v-model="searchStr"
        @input="onInputChange"
        @click:append-inner="clearSearchStr"
      ></v-text-field>

      <v-data-iterator :items="items">
        <template v-slot:default="{ items }">
          <template v-for="item in items" :key="item.id">
            <idea-card
              class="mt-2"
              :data="item.raw"
              @upvote="upvote"
              @downvote="downvote"
            />
          </template>
        </template>
      </v-data-iterator>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { STORE_KEY } from "@/constant";
import { useEventsBus } from "@/plugins/useEventBus";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import mockData from "@/mock-data";

const originalData = ref([]);
const items = ref([]);

onBeforeMount(() => {
  const ideaList = localStorage.getItem(STORE_KEY);

  if (ideaList) {
    originalData.value = JSON.parse(ideaList);
  } else {
    originalData.value = [...mockData];
  }

  items.value = [...originalData.value];
});

const searchStr = ref("");

const refreshData = () => {
  if (!searchStr.value) {
    items.value = [...originalData.value];
    return;
  }

  items.value = originalData.value.filter((item) =>
    item.title.toLowerCase().includes(searchStr.value.toLowerCase())
  );
};

let debounceTimeout = null;
const onInputChange = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    refreshData();
  }, 200);
};

const clearSearchStr = () => {
  if (!searchStr.value.length) {
    return;
  }
  searchStr.value = "";
  refreshData();
};

const toggleValue = (payload, mode) => {
  const { id, userID } = payload;

  const item = items.value.find((item) => item.id === id);

  if (item) {
    const userIndex = item[mode].indexOf(userID);

    if (userIndex !== -1) {
      item[mode].splice(userIndex, 1);
    } else {
      item[mode].push(userID);
    }

    // TODO: should update once page unmount
    localStorage.setItem(STORE_KEY, JSON.stringify(items.value));
  }
};

const upvote = (payload) => {
  toggleValue(payload, "upvotes");
};

const downvote = (payload) => {
  toggleValue(payload, "downvotes");
};

useEventsBus().on("refreshData", () => {
  refreshData();
});
</script>
