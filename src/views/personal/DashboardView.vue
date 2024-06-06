<template>
  <div
    class="w-full flex flex-col items-center justify-center text-surface-700 py-12 md:px-12 gap-5"
  >
    <div class="flex w-full h-full max-lg:flex-col gap-5">
      <div
        class="flex flex-col justify-center items-center w-1/2 max-lg:w-full rounded-lg bg-white border-2 shadow-xl p-5 h-[500px]"
      >
        <div class="text-3xl font-bold text-center">Welcome</div>
        <div class="mx-auto">
          <img src="../../assets/astronauta3.png" width="200" />
        </div>
        <div class="text-2xl font-medium text-center mt-5">
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
        <div class="text-3xl w-full h-16 font-bold max-[480px]:p-5">
          Requests
        </div>
        <div
          class="flex items-center justify-center w-full h-full p-10 max-[480px]:p-1"
        >
          <Pie
            v-if="requests.length"
            :data="{
              labels: ['Pending', 'Approved', 'Rejected'],
              datasets: [
                {
                  backgroundColor: ['#f8771d', '#25c45c', '#e9484a'],
                  data: [
                    requests.filter((request) => request.status === 'Pending')
                      .length,
                    requests.filter((request) => request.status === 'Approved')
                      .length,
                    requests.filter((request) => request.status === 'Rejected')
                      .length,
                  ],
                },
              ],
            }"
            :options="chartOptions"
          />
          <div v-if="!requests.length" class="text-3xl font-bold">
            No Requests
          </div>
        </div>
      </div>
    </div>
    <div class="p-5 w-full h-full border rounded-lg mx-auto bg-white shadow-xl">
      <div class="text-3xl font-semibold mb-5">Pending requests</div>
      <DataTable
        :value="requests.filter((request) => request.status === 'Pending')"
        paginator
        :rows="2"
        size="small"
        :loading="loading"
        removableSort
        tableStyle="min-width: 30rem"
        class="border border-surface-200"
      >
        <template #empty>
          <div class="text-center">
            {{
              user.team
                ? "No requests found."
                : "You aren't assigned to any team"
            }}
          </div>
        </template>
        <template #loading> Loading requests data. Please wait. </template>
        <Column field="user.firstName" sortable header="First Name">
          <template #body="{ data }">
            {{ data.user?.firstName }}
          </template>
        </Column>
        <Column field="user.lastName" sortable header="Last Name">
          <template #body="{ data }">
            {{ data.user?.lastName }}
          </template>
        </Column>
        <Column field="reason" sortable header="Reason">
          <template #body="{ data }">
            {{ data.reason }}
          </template>
        </Column>
        <Column field="status" sortable header="Status">
          <template #body="{ data }">
            <Tag
              :severity="getSeverity(data.status)"
              :value="data.status"
            ></Tag>
          </template>
        </Column>
        <Column field="createdAt" sortable header="Created At">
          <template #body="{ data }">
            {{
              data.createdAt
                ? format(data.createdAt, "DD/MM/YYYY", "en")
                : "N/A"
            }}
          </template>
        </Column>
        <Column header="Actions" headerStyle="width: 5rem; text-align: center">
          <template #body="{ data }">
            <Button
              @click="
                router.push({
                  name: 'personal-employee-request',
                  params: { requestId: data.id, employeeId: data.user?.id },
                })
              "
              size="small"
              icon="pi pi-cog"
              severity="info"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRequestStore } from "@/stores/request";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { format } from "@formkit/tempo";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const router = useRouter();
const requestStore = useRequestStore();
const requests = ref([]);
const prop = defineProps(["user"]);
const chartOptions = {
  responsive: true,
};
const loading = ref(true);

onMounted(async () => {
  await requestStore.getRequestsByPersonal();
  requests.value = requestStore.requests.filter(
    (request) => request.user?.role !== "PERSONAL"
  );
  loading.value = false;
});
const getSeverity = (status) => {
  switch (status) {
    case "Pending":
      return "warning";

    case "Approved":
      return "success";

    case "Rejected":
      return "danger";
  }
};
</script>
