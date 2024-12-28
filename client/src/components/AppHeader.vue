<template>
  <v-app-bar
    color="teal-darken-4"
    image="https://picsum.photos/1920/1080?random"
  >
    <template v-slot:image>
      <v-img
        gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
      ></v-img>
    </template>

    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Game Submission Portal</v-app-bar-title>

    <v-spacer></v-spacer>

    <idea-create-modal />

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item class="text-center"
          >User: {{ appStore.userID }}</v-list-item
        >
        <v-list-item class="text-center"
          ><v-btn variant="plain" @click="logOut">Logout</v-btn></v-list-item
        >
      </v-list>
    </v-menu>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { USER_ID_KEY } from "@/constant";
import { useAppStore } from "@/stores/app";
import { generateId } from "@/use/useGenerateID";
import { onBeforeMount, ref } from "vue";

const userID = ref("");
const appStore = useAppStore();

onBeforeMount(() => {
  let currentUser = sessionStorage.getItem(USER_ID_KEY);
  if (!currentUser) {
    currentUser = generateId();
    sessionStorage.setItem(USER_ID_KEY, JSON.stringify(currentUser));
  }
  userID.value = currentUser;
  appStore.setUserID(currentUser);
});

const logOut = () => {
  sessionStorage.removeItem(USER_ID_KEY);
  window.location.reload();
};
</script>

<style></style>
