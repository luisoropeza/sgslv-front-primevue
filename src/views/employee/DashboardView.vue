<template>
  <div
    class="w-full flex flex-col items-center justify-center text-surface-700 py-12 md:px-12 gap-5"
  >
    <!-- <div
      class="p-5 w-full h-full flex justify-center items-center border rounded-lg mx-auto bg-white shadow-xl"
    >
      <div class="w-full">
        <DataTable
          :value="requests.filter((request) => request.status === 'Pending')"
          size="small"
          :loading="loading"
          removableSort
          tableStyle="min-width: 30rem"
          class="border-x border-t border-surface-200"
        >
          <template #header>
            <div class="flex justify-between flex-wrap gap-3">
              <DialogCreateRequest
                @fetchData="fetchData"
                :user="user"
                :disable="
                  requests.filter((request) => request.status === 'Pending')
                    .length >= 1
                "
              />
            </div>
          </template>
          <template #empty>
            <div class="text-center">
              {{
                user.team
                  ? "No request pending found."
                  : "You aren't assigned to any team"
              }}
            </div>
          </template>
          <template #loading> Loading request data. Please wait. </template>
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
          <Column
            header="Actions"
            headerStyle="width: 5rem; text-align: center"
          >
            <template #body="{ data }">
              <Button
                @click="
                  router.push({
                    name: 'employee-request',
                    params: { id: data.id },
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
    </div> -->
    <div
      class="flex w-full h-full justify-center items-center max-lg:flex-col gap-5"
    >
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
          <div v-if="!requests.length" class="text-3xl font-bold py-20">
            No Requests
          </div>
        </div>
      </div>
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
import DialogCreateRequest from "@/components/employee/DialogCreateRequest.vue";

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
  fetchData();
});
const fetchData = async () => {
  await requestStore.getRequests();
  requests.value = requestStore.requests;
  loading.value = false;
};
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
