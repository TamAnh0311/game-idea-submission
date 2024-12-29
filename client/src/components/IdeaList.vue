<template>
  <v-container class="fill-height">
    <v-responsive class="align-top fill-height mx-auto">
      <p class="text-h5">Search Idea</p>
      <v-text-field
        v-model="searchStr"
        single-line
        hide-details
        variant="solo"
        density="default"
        append-inner-icon="mdi-close"
        placeholder="Search by title"
        class="my-5"
        @input="onInputChange"
        @click:append-inner="clearSearchStr"
      />

      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Filters">
          <v-expansion-panel-text>
            <div class="d-flex justify-space-between align-center">
              <div class="w-66">
                <span class="mb-4">Genres</span>

                <v-select
                  :items="genres"
                  chips
                  multiple
                  clearable
                  closable-chips
                  density="compact"
                />
              </div>
              <div class="w-25">
                <span class="mb-4">Sort By</span>
                <v-select :items="sorts" clearable density="compact" />
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div v-if="items.length">
        <p class="text-h6">Idea List</p>
        <v-data-iterator :items="items">
          <template #default="{ items }">
            <template v-for="item in items" :key="item.id">
              <idea-card
                class="mt-4"
                :data="item.raw"
                @upvote="upvote"
                @downvote="downvote"
              />
            </template>
          </template>
        </v-data-iterator>
      </div>
      <div v-else>
        <p class="text-center text-h6">
          No idea found! Why don't you take that idea ?
        </p>
      </div>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { STORE_KEY } from "@/constant";
import { useEventsBus } from "@/plugins/useEventBus";
import { onBeforeMount, ref } from "vue";
import mockData from "@/mock-data";

const genres = ref([
  "action-adventure",
  "puzzle",
  "casino",
  "shooter",
  "turn-based",
]);

const sorts = ref(["Upvote", "Downvote", "Latest", "Oldest"]);

const originalData = ref([]);
const items = ref([]);

const refreshData = () => {
  const ideaList = localStorage.getItem(STORE_KEY);

  if (ideaList) {
    originalData.value = JSON.parse(ideaList);
  } else {
    originalData.value = [...mockData];
  }

  items.value = [...originalData.value];
};

onBeforeMount(() => {
  refreshData();
});

const searchStr = ref("");

const filterData = () => {
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
    filterData();
  }, 200);
};

const clearSearchStr = () => {
  if (!searchStr.value.length) {
    return;
  }
  searchStr.value = "";
  filterData();
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
