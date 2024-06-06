<template>
  <div
    class="w-full flex max-lg:flex-col items-center justify-center text-surface-700 py-12 md:px-12 gap-5"
  >
    <div
      class="flex flex-col justify-center items-center w-1/2 max-lg:w-full rounded-lg bg-white border-2 shadow-xl p-5 h-[500px]"
    >
      <div class="text-3xl font-bold text-center">Welcome</div>
      <div class="mx-auto">
        <img src="../../assets/astronauta3.png" width="200" />
      </div>
      <div class="text-3xl font-medium text-center mt-5">
        {{ user.firstName }} {{ user.lastName }}
      </div>
      <div class="text-lg font-normal text-center mt-5">
        Welcome to the license and vacation request management system. We hope
        you have a productive day!
      </div>
    </div>
    <div
      class="flex flex-col items-center w-1/2 max-lg:w-full rounded-lg bg-white border-2 shadow-xl max-[480px]:p-0 p-5 max-md:max-h-[500px] md:h-[500px]"
    >
      <div class="text-3xl w-full h-16 font-bold max-[480px]:p-5">Users</div>
      <div
        class="flex items-center justify-center w-full h-full p-10 max-[480px]:p-1"
      >
        <Pie
          v-if="users.length"
          :data="{
            labels: ['EMPLOYEE', 'PERSONAL'],
            datasets: [
              {
                backgroundColor: ['#25c45c', '#3c84f4'],
                data: [
                  users.filter((user) => user.role === 'EMPLOYEE').length,
                  users.filter((user) => user.role === 'PERSONAL').length,
                ],
              },
            ],
          }"
          :options="chartOptions"
        />
        <div v-if="!users.length" class="text-3xl font-bold py-20">
          No Users
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const userStore = useUserStore();
const users = ref([]);
const prop = defineProps(["user"]);

const chartOptions = {
  responsive: true,
};

onMounted(async () => {
  await userStore.getAllUsers();
  users.value = userStore.users.filter((user) => user.id !== prop.user.id);
});
</script>
