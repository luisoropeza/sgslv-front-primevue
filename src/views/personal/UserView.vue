<template>
  <div
    class="w-full flex max-lg:flex-col items-center justify-center text-surface-700 py-12 md:px-12"
  >
    <div
      class="flex flex-col w-full border-2 h-full rounded-lg mx-auto bg-white shadow-xl relative"
    >
      <div class="absolute top-0 left-0">
        <Button icon="pi pi-arrow-left" rounded text @click="router.back()" />
      </div>
      <div class="flex max-xl:flex-col">
        <div class="w-96 max-xl:w-full p-10">
          <div class="space-y-2 flex flex-col">
            <div class="text-2xl font-semibold">User {{ user.username }}</div>
            <div class="mx-auto">
              <img src="../../assets/astronauta1.png" width="300" />
            </div>
          </div>
        </div>
        <Divider layout="vertical" class="max-xl:hidden" />
        <Divider class="xl:hidden" />
        <div class="w-full p-10">
          <div class="flex flex-wrap gap-y-5">
            <div class="w-full md:w-1/2 space-y-5">
              <div class="flex flex-col max-sm:w-full">
                <div class="text-lg font-semibold text-surface-700">
                  First Name:
                </div>
                <div
                  class="text-base font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ user.firstName }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-lg font-semibold text-surface-700">
                  Last Name:
                </div>
                <div
                  class="text-base font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ user.lastName }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-lg font-semibold text-surface-700">Role:</div>
                <div
                  class="text-base font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ user.role }}
                </div>
              </div>
              <div
                v-if="user.role !== 'ADMIN'"
                class="flex flex-col max-sm:w-full"
              >
                <div class="text-lg font-semibold text-surface-700">Team:</div>
                <div
                  class="text-base font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ user.team ? user.team.name : "N/A" }}
                </div>
              </div>
            </div>
            <div class="w-full md:w-1/2 space-y-5">
              <div class="flex flex-col max-sm:w-full">
                <div class="text-lg font-semibold text-surface-700">Email:</div>
                <div
                  class="text-base font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ user.email ? user.email : "N/A" }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-lg font-semibold text-surface-700">Phone:</div>
                <div
                  class="text-base font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ user.phone ? user.phone : " N/A" }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-lg font-semibold text-surface-700">
                  Birth Day:
                </div>
                <div
                  class="text-base font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{
                    user.birthDay
                      ? format(user.birthDay, "DD/MM/YYYY", "en")
                      : "N/A"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="p-6">
        <div class="text-xl font-semibold">History of requests</div>
        <DataTable
          v-model:filters="filters"
          :value="requests"
          paginator
          :rows="4"
          size="small"
          :loading="loading"
          removableSort
          tableStyle="min-width: 30rem"
          class="border border-surface-200"
        >
          <template #header>
            <div class="flex md:justify-end">
              <Dropdown
                v-model="filters['status'].value"
                :options="statuses"
                placeholder="Select Status"
                :showClear="true"
              >
                <template #option="slotProps">
                  <Tag
                    :value="slotProps.option"
                    :severity="getSeverity(slotProps.option)"
                  />
                </template>
              </Dropdown>
            </div>
          </template>
          <template #empty>
            <div class="text-center">No requests found.</div>
          </template>
          <template #loading> Loading requests data. Please wait. </template>
          <Column field="reason" sortable header="Reason" />
          <Column field="status" sortable header="Status">
            <template #body="{ data }">
              <Tag
                :severity="getSeverity(data.status)"
                :value="data.status"
              ></Tag>
            </template>
          </Column>
          <Column field="initDate" sortable header="Init Date">
            <template #body="{ data }">
              {{
                data.initDate
                  ? format(data.initDate, "DD/MM/YYYY", "en")
                  : "N/A"
              }}
            </template>
          </Column>
          <Column field="endDate" sortable header="End Date">
            <template #body="{ data }">
              {{
                data.endDate ? format(data.endDate, "DD/MM/YYYY", "en") : "N/A"
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
                    name: 'personal-employee-request',
                    params: { requestId: data.id, employeeId: id },
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
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useRequestStore } from "@/stores/request";
import { FilterMatchMode } from "primevue/api";
import { format } from "@formkit/tempo";

const router = useRouter();
const userStore = useUserStore();
const requestStore = useRequestStore();
const id = ref(router.currentRoute.value.params.id);
const user = ref({});
const requests = ref([]);
const loading = ref(true);
const statuses = ref(["Pending", "Approved", "Rejected"]);
const filters = ref({
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

onMounted(async () => {
  fetchData();
});
const fetchData = async () => {
  await userStore.getUserById(id.value);
  await requestStore.getRequestsByEmployee(id.value);
  user.value = userStore.user;
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
