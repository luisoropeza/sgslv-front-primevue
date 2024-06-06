<template>
  <Button
    label="Import users"
    icon="pi pi-file-import"
    @click="visible = true"
    outlined
    size="small"
  />
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
        <div class="text-2xl font-semibold">Import users</div>
      </div>
    </template>
    <div class="flex flex-wrap justify-center gap-3 px-10 max-sm:px-0">
      <div class="flex flex-col w-full">
        <label for="file" class="text-xs px-1 text-surface-600"> File: </label>
        <input
          id="file"
          type="file"
          @change="handleFileUpload"
          accept=".xlsx"
          class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex flex-wrap gap-1 mt-5">
        <Button label="Cancel" @click="resetForm" severity="danger" />
        <Button
          label="Confirm"
          @click="send"
          :disabled="file == null"
          severity="success"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { read, utils } from "xlsx";
import { useToast } from "primevue/usetoast";

const userStore = useUserStore();
const toast = useToast();
const emit = defineEmits(["fetchData"]);
const file = ref(null);
const visible = ref(false);
const errors = ref({});
const loading = ref(false);

const send = async () => {
  loading.value = true;
  try {
    const f = file.value;
    const ab = await f.arrayBuffer();
    const wb = read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = utils.sheet_to_json(ws);
    await userStore.importUsers(data);
    emit("fetchData");
    toast.add({
      closable: false,
      severity: "success",
      summary: "Success",
      detail: "Users imported successful!",
      life: 3000,
    });
    resetForm();
  } catch (error) {
    errors.value = error.response.data;
  }
  loading.value = false;
};
const handleFileUpload = (event) => {
  const uploadedFile = event.target.files[0];
  file.value = uploadedFile;
};
const resetForm = () => {
  file.value = null;
  visible.value = false;
  errors.value = {};
};
</script>
