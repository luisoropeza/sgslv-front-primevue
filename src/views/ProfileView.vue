<template>
  <div
    class="w-full flex max-lg:flex-col items-center justify-center text-surface-700 py-12 md:px-12"
  >
    <div class="p-5 h-full w-full border rounded-lg mx-auto bg-white shadow-xl">
      <div class="flex max-xl:flex-col border-2 h-full rounded-lg">
        <div class="w-96 max-xl:w-full flex flex-col p-6 space-y-2">
          <div class="text-2xl font-semibold">Edit</div>
          <div class="text-base font-normal">
            Your personal information, would you like to edit it?
          </div>
          <div class="mx-auto">
            <img src="../assets/astronauta1.png" width="300" />
          </div>
        </div>
        <Divider layout="vertical" class="max-xl:hidden" />
        <Divider class="xl:hidden" />
        <div class="w-full flex flex-col justify-between p-6">
          <div
            class="flex flex-col items-center justify-center h-full space-y-4"
          >
            <div class="flex flex-col w-4/5 max-lg:w-full">
              <label
                for="firstName"
                class="text-base font-medium px-1 text-surface-600"
              >
                First Name
              </label>
              <InputText
                id="firstName"
                v-model="form.firstName"
                autocomplete="off"
              />
              <small v-if="errors.firstName" class="text-red-500 ml-1">
                {{ errors.firstName }}
              </small>
            </div>
            <div class="flex flex-col w-4/5 max-lg:w-full">
              <label
                for="lastName"
                class="text-base font-medium px-1 text-surface-600"
              >
                Last Name
              </label>
              <InputText
                id="lastName"
                v-model="form.lastName"
                autocomplete="off"
              />
              <small v-if="errors.lastName" class="text-red-500 ml-1">
                {{ errors.lastName }}
              </small>
            </div>
            <div class="flex flex-col w-4/5 max-lg:w-full">
              <label
                for="username"
                class="text-base font-medium px-1 text-surface-600"
              >
                Username
              </label>
              <InputText
                id="username"
                v-model="form.username"
                autocomplete="off"
              />
              <small v-if="errors.username" class="text-red-500 ml-1">
                {{ errors.username }}
              </small>
            </div>
            <div class="flex flex-col w-4/5 max-lg:w-full">
              <label
                for="password"
                class="text-base font-medium px-1 text-surface-600"
              >
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
            <div class="flex flex-col w-4/5 max-lg:w-full">
              <label
                for="email"
                class="text-base font-medium px-1 text-surface-600"
                >Email</label
              >
              <InputText id="email" v-model="form.email" autocomplete="off" />
              <small v-if="errors.email" class="text-red-500 ml-1">
                {{ errors.email }}
              </small>
            </div>
            <div class="flex flex-col w-4/5 max-lg:w-full">
              <label
                for="phone"
                class="text-base font-medium px-1 text-surface-600"
                >Phone</label
              >
              <InputText id="phone" v-model="form.phone" autocomplete="off" />
              <small v-if="errors.phone" class="text-red-500 ml-1">
                {{ errors.phone }}
              </small>
            </div>
            <div class="flex flex-col w-4/5 max-lg:w-full">
              <label
                for="birthDay"
                class="text-base font-medium px-1 text-surface-600"
              >
                Birth day
              </label>
              <input
                id="birthDay"
                v-model="form.birthDay"
                type="date"
                class="leading-6 m-0 py-1.5 px-3 sm:text-sm text-surface-900 placeholder:text-surface-400 bg-surface-0 shadow-sm ring-1 ring-inset ring-offset-0 ring-surface-300 rounded-md appearance-none outline-none focus:ring-primary-500"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-2 pt-6 justify-end">
            <Toast />
            <Button
              label="Reset Form"
              @click="initForm"
              :disabled="
                JSON.stringify(form) === JSON.stringify(formCopy) || loading
              "
              severity="danger"
            />
            <Button
              label="Confirm"
              @click="send"
              :disabled="JSON.stringify(form) === JSON.stringify(formCopy)"
              severity="success"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useToast } from "primevue/usetoast";
import { format } from "@formkit/tempo";

const userStore = useUserStore();
const toast = useToast();
const emit = defineEmits(["fetchData"]);
const prop = defineProps(["user"]);
const form = ref({});
const formCopy = ref({});
const errors = ref({});
const loading = ref(false);

onMounted(async () => {
  fetchData();
});
const fetchData = async () => {
  await userStore.getUser();
  initForm();
};
const send = async () => {
  loading.value = true;
  try {
    await userStore.updateUser(form.value);
    emit("fetchData");
    fetchData();
    toast.add({
      closable: false,
      severity: "success",
      summary: "Success",
      detail: "Update profile successful!",
      life: 3000,
    });
  } catch (error) {
    errors.value = error.response.data;
    if (errors.value.message) {
      toast.add({
        closable: false,
        severity: "error",
        summary: "Error updating: " + errors.value.message,
        life: 5000,
      });
    }
  }
  loading.value = false;
};
const initForm = () => {
  form.value = {
    username: prop.user.username,
    password: null,
    firstName: prop.user.firstName,
    lastName: prop.user.lastName,
    email: prop.user.email,
    phone: prop.user.phone,
    birthDay: prop.user.birthDay,
  };
  formCopy.value = { ...form.value };
  errors.value = {};
};
</script>
