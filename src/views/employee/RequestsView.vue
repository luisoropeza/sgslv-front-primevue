<template>
  <div
    class="w-full flex max-lg:flex-col items-center justify-center text-surface-700 py-12 md:px-12"
  >
    <div
      class="p-5 border w-full h-full rounded-lg mx-auto bg-white shadow-xl"
    >
      <div class="text-3xl font-semibold mb-5">Requests</div>
      <DataTable
        v-model:filters="filters"
        :value="requests"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        size="small"
        :loading="loading"
        removableSort
        tableStyle="min-width: 30rem"
        class="border border-surface-200"
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
            <div class="flex flex-wrap gap-3">
              <Dropdown
                v-model="filters['status'].value"
                :options="statuses"
                placeholder="Filter by status"
                :showClear="true"
              >
                <template #option="slotProps">
                  <Tag
                    :value="slotProps.option"
                    :severity="getSeverity(slotProps.option)"
                  />
                </template>
              </Dropdown>
              <span class="relative">
                <i
                  class="pi pi-search absolute top-2 left-3 text-surface-400"
                />
                <InputText
                  id="search"
                  v-model="filters['global'].value"
                  placeholder="Search"
                  class="pl-10 py-1 font-normal w-48"
                  autocomplete="off"
                />
              </span>
            </div>
          </div>
        </template>
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
                  name: 'employee-request',
                  params: { id: data.id },
                })
              "
              size="small"
              icon="pi pi-eye"
              severity="info"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRequestStore } from "@/stores/request";
import { FilterMatchMode } from "primevue/api";
import { format } from "@formkit/tempo";
import DialogCreateRequest from "@/components/employee/DialogCreateRequest.vue";

const router = useRouter();
const requestStore = useRequestStore();
const prop = defineProps(["user"]);
const requests = ref([]);
const loading = ref(true);
const statuses = ref(["Pending", "Approved", "Rejected"]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

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
