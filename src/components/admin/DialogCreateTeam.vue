<template>
  <Button
    label="Create Team"
    icon="pi pi-th-large"
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
        <div class="text-2xl font-semibold">Create Team</div>
      </div>
    </template>
    <div class="flex flex-wrap justify-center gap-3 px-10 max-sm:px-0">
      <div class="flex flex-col w-full">
        <label for="firstName" class="text-xs px-1 text-surface-600">
          Name
        </label>
        <InputText id="firstName" v-model="form.name" autocomplete="off" />
        <small v-if="errors.name" class="text-red-500 ml-1">
          {{ errors.name }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <label for="description" class="text-xs px-1 text-surface-600">
          Description
        </label>
        <Textarea id="description" v-model="form.description" rows="5" />
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
import { ref } from "vue";
import { useTeamStore } from "@/stores/team";
import { useToast } from "primevue/usetoast";

const teamStore = useTeamStore();
const toast = useToast();
const emit = defineEmits(["fetchData"]);
const form = ref({
  name: null,
  description: null,
});
const visible = ref(false);
const errors = ref({});
const loading = ref(false);

const send = async () => {
  loading.value = true;
  try {
    await teamStore.createTeam(form.value);
    emit("fetchData");
    toast.add({
      closable: false,
      severity: "success",
      summary: "Success",
      detail: "Team created successful!",
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
