<template>
  <div class="flex min-h-full">
    <Navbar :user="user" />
    <View :user="user" @fetchData="fetchData" />
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";
import View from "@/layouts/user/View.vue";
import Navbar from "@/components/Navbar.vue";

const userStore = useUserStore();
const user = ref({});

onBeforeMount(async () => {
  fetchData();
});
const fetchData = async () => {
  await userStore.getUser();
  user.value = userStore.user;
};
</script>
