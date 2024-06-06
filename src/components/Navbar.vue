<template>
  <div class="flex" ref="nav">
    <Menu
      :model="items"
      class="h-screen w-[15rem] overflow-y-auto fixed md:sticky top-0 left-0 z-50 transition-all text-white bg-gradient-to-t from-primary-400 to-primary-700 rounded-none"
      :class="{
        'max-md:left-[-15rem]': show === false,
        'max-md:left-0': show === true,
      }"
    >
      <template #start>
        <div class="inline-flex items-center space-x-2 px-2 py-2 text-white">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="50"
            fill="none"
          >
            <path
              fill="rgb(131, 26, 25)"
              d="M48.44 90V51.56H10C10.803 72.393 27.607 89.197 48.44 90z"
            ></path>
            <path
              fill="rgb(41, 9, 8)"
              d="M10 48.44h38.44V10C27.607 10.803 10.803 27.607 10 48.44z"
            ></path>
            <path
              fill="rgb(73, 18, 18)"
              d="M90 51.56H51.56V90C72.393 89.197 89.197 72.393 90 51.56z"
            ></path>
            <path
              fill="rgb(194, 66, 41)"
              d="M90 48.44C89.197 27.607 72.393 10.803 51.56 10v38.44H90z"
            ></path>
          </svg>
          <div class="inline-flex flex-col items-start">
            <span class="text-xl font-bold">{{
              user.firstName?.split(" ")[0]
            }}</span>
            <span class="text-base">{{ user.role }}</span>
          </div>
        </div>
      </template>
      <template #item="{ item }">
        <button
          v-ripple
          @click="navigate(item.route)"
          class="w-full font-semibold flex rounded-md hover:bg-primary-300 items-center py-3 px-5 mb-1"
          :class="{
            'bg-primary-300 text-primary-500 rounded-md': path.startsWith(
              item.route
            ),
          }"
        >
          <span :class="item.icon" class="text-base leading-6" />
          <span class="ml-2 text-base leading-6">{{ item.label }}</span>
        </button>
      </template>
    </Menu>
    <div class="fixed md:hidden z-50" :class="{ hidden: show === true }">
      <Button icon="pi pi-bars" class="m-4" @click="show = true" />
    </div>
    <div class="absolute right-0 top-0">
      <Button
        icon="pi pi-sign-out"
        label="Logout"
        class="m-2"
        @click="logout"
        link
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const prop = defineProps(["user"]);
const show = ref(false);
const nav = ref(null);
const path = ref(router.currentRoute.value.path);
const items = ref([]);
const admin = [
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/admin/home",
  },
  {
    label: "Users",
    icon: "pi pi-users",
    route: "/admin/users",
  },
  {
    label: "Teams",
    icon: "pi pi-th-large",
    route: "/admin/teams",
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    route: "/admin/profile",
  },
];
const personal = [
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/personal/home",
  },
  {
    label: "Requests",
    icon: "pi pi-inbox",
    route: "/personal/requests",
  },
  {
    label: "Users",
    icon: "pi pi-users",
    route: "/personal/users",
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    route: "/personal/profile",
  },
];
const employee = [
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/employee/home",
  },
  {
    label: "Requests",
    icon: "pi pi-pencil",
    route: "/employee/requests",
  },
  {
    label: "Settings",
    icon: "pi pi-cog",
    route: "/employee/profile",
  },
];

onMounted(() => {
  if (localStorage.getItem("role") === "ADMIN") {
    items.value = [...admin];
  } else if (localStorage.getItem("role") === "PERSONAL") {
    items.value = [...personal];
  } else {
    items.value = [...employee];
  }
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
const handleClickOutside = (event) => {
  if (!nav.value.contains(event.target)) {
    show.value = false;
  }
};
const navigate = (route) => {
  path.value = route;
  router.push(route);
  show.value = false;
};
const logout = () => {
  authStore.logout();
};
</script>
