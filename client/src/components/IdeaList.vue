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
                <genre-selection @update="handleGenreFilter" />
              </div>
              <div class="w-25">
                <span class="mb-4">Sort By</span>
                <v-select
                  :items="sorts"
                  clearable
                  density="compact"
                  v-model="selecteSorts"
                  @update:model-value="handleSortFilter"
                />
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="mb-6">
        <v-alert
          v-if="showAlert"
          closable
          text="This is mock data for the initial load. Please provide some ideas for using the app"
          type="info"
          variant="tonal"
        ></v-alert>
      </div>

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
import { STORE_KEY, SORTS } from "@/constant";
import { useEventsBus } from "@/plugins/useEventBus";
import { onBeforeMount, ref } from "vue";
import mockData from "@/mock-data";

const sorts = ref(SORTS);
const selecteSorts = ref([]);

const originalData = ref([]);
const items = ref([]);

const showAlert = ref(true);

const refreshData = () => {
  const ideaList = localStorage.getItem(STORE_KEY);

  if (ideaList) {
    showAlert.value = false;
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

const handleGenreFilter = (data) => {
  if (!data.value.length) {
    items.value = [...originalData.value];
    return;
  }

  items.value = originalData.value.filter((item) => {
    return data.value.some((selected) =>
      item.genres.includes(selected.toLowerCase())
    );
  });
};

const handleSortFilter = () => {
  const sortOptions = {
    Upvote: (item1, item2) => item2.upvotes.length - item1.upvotes.length,
    Downvote: (item1, item2) => item2.downvotes.length - item1.downvotes.length,
    Latest: (item1, item2) =>
      new Date(item2.created_at) - new Date(item1.created_at),
    Oldest: (item1, item2) =>
      new Date(item1.created_at) - new Date(item2.created_at),
  };

  const sortFunction = sortOptions[selecteSorts.value] || (() => 0);
  items.value = [...originalData.value].sort(sortFunction);
};

useEventsBus().on("refreshData", () => {
  refreshData();
});
</script>
