<template>
  <v-card :color="props.color" :variant="props.variant" class="mx-auto">
    <v-card-item>
      <div>
        <div class="text-h6 mb-1">{{ props.data.title }}</div>
        <div class="text-caption">
          {{ props.data.description }}
        </div>
      </div>
    </v-card-item>

    <v-card-actions>
      <div class="upvote-btn" :class="{ success: isUpvoted }">
        <v-btn
          :prepend-icon="
            isUpvoted ? 'mdi-arrow-up-bold' : 'mdi-arrow-up-bold-outline'
          "
          variant="plain"
          @click="upvote"
        >
          Upvote
        </v-btn>
        <span class="text-caption font-weight-thin success"
          >{{ props.data.upvotes.length }}
        </span>
      </div>
      <div class="downvote-btn" :class="{ warning: isDownvoted }">
        <v-btn
          :prepend-icon="
            isDownvoted ? 'mdi-arrow-down-bold' : 'mdi-arrow-down-bold-outline'
          "
          variant="plain"
          @click="downvote"
        >
          Downvote
        </v-btn>
        <span class="text-caption font-weight-thin warning"
          >{{ props.data.downvotes.length }}
        </span>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "indigo",
  },
  variant: {
    type: String,
    default: "tonal",
  },
  data: {
    type: Object,
    required: true,
  },
});

const appStore = useAppStore();
const emit = defineEmits(["upvote", "downvote"]);

const isUpvoted = computed(() => {
  return !!props.data.upvotes.includes(appStore.userID);
});

const isDownvoted = computed(() => {
  return !!props.data.downvotes.includes(appStore.userID);
});

const upvote = () => {
  const payload = {
    id: props.data.id,
    userID: appStore.userID,
  };

  emit("upvote", payload);
};

const downvote = () => {
  const payload = {
    id: props.data.id,
    userID: appStore.userID,
  };
  emit("downvote", payload);
};
</script>

<style scoped>
.upvote-btn:hover {
  color: rgb(var(--v-theme-success));
}

.downvote-btn:hover {
  color: rgb(var(--v-theme-warning));
}

.success {
  color: rgb(var(--v-theme-success));
}

.warning {
  color: rgb(var(--v-theme-warning));
}
</style>