<template>
  <div
    class="w-full flex max-lg:flex-col items-center justify-center text-surface-700 py-12 md:px-12"
  >
    <div
      class="p-5 border w-full h-full rounded-lg mx-auto bg-white shadow-xl"
    >
      <div class="text-3xl font-semibold mb-5">Users</div>
      <DataTable
        v-model:filters="filters"
        :value="users"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        size="small"
        :loading="loading"
        removableSort
        :globalFilterFields="['firstName', 'lastName']"
        tableStyle="min-width: 30rem"
        class="border border-surface-200"
      >
        <template #header>
          <div class="flex md:justify-end flex-wrap gap-3">
            <Dropdown
              v-model="filters['role'].value"
              :options="roles"
              placeholder="Filter by role"
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
              <i class="pi pi-search absolute top-2 left-3 text-surface-400" />
              <InputText
                id="search"
                v-model="filters['global'].value"
                placeholder="Search"
                class="pl-10 py-1 font-normal w-48"
                autocomplete="off"
              />
            </span>
          </div>
        </template>
        <template #empty>
          <div class="text-center">
            {{
              user.team ? "No users found." : "You aren't assigned to any team"
            }}
          </div>
        </template>
        <template #loading> Loading users data. Please wait. </template>
        <Column field="firstName" sortable header="First Name" />
        <Column field="lastName" sortable header="Last Name" />
        <Column field="role" sortable header="Role">
          <template #body="{ data }">
            <Tag :severity="getSeverity(data.role)" :value="data.role"></Tag>
          </template>
        </Column>
        <Column header="Actions" headerStyle="width: 5rem; text-align: center">
          <template #body="{ data }">
            <Button
              @click="
                router.push({
                  name: 'personal-employee',
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
import { useUserStore } from "@/stores/user";
import { FilterMatchMode } from "primevue/api";

const router = useRouter();
const userStore = useUserStore();
const prop = defineProps(["user"]);
const users = ref([]);
const loading = ref(true);
const roles = ref(["PERSONAL", "EMPLOYEE"]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  role: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  fetchData();
});
const fetchData = async () => {
  await userStore.getUser();
  if (prop.user.team) {
    await userStore.getUsersByTeam(prop.user.team.id);
    users.value = userStore.users.filter((user) => user.id !== prop.user.id);
  } else {
    users.value = [];
  }
  loading.value = false;
};
const getSeverity = (role) => {
  switch (role) {
    case "ADMIN":
      return "warning";

    case "EMPLOYEE":
      return "success";

    case "PERSONAL":
      return "info";
  }
};
</script>
