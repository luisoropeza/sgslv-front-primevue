<template>
  <Button
    label="Create Request"
    icon="pi pi-pencil"
    @click="visible = true"
    outlined
    size="small"
    :disabled="user.team === null || disable"
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
    <Message :closable="false" severity="error" v-if="errors.message">
      {{ errors.message }}
    </Message>
    <template #header>
      <div>
        <div class="text-2xl font-semibold">Create Request</div>
      </div>
    </template>
    <div class="flex flex-wrap justify-center gap-3 p-5 px-10 max-sm:px-0">
      <div class="flex flex-col w-full">
        <label for="initDate" class="text-xs px-1 text-surface-600">
          Init Date:
        </label>
        <input
          id="initDate"
          v-model="form.initDate"
          type="date"
          class="font-sans leading-6 m-0 py-1.5 px-3 sm:text-sm text-surface-900 placeholder:text-surface-400 bg-surface-0 shadow-sm ring-1 ring-inset ring-offset-0 ring-surface-300 rounded-md appearance-none outline-none focus:ring-primary-500"
        />
        <small v-if="errors.initDate" class="text-red-500 ml-1">
          {{ errors.initDate }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <label for="endDate" class="text-xs px-1 text-surface-600">
          End Date:
        </label>
        <input
          id="endDate"
          v-model="form.endDate"
          type="date"
          class="font-sans leading-6 m-0 py-1.5 px-3 sm:text-sm text-surface-900 placeholder:text-surface-400 bg-surface-0 shadow-sm ring-1 ring-inset ring-offset-0 ring-surface-300 rounded-md appearance-none outline-none focus:ring-primary-500"
        />
        <small v-if="errors.endDate" class="text-red-500 ml-1">
          {{ errors.endDate }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <div class="text-xs px-1 text-surface-600">Reason</div>
        <Dropdown
          v-model="form.reason"
          :options="reasons"
          placeholder="Select a reason"
        />
        <small v-if="errors.reason" class="text-red-500 ml-1">
          {{ errors.reason }}
        </small>
      </div>
      <div class="flex flex-col w-full">
        <label for="file" class="text-xs px-1 text-surface-600">
          File:
          <span
            class="pi pi-info-circle"
            v-tooltip="{ value: 'Please only send documents in PDF format.' }"
          >
          </span>
        </label>
        <input
          id="file"
          type="file"
          @change="handleFileUpload"
          accept="application/pdf"
          class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>
      <div class="flex flex-col w-full">
        <div class="flex justify-between">
          <label for="description" class="text-xs px-1 text-surface-600">
            Description:
          </label>
          <span class="text-xs text-surface-600">{{ charCount }} / 1000</span>
        </div>
        <Textarea
          id="description"
          v-model="form.description"
          rows="5"
          @input="countCharacters"
          maxlength="1000"
        />
        <small v-if="errors.description" class="text-red-500 ml-1">
          {{ errors.description }}
        </small>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-wrap gap-1 mt-5">
        <Button
          label="Cancel"
          @click="resetForm"
          severity="danger"
          :disabled="loading"
        />
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
import { useRequestStore } from "@/stores/request";
import { useToast } from "primevue/usetoast";

const requestStore = useRequestStore();
const toast = useToast();
const emit = defineEmits(["fetchData"]);
const prop = defineProps(["user", "disable"]);
const reasons = ref(["Medical license", "Vacation", "Other"]);
const form = ref({
  initDate: null,
  endDate: null,
  reason: null,
  description: null,
  file: null,
});
const visible = ref(false);
const errors = ref({});
const loading = ref(false);
const charCount = ref(0);

const send = async () => {
  loading.value = true;
  try {
    await requestStore.createRequest(form.value);
    emit("fetchData");
    toast.add({
      closable: false,
      severity: "success",
      summary: "Success",
      detail: "Request created successful!",
      life: 3000,
    });
    resetForm();
  } catch (error) {
    errors.value = error.response.data;
  }
  loading.value = false;
};
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  form.value.file = file;
};
const resetForm = () => {
  form.value = {};
  visible.value = false;
  charCount.value = 0;
  errors.value = {};
};
const countCharacters = () => {
  charCount.value = description.value.length;
};
</script>
