<template>
  <v-card :color="props.color" :variant="props.variant" class="mx-auto">
    <v-img height="200px" :src="props.data.coverImg" cover></v-img>
    <v-card-item>
      <div class="mt-4">
        <div class="text-h6 mb-1">{{ props.data.title }}</div>
        <div class="text-caption">
          {{ props.data.description }}
        </div>
      </div>
    </v-card-item>

    <v-divider inset></v-divider>

    <v-card-actions class="d-flex justify-end">
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-avatar
            color="grey-darken-3"
            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-avatar>
        </template>

        <v-list-item-title
          >Create by: {{ props.data.created_by }}</v-list-item-title
        >

        <v-list-item-subtitle>Create at: {{ createAt }}</v-list-item-subtitle>

        <template v-slot:append>
          <div class="d-flex justify-self-end">
            <div class="upvote-btn" :class="{ success: isUpvoted }">
              <v-btn
                :prepend-icon="
                  isUpvoted ? 'mdi-arrow-up-bold' : 'mdi-arrow-up-bold-outline'
                "
                @click="upvote"
              >
                Upvote
              </v-btn>
              <span class="text-caption font-weight-thin success"
                >{{ props.data.upvotes.length }}
              </span>
            </div>
            <div class="downvote-btn" :class="{ error: isDownvoted }">
              <v-btn
                :prepend-icon="
                  isDownvoted
                    ? 'mdi-arrow-down-bold'
                    : 'mdi-arrow-down-bold-outline'
                "
                @click="downvote"
              >
                Downvote
              </v-btn>
              <span class="text-caption font-weight-thin error"
                >{{ props.data.downvotes.length }}
              </span>
            </div>
          </div>
        </template>
      </v-list-item>
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

const createAt = computed(() => {
  const date = new Date(props.data.created_at);
  return `${date.getHours()}:${date.getMinutes()} ${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
});

const appStore = useAppStore();
const emit = defineEmits(["upvote", "downvote"]);

const { upvotes, downvotes, id } = props.data;

const isUpvoted = computed(() => {
  return !!upvotes.includes(appStore.userID);
});

const isDownvoted = computed(() => {
  return !!downvotes.includes(appStore.userID);
});

const upvote = () => {
  const payload = {
    id: id,
    userID: appStore.userID,
  };

  emit("upvote", payload);
};

const downvote = () => {
  const payload = {
    id: id,
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
  color: rgb(var(--v-theme-error));
}

.success {
  color: rgb(var(--v-theme-success));
}

.error {
  color: rgb(var(--v-theme-error));
}
</style>
