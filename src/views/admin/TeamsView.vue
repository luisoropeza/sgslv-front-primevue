<template>
  <div
    class="w-full flex max-lg:flex-col items-center justify-center text-surface-700 py-12 md:px-12"
  >
    <div class="p-5 h-full w-full border rounded-lg mx-auto bg-white shadow-xl">
      <div class="text-3xl font-semibold mb-5">Teams</div>
      <DataTable
        v-model:expandedRows="expandedRows"
        :value="teams"
        size="small"
        scrollHeight="600px"
        removableSort
        scrollable
        tableStyle="min-width: 40rem"
        class="border border-surface-200"
      >
        <template #header>
          <div class="flex justify-start">
            <DialogCreateTeam @fetchData="fetchData" />
          </div>
        </template>
        <template #empty>
          <div class="text-center">No teams found.</div>
        </template>
        <template #loading> Loading teams data. Please wait. </template>
        <Column expander style="width: 3%" />
        <Column field="name" header="Team" sortable style="width: 10%"></Column>
        <Column header="Description" style="width: 87%">
          <template #body="{ data }">
            {{ data.description ? data.description : "N/A" }}
          </template>
        </Column>
        <template #expansion="propsTeam">
          <div class="p-5 border rounded-md">
            <DataTable
              :value="
                users.filter((user) => user.team?.name === propsTeam.data.name)
              "
              size="small"
              :loading="loading"
              removableSort
              class="border border-surface-200"
            >
              <template #empty>
                <div class="text-center">No users found.</div>
              </template>
              <Column header="Username" field="username" sortable></Column>
              <Column header="First Name" field="firstName" sortable></Column>
              <Column header="Last Name" field="lastName" sortable></Column>
              <Column field="role" sortable header="Role">
                <template #body="{ data }">
                  <Tag
                    :severity="getSeverity(data.role)"
                    :value="data.role"
                  ></Tag>
                </template>
              </Column>
              <Column
                header="Actions"
                headerStyle="width: 5rem; text-align: center"
              >
                <template #body="{ data }">
                  <DialogUpdateUser @fetchData="fetchData" :user="data.id" />
                </template>
              </Column>
              <template #footer>
                <div class="flex justify-end font-bold w-full px-2">
                  Total users:
                  {{
                    users.filter(
                      (user) => user.team?.name === propsTeam.data.name
                    ).length
                  }}
                </div>
              </template>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useTeamStore } from "@/stores/team";
import DialogCreateTeam from "@/components/admin/DialogCreateTeam.vue";
import DialogUpdateUser from "@/components/admin/DialogUpdateUser.vue";

const userStore = useUserStore();
const teamStore = useTeamStore();
const users = ref([]);
const teams = ref([]);
const prop = defineProps(["user"]);
const loading = ref(true);
const expandedRows = ref([]);

onMounted(async () => {
  fetchData();
});
const fetchData = async () => {
  await userStore.getUser();
  await userStore.getAllUsers();
  await teamStore.getAllTeams();
  users.value = userStore.users.filter((user) => user.id !== prop.user.id);
  teams.value = teamStore.teams;
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
