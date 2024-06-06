<template>
  <Button @click="fetchData" size="small" icon="pi pi-cog" severity="info" />
  <Toast />
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    header="Header"
    class="max-sm:w-full"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <Message severity="error" v-if="errors.message" :closable="false">
      {{ errors.message }}
    </Message>
    <template #header>
      <div>
        <div class="text-2xl font-semibold">Update User</div>
      </div>
    </template>
    <div class="flex flex-wrap justify-center gap-3 px-10 max-sm:px-0">
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
        <Button label="Cancel" @click="visible = false" severity="danger" />
        <Button
          label="Confirm"
          @click="send"
          severity="success"
          :loading="loading"
          :disabled="JSON.stringify(form) === JSON.stringify(formCopy)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from "vue";
import { useTeamStore } from "@/stores/team";
import { useUserStore } from "@/stores/user";
import { useToast } from "primevue/usetoast";

const teamStore = useTeamStore();
const userStore = useUserStore();
const toast = useToast();
const emit = defineEmits(["fetchData"]);
const prop = defineProps(["user"]);
const user = ref({});
const form = ref({});
const formCopy = ref({});
const roles = ref(["PERSONAL", "EMPLOYEE"]);
const teams = ref([]);
const visible = ref(false);
const errors = ref({});
const loading = ref(false);

const fetchData = async () => {
  await userStore.getUserById(prop.user);
  await teamStore.getAllTeams();
  user.value = userStore.user;
  teams.value = teamStore.teams;
  initForm();
  visible.value = true;
};
const send = async () => {
  loading.value = true;
  try {
    await userStore.updateUserById(prop.user, form.value);
    emit("fetchData");
    toast.add({
      closable: false,
      severity: "success",
      summary: "Success",
      detail: "User updated successful!",
      life: 3000,
    });
    visible.value = false;
  } catch (error) {
    errors.value = error.response.data;
  }
  loading.value = false;
};
const initForm = () => {
  form.value = {
    password: null,
    role: user.value.role,
    team: user.value.team ? user.value.team.name : null,
  };
  formCopy.value = { ...form.value };
  errors.value = {};
};
</script>
