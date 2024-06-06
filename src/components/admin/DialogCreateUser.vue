<template>
  <Button
    label="Create User"
    icon="pi pi-user-plus"
    @click="visible = true"
    outlined
    size="small"
  />
  <Toast />
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    header="Header"
    class="max-sm:w-full"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <Message v-if="errors.message" :closable="false" severity="error">
      {{ errors.message }}
    </Message>
    <template #header>
      <div>
        <div class="text-2xl font-semibold">Create User</div>
      </div>
    </template>
    <div class="flex flex-wrap justify-center gap-3 px-10 max-sm:px-0">
      <div class="flex flex-col w-full">
        <label for="firstName" class="text-xs px-1 text-surface-600">
          First Name
        </label>
        <InputText id="firstName" v-model="form.firstName" autocomplete="off" />
        <small v-if="errors.firstName" class="text-red-500 ml-1">
          {{ errors.firstName }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <label for="lastName" class="text-xs px-1 text-surface-600">
          Last Name
        </label>
        <InputText id="lastName" v-model="form.lastName" autocomplete="off" />
        <small v-if="errors.lastName" class="text-red-500 ml-1">
          {{ errors.lastName }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <label for="username" class="text-xs px-1 text-surface-600">
          Username
        </label>
        <InputText id="username" v-model="form.username" autocomplete="off" />
        <small v-if="errors.username" class="text-red-500 ml-1">
          {{ errors.username }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <label for="password" class="text-xs px-1 text-surface-600">
          Password
        </label>
        <Password
          inputId="password"
          v-model="form.password"
          toggle-mask
          :feedback="false"
        />
        <small v-if="errors.password" class="text-red-500 ml-1">
          {{ errors.password }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <div class="text-xs px-1 text-surface-600">Roles</div>
        <Dropdown
          v-model="form.role"
          :options="roles"
          placeholder="Select a role"
        />
        <small v-if="errors.role" class="text-red-500 ml-1">
          {{ errors.role }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <div class="text-xs px-1 text-surface-600">Teams</div>
        <Dropdown
          v-model="form.team"
          :options="teams"
          placeholder="Select a team"
          optionLabel="name"
          optionValue="name"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex flex-wrap gap-1 mt-5">
        <Button label="Cancel" @click="resetForm" severity="danger" />
        <Button
          label="Confirm"
          @click="send"
          severity="success"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import { useToast } from "primevue/usetoast";

const teamStore = useTeamStore();
const userStore = useUserStore();
const toast = useToast();
const emit = defineEmits(["fetchData"]);
const form = ref({
  username: null,
  password: null,
  firstName: null,
  lastName: null,
  role: null,
  team: null,
});
const roles = ref(["PERSONAL", "EMPLOYEE"]);
const teams = ref([]);
const visible = ref(false);
const errors = ref({});
const loading = ref(false);

onMounted(async () => {
  await teamStore.getAllTeams();
  teams.value = teamStore.teams;
});

const send = async () => {
  loading.value = true;
  try {
    await userStore.createUser(form.value);
    emit("fetchData");
    toast.add({
      closable: false,
      severity: "success",
      summary: "Success",
      detail: "User created successful!",
      life: 3000,
    });
    resetForm();
  } catch (error) {
    errors.value = error.response.data;
  }
  loading.value = false;
};
const resetForm = () => {
  form.value = {};
  visible.value = false;
  errors.value = {};
};
</script>
